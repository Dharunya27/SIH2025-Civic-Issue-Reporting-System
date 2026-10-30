package com.civicissue.dto;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String voterId;
    private String name;

    public JwtResponse(String token, Long userId, String voterId, String name) {
        this.token = token;
        this.userId = userId;
        this.voterId = voterId;
        this.name = name;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}