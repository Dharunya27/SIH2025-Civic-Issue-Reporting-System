package com.civicissue.dto.admin;

import jakarta.validation.constraints.NotBlank;

public class AdminLoginRequest {

    @NotBlank(message = "Government ID is required")
    private String govId;

    @NotBlank(message = "Password is required")
    private String password;

    // Getters and Setters
    public String getGovId() { return govId; }
    public void setGovId(String govId) { this.govId = govId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}