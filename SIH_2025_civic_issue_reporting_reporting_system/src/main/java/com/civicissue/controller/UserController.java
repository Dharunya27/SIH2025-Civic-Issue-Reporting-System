package com.civicissue.controller;

import com.civicissue.dto.UserProfileResponse;
import com.civicissue.entity.User;
import com.civicissue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserProfileResponse> getUserProfile() {
        User user = userService.getCurrentUser();
        UserProfileResponse response = convertToProfileResponse(user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        UserProfileResponse response = convertToProfileResponse(user);
        return ResponseEntity.ok(response);
    }

    private UserProfileResponse convertToProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setUserId(user.getId());
        response.setVoterId(user.getVoterId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setState(user.getState());
        response.setDistrict(user.getDistrict());
        response.setMunicipalArea(user.getMunicipalArea());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}