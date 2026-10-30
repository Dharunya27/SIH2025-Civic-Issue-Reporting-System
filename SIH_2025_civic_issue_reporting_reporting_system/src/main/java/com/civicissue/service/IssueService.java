package com.civicissue.service;

import com.civicissue.dto.IssueRequest;
import com.civicissue.dto.IssueResponse;
import com.civicissue.dto.StatusHistoryDto;
import com.civicissue.entity.Issue;
import com.civicissue.entity.IssueStatusHistory;
import com.civicissue.entity.User;
import com.civicissue.repository.IssueRepository;
import com.civicissue.repository.IssueStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private IssueStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private UserService userService;

    public Issue createIssue(IssueRequest issueRequest) {
        User currentUser = userService.getCurrentUser();

        Issue issue = new Issue();
        issue.setUser(currentUser);
        issue.setDescription(issueRequest.getDescription());
        issue.setPhotoUrl(issueRequest.getPhotoUrl());
        issue.setVoiceNoteUrl(issueRequest.getVoiceNoteUrl());
        issue.setLatitude(issueRequest.getLatitude());
        issue.setLongitude(issueRequest.getLongitude());
        issue.setMunicipalWardNumber(issueRequest.getMunicipalWardNumber());
        issue.setMunicipalArea(currentUser.getMunicipalArea()); // Set municipal area from user
        issue.setCategory(issueRequest.getCategory());

        Issue savedIssue = issueRepository.save(issue);

        // Create initial status history
        IssueStatusHistory statusHistory = new IssueStatusHistory(
                savedIssue,
                Issue.Status.PENDING,
                "Issue reported by user"
        );
        statusHistoryRepository.save(statusHistory);

        return savedIssue;
    }

    public List<IssueResponse> getUserIssues() {
        User currentUser = userService.getCurrentUser();
        List<Issue> issues = issueRepository.findByUserOrderByCreatedAtDesc(currentUser);

        return issues.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private IssueResponse convertToResponse(Issue issue) {
        IssueResponse response = new IssueResponse();
        response.setReportId(issue.getReportId());
        response.setDescription(issue.getDescription());
        response.setPhotoUrl(issue.getPhotoUrl());
        response.setVoiceNoteUrl(issue.getVoiceNoteUrl());
        response.setLatitude(issue.getLatitude());
        response.setLongitude(issue.getLongitude());
        response.setMunicipalWardNumber(issue.getMunicipalWardNumber());
        response.setMunicipalArea(issue.getMunicipalArea()); // Add municipal area to response
        response.setCategory(issue.getCategory());
        response.setStatus(issue.getStatus());
        response.setCreatedAt(issue.getCreatedAt());
        response.setUpdatedAt(issue.getUpdatedAt());

        // Get status history
        List<IssueStatusHistory> statusHistory = statusHistoryRepository
                .findByIssueOrderByChangedAtAsc(issue);

        List<StatusHistoryDto> statusHistoryDto = statusHistory.stream()
                .map(history -> {
                    StatusHistoryDto dto = new StatusHistoryDto();
                    dto.setStatus(history.getStatus());
                    dto.setChangedAt(history.getChangedAt());
                    dto.setNotes(history.getNotes());
                    dto.setAdminNotes(history.getAdminNotes()); // Add admin notes
                    return dto;
                })
                .collect(Collectors.toList());

        response.setStatusHistory(statusHistoryDto);
        return response;
    }
}