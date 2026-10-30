package com.civicissue.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;


@Entity
@Table(name = "admins", uniqueConstraints = {
        @UniqueConstraint(columnNames = "govId"),
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "phone")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String govId;

    @NotBlank
    private String name;

    @Email
    @Column(unique = true, nullable = true)
    private String email;

    @NotBlank
    @Column(unique = true)
    private String phone;

    @NotBlank
    private String password;

    @NotBlank
    private String workingMunicipalArea;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private User.Role role = User.Role.ROLE_ADMIN;

    // Constructors, Getters, and Setters
    public Admin() {}

    public Admin(String govId, String name, String email, String phone,
                 String password, String workingMunicipalArea) {
        this.govId = govId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.workingMunicipalArea = workingMunicipalArea;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
}