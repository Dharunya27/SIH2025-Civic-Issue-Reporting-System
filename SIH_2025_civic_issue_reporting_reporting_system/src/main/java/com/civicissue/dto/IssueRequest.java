package com.civicissue.dto;

import com.civicissue.entity.Issue.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class IssueRequest {

    @NotBlank(message = "Description is required")
    private String description;

    private String photoUrl;

    private String voiceNoteUrl;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Integer municipalWardNumber;

    @NotNull(message = "Category is required")
    private Category category;

    // Getters and Setters
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
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}