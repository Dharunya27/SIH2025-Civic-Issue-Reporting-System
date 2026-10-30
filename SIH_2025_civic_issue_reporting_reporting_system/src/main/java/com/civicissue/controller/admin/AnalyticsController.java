package com.civicissue.controller.admin;

import com.civicissue.dto.admin.AnalyticsResponse;
import com.civicissue.entity.Admin;
import com.civicissue.service.admin.AdminService;
import com.civicissue.service.admin.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private AdminService adminService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        Admin admin = adminService.getCurrentAdmin();
        AnalyticsResponse analytics = analyticsService.getAnalytics(admin.getWorkingMunicipalArea());
        return ResponseEntity.ok(analytics);
    }
}