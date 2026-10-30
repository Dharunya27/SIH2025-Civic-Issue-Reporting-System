package com.civicissue.dto;

import com.civicissue.entity.Issue.Status;
import java.time.LocalDateTime;

public class StatusHistoryDto {
    private Status status;
    private LocalDateTime changedAt;
    private String notes;
    private String adminNotes; // Added field

    // Getters and Setters
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getAdminNotes() { return adminNotes; } // Added getter
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; } // Added setter
}