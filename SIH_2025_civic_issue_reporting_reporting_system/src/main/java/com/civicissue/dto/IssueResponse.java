package com.civicissue.dto;

import com.civicissue.entity.Issue.Category;
import com.civicissue.entity.Issue.Status;
import java.time.LocalDateTime;
import java.util.List;

public class IssueResponse {
    private String reportId;
    private String description;
    private String photoUrl;
    private String voiceNoteUrl;
    private Double latitude;
    private Double longitude;
    private Integer municipalWardNumber;
    private String municipalArea; // Added field
    private Category category;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<StatusHistoryDto> statusHistory;

    // Getters and Setters
    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getVoiceNoteUrl() { return voiceNoteUrl; }
    public void setVoiceNoteUrl(String voiceNoteUrl) { this.voiceNoteUrl = voiceNoteUrl; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Integer getMunicipalWardNumber() { return municipalWardNumber; }
    public void setMunicipalWardNumber(Integer municipalWardNumber) { this.municipalWardNumber = municipalWardNumber; }
    public String getMunicipalArea() { return municipalArea; } // Added getter
    public void setMunicipalArea(String municipalArea) { this.municipalArea = municipalArea; } // Added setter
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<StatusHistoryDto> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<StatusHistoryDto> statusHistory) { this.statusHistory = statusHistory; }
}