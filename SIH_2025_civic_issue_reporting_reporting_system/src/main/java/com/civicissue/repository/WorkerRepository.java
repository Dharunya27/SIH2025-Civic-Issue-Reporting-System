package com.civicissue.repository;

import com.civicissue.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByMunicipalArea(String municipalArea);
    boolean existsByContact(String contact);
}