package com.civicissue.controller;

import com.civicissue.dto.IssueRequest;
import com.civicissue.dto.IssueResponse;
import com.civicissue.entity.Issue;
import com.civicissue.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createIssue(@Valid @RequestBody IssueRequest issueRequest) {
        try {
            Issue issue = issueService.createIssue(issueRequest);
            return ResponseEntity.ok("Issue created successfully with ID: " + issue.getReportId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating issue: " + e.getMessage());
        }
    }

    @GetMapping("/my-issues")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<IssueResponse>> getUserIssues() {
        List<IssueResponse> issues = issueService.getUserIssues();
        return ResponseEntity.ok(issues);
    }
}