package com.civicissue.controller.admin;

import com.civicissue.dto.admin.AssignmentRequest;
import com.civicissue.dto.admin.IssueUpdateRequest;
import com.civicissue.entity.Admin;
import com.civicissue.entity.Issue;
import com.civicissue.entity.Worker;
import com.civicissue.service.admin.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/issues")
@CrossOrigin(origins = "*")
public class AdminIssueController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Issue>> getAllIssues() {
        Admin admin = adminService.getCurrentAdmin();
        List<Issue> issues = adminService.getIssuesByMunicipalArea(admin.getWorkingMunicipalArea());
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Issue>> getIssuesByCategory(@PathVariable Issue.Category category) {
        Admin admin = adminService.getCurrentAdmin();
        List<Issue> issues = adminService.getIssuesByCategory(admin.getWorkingMunicipalArea(), category);
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Issue>> getIssuesByStatus(@PathVariable Issue.Status status) {
        Admin admin = adminService.getCurrentAdmin();
        List<Issue> issues = adminService.getIssuesByStatus(admin.getWorkingMunicipalArea(), status);
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/ward/{wardNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Issue>> getIssuesByWard(@PathVariable Integer wardNumber) {
        Admin admin = adminService.getCurrentAdmin();
        List<Issue> issues = adminService.getIssuesByWard(admin.getWorkingMunicipalArea(), wardNumber);
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/priority")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Issue>> getPriorityIssues() {
        Admin admin = adminService.getCurrentAdmin();
        List<Issue> issues = adminService.getPriorityIssues(admin.getWorkingMunicipalArea());
        return ResponseEntity.ok(issues);
    }

    @PutMapping("/{issueId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateIssueStatus(@PathVariable Long issueId,
                                               @Valid @RequestBody IssueUpdateRequest updateRequest) {
        try {
            Issue issue = adminService.updateIssueStatus(issueId, updateRequest);
            return ResponseEntity.ok("Issue status updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{issueId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignIssueToWorker(@PathVariable Long issueId,
                                                 @RequestBody(required = false) AssignmentRequest assignmentRequest,
                                                 @RequestParam(value = "workerId", required = false) Long workerId) {
        try {
            Long effectiveWorkerId = (assignmentRequest != null && assignmentRequest.getWorkerId() != null)
                    ? assignmentRequest.getWorkerId()
                    : workerId;

            if (effectiveWorkerId == null) {
                return ResponseEntity.badRequest().body("Worker ID is required");
            }

            AssignmentRequest req = new AssignmentRequest();
            req.setWorkerId(effectiveWorkerId);
            Issue issue = adminService.assignIssueToWorker(issueId, req);
            return ResponseEntity.ok(issue);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/workers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Worker>> getWorkers() {
        Admin admin = adminService.getCurrentAdmin();
        List<Worker> workers = adminService.getWorkersByMunicipalArea(admin.getWorkingMunicipalArea());
        return ResponseEntity.ok(workers);
    }

    @PostMapping("/workers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createWorker(@Valid @RequestBody Worker worker) {
        try {
            Worker createdWorker = adminService.createWorker(worker);
            return ResponseEntity.ok(createdWorker);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}