package com.civicissue.dto.admin;

import java.util.Map;

public class AnalyticsResponse {
    private Long totalIssues;
    private Map<String, Long> issuesByStatus;
    private Map<String, Long> issuesByCategory;
    private Double averageResolutionTime;
    private Long pendingOver7Days;
    private Long urgentIssues;

    // Getters and Setters
    public Long getTotalIssues() { return totalIssues; }
    public void setTotalIssues(Long totalIssues) { this.totalIssues = totalIssues; }
    public Map<String, Long> getIssuesByStatus() { return issuesByStatus; }
    public void setIssuesByStatus(Map<String, Long> issuesByStatus) { this.issuesByStatus = issuesByStatus; }
    public Map<String, Long> getIssuesByCategory() { return issuesByCategory; }
    public void setIssuesByCategory(Map<String, Long> issuesByCategory) { this.issuesByCategory = issuesByCategory; }
    public Double getAverageResolutionTime() { return averageResolutionTime; }
    public void setAverageResolutionTime(Double averageResolutionTime) { this.averageResolutionTime = averageResolutionTime; }
    public Long getPendingOver7Days() { return pendingOver7Days; }
    public void setPendingOver7Days(Long pendingOver7Days) { this.pendingOver7Days = pendingOver7Days; }
    public Long getUrgentIssues() { return urgentIssues; }
    public void setUrgentIssues(Long urgentIssues) { this.urgentIssues = urgentIssues; }
}