package com.civicissue.service.admin;

import com.civicissue.dto.admin.AssignmentRequest;
import com.civicissue.dto.admin.IssueUpdateRequest;
import com.civicissue.entity.*;
import com.civicissue.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private IssueStatusHistoryRepository statusHistoryRepository;

    public Admin getCurrentAdmin() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return adminRepository.findByGovId(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    public List<Issue> getIssuesByMunicipalArea(String municipalArea) {
        return issueRepository.findByMunicipalAreaOrderByCreatedAtDesc(municipalArea);
    }

    public List<Issue> getIssuesByCategory(String municipalArea, Issue.Category category) {
        return issueRepository.findByMunicipalAreaAndCategoryOrderByCreatedAtDesc(municipalArea, category);
    }

    public List<Issue> getIssuesByStatus(String municipalArea, Issue.Status status) {
        return issueRepository.findByMunicipalAreaAndStatusOrderByCreatedAtDesc(municipalArea, status);
    }

    public List<Issue> getIssuesByWard(String municipalArea, Integer wardNumber) {
        return issueRepository.findByMunicipalAreaAndMunicipalWardNumberOrderByCreatedAtDesc(municipalArea, wardNumber);
    }

    public List<Issue> getPriorityIssues(String municipalArea) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Issue> urgentIssues = issueRepository.findUrgentIssuesByMunicipalArea(municipalArea);
        List<Issue> oldPendingIssues = issueRepository.findPendingIssuesOlderThan(municipalArea, sevenDaysAgo);

        urgentIssues.addAll(oldPendingIssues);
        return urgentIssues;
    }

    public Issue updateIssueStatus(Long issueId, IssueUpdateRequest updateRequest) {
        Admin admin = getCurrentAdmin();
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        // This now works because getMunicipalArea() exists in Issue entity
        if (!issue.getMunicipalArea().equals(admin.getWorkingMunicipalArea())) {
            throw new RuntimeException("Access denied: Issue not in your municipal area");
        }

        Issue.Status oldStatus = issue.getStatus();
        issue.setStatus(updateRequest.getStatus());
        issue.setUpdatedAt(LocalDateTime.now());

        if (updateRequest.getStatus() == Issue.Status.RESOLVED) {
            issue.setResolvedAt(LocalDateTime.now());
        }

        IssueStatusHistory history = new IssueStatusHistory();
        history.setIssue(issue);
        history.setStatus(updateRequest.getStatus());
        history.setAdminNotes(updateRequest.getAdminNotes());
        history.setNotes("Status changed from " + oldStatus + " to " + updateRequest.getStatus() +
                " by admin: " + admin.getName());

        statusHistoryRepository.save(history);
        return issueRepository.save(issue);
    }

    public Issue assignIssueToWorker(Long issueId, AssignmentRequest assignmentRequest) {
        Admin admin = getCurrentAdmin();
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        Worker worker = workerRepository.findById(assignmentRequest.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        // This now works because getMunicipalArea() exists in Issue entity
        if (!issue.getMunicipalArea().equals(admin.getWorkingMunicipalArea())) {
            throw new RuntimeException("Access denied: Issue not in your municipal area");
        }

        if (!worker.getMunicipalArea().equals(admin.getWorkingMunicipalArea())) {
            throw new RuntimeException("Worker is not assigned to this municipal area");
        }

        issue.setAssignedWorker(worker);
        issue.setUpdatedAt(LocalDateTime.now());

        IssueStatusHistory history = new IssueStatusHistory();
        history.setIssue(issue);
        history.setStatus(issue.getStatus());
        history.setNotes("Issue assigned to worker: " + worker.getName() + " by admin: " + admin.getName());

        statusHistoryRepository.save(history);
        return issueRepository.save(issue);
    }

    public List<Worker> getWorkersByMunicipalArea(String municipalArea) {
        return workerRepository.findByMunicipalArea(municipalArea);
    }

    public Worker createWorker(Worker worker) {
        Admin admin = getCurrentAdmin();

        if (workerRepository.existsByContact(worker.getContact())) {
            throw new RuntimeException("Worker with this contact already exists");
        }

        worker.setMunicipalArea(admin.getWorkingMunicipalArea());
        return workerRepository.save(worker);
    }
}