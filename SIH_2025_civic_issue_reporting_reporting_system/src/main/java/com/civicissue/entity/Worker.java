package com.civicissue.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "workers")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Worker name is required")
    private String name;

    @NotBlank(message = "Contact number is required")
    @Column(unique = true)
    private String contact;

    private String skills;

    private String municipalArea;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // Constructors
    public Worker() {}

    public Worker(String name, String contact, String municipalArea) {
        this.name = name;
        this.contact = contact;
        this.municipalArea = municipalArea;
    }

    public Worker(String name, String contact, String skills, String municipalArea) {
        this.name = name;
        this.contact = contact;
        this.skills = skills;
        this.municipalArea = municipalArea;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    // Alias for phoneNumber to support both frontend conventions
    @JsonProperty("phoneNumber")
    public String getPhoneNumber() { return contact; }

    @JsonProperty("phoneNumber")
    public void setPhoneNumber(String phoneNumber) {
        if (this.contact == null || this.contact.trim().isEmpty()) {
            this.contact = phoneNumber;
        }
    }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getMunicipalArea() { return municipalArea; }
    public void setMunicipalArea(String municipalArea) { this.municipalArea = municipalArea; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
