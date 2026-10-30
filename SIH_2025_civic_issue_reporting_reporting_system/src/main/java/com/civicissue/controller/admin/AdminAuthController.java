package com.civicissue.controller.admin;

import com.civicissue.dto.admin.AdminLoginRequest;
import com.civicissue.dto.admin.AdminRegisterRequest;
import com.civicissue.dto.JwtResponse;
import com.civicissue.entity.Admin;
import com.civicissue.security.JwtUtil;
import com.civicissue.service.admin.AdminAuthService;
import com.civicissue.service.admin.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "*")
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody AdminRegisterRequest registerRequest) {
        try {
            Admin admin = adminAuthService.registerAdmin(registerRequest);
            return ResponseEntity.ok("Admin registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAdmin(@Valid @RequestBody AdminLoginRequest loginRequest) {
        try {
            String jwt = adminAuthService.authenticateAdmin(loginRequest);
            Admin admin = adminService.getCurrentAdmin();

            JwtResponse response = new JwtResponse(
                    jwt,
                    admin.getId(),
                    admin.getGovId(),
                    admin.getName()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
}