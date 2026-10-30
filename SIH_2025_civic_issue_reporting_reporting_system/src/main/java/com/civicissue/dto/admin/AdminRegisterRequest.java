package com.civicissue.dto.admin;

import jakarta.validation.constraints.*;

public class AdminRegisterRequest {

    @NotBlank(message = "Government ID is required")
    private String govId;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be 10 digits starting with 6-9")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Working municipal area is required")
    private String workingMunicipalArea;

    // Getters and Setters
    public String getGovId() { return govId; }
    public void setGovId(String govId) { this.govId = govId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getWorkingMunicipalArea() { return workingMunicipalArea; }
    public void setWorkingMunicipalArea(String workingMunicipalArea) { this.workingMunicipalArea = workingMunicipalArea; }
}