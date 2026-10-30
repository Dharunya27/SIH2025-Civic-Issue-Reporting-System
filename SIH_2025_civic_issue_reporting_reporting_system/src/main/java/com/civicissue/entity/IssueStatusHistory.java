package com.civicissue.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_status_history")
public class IssueStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Issue.Status status;

    @CreationTimestamp
    private LocalDateTime changedAt;

    private String notes;

    // NEW FIELD FOR ADMIN FUNCTIONALITY
    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    // Constructors, Getters, and Setters
    public IssueStatusHistory() {}

    public IssueStatusHistory(Issue issue, Issue.Status status, String notes) {
        this.issue = issue;
        this.status = status;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Issue getIssue() { return issue; }
    public void setIssue(Issue issue) { this.issue = issue; }
    public Issue.Status getStatus() { return status; }
    public void setStatus(Issue.Status status) { this.status = status; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // NEW GETTER AND SETTER
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}