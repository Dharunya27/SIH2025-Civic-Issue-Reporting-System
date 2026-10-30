package com.civicissue.repository;

import com.civicissue.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByGovId(String govId);
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByPhone(String phone);
    boolean existsByGovId(String govId);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}