package com.civicissue.service.admin;

import com.civicissue.dto.admin.AnalyticsResponse;
import com.civicissue.entity.Issue;
import com.civicissue.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private AdminService adminService;

    public AnalyticsResponse getAnalytics(String municipalArea) {
        AnalyticsResponse response = new AnalyticsResponse();

        response.setTotalIssues(issueRepository.countByMunicipalArea(municipalArea));

        List<Object[]> statusCounts = issueRepository.countByStatusAndMunicipalArea(municipalArea);
        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] result : statusCounts) {
            statusMap.put(result[0].toString(), (Long) result[1]);
        }
        response.setIssuesByStatus(statusMap);

        List<Object[]> categoryCounts = issueRepository.countByCategoryAndMunicipalArea(municipalArea);
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] result : categoryCounts) {
            categoryMap.put(result[0].toString(), (Long) result[1]);
        }
        response.setIssuesByCategory(categoryMap);

        response.setAverageResolutionTime(calculateAverageResolutionTime(municipalArea));

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        response.setPendingOver7Days((long) issueRepository.findPendingIssuesOlderThan(municipalArea, sevenDaysAgo).size());

        response.setUrgentIssues((long) issueRepository.findUrgentIssuesByMunicipalArea(municipalArea).size());

        return response;
    }

    private Double calculateAverageResolutionTime(String municipalArea) {
        List<Issue> resolvedIssues = issueRepository.findByMunicipalAreaAndStatusOrderByCreatedAtDesc(
                municipalArea, Issue.Status.RESOLVED);

        if (resolvedIssues.isEmpty()) {
            return 0.0;
        }

        double totalHours = 0;
        for (Issue issue : resolvedIssues) {
            if (issue.getCreatedAt() != null && issue.getResolvedAt() != null) {
                Duration duration = Duration.between(issue.getCreatedAt(), issue.getResolvedAt());
                totalHours += duration.toHours();
            }
        }

        return totalHours / resolvedIssues.size();
    }
}