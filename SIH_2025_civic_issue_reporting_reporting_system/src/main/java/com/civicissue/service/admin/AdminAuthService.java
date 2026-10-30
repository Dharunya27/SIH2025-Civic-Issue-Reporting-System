package com.civicissue.service.admin;

import com.civicissue.dto.admin.AdminLoginRequest;
import com.civicissue.dto.admin.AdminRegisterRequest;
import com.civicissue.entity.Admin;
import com.civicissue.repository.AdminRepository;
import com.civicissue.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminAuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public Admin registerAdmin(AdminRegisterRequest registerRequest) {
        if (adminRepository.existsByGovId(registerRequest.getGovId())) {
            throw new RuntimeException("Government ID already exists");
        }

        if (registerRequest.getEmail() != null &&
                adminRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (adminRepository.existsByPhone(registerRequest.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        Admin admin = new Admin();
        admin.setGovId(registerRequest.getGovId());
        admin.setName(registerRequest.getName());
        admin.setEmail(registerRequest.getEmail());
        admin.setPhone(registerRequest.getPhone());
        admin.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        admin.setWorkingMunicipalArea(registerRequest.getWorkingMunicipalArea());

        return adminRepository.save(admin);
    }

    public String authenticateAdmin(AdminLoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getGovId(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtUtil.generateJwtToken(authentication);
    }
}