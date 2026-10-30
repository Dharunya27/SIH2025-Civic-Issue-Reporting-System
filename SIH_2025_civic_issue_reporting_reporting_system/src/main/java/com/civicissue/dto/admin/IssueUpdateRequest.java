package com.civicissue.dto.admin;

import com.civicissue.entity.Issue.Status;
import jakarta.validation.constraints.NotNull;

public class IssueUpdateRequest {

    @NotNull(message = "Status is required")
    private Status status;

    private String adminNotes;

    // Getters and Setters
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}