package com.civicissue.dto;

import java.time.LocalDateTime;

public class UserProfileResponse {
    private Long userId;
    private String voterId;
    private String name;
    private String email;
    private String phoneNumber;
    private String state;
    private String district;
    private String municipalArea;
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getMunicipalArea() { return municipalArea; }
    public void setMunicipalArea(String municipalArea) { this.municipalArea = municipalArea; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}