package com.civicissue.security;

import com.civicissue.entity.Admin;
import com.civicissue.entity.User;
import com.civicissue.repository.AdminRepository;
import com.civicissue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;  // ADDED: Admin repository

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try to find as user
        User user = userRepository.findByVoterId(username)
                .orElse(null);

        if (user != null) {
            return new UserPrincipal(user);
        }

        // If not found as user, try as admin
        Admin admin = adminRepository.findByGovId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new UserPrincipal(admin);
    }
}