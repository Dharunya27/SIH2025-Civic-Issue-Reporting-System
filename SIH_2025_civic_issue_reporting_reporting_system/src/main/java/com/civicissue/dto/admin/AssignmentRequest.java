package com.civicissue.dto.admin;

import jakarta.validation.constraints.NotNull;

public class AssignmentRequest {

    @NotNull(message = "Worker ID is required")
    private Long workerId;

    // Getters and Setters
    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }
}