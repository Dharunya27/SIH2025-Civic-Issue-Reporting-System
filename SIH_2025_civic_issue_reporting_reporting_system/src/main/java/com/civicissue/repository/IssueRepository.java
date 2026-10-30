package com.civicissue.repository;

import com.civicissue.entity.Issue;
import com.civicissue.entity.Issue.Category;
import com.civicissue.entity.Issue.Status;
import com.civicissue.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByUserOrderByCreatedAtDesc(User user);
    Optional<Issue> findByReportId(String reportId);
    boolean existsByReportId(String reportId);

    // NEW METHODS FOR ADMIN FUNCTIONALITY
    List<Issue> findByMunicipalAreaOrderByCreatedAtDesc(String municipalArea);
    List<Issue> findByMunicipalAreaAndCategoryOrderByCreatedAtDesc(String municipalArea, Category category);
    List<Issue> findByMunicipalAreaAndStatusOrderByCreatedAtDesc(String municipalArea, Status status);
    List<Issue> findByMunicipalAreaAndMunicipalWardNumberOrderByCreatedAtDesc(String municipalArea, Integer wardNumber);

    @Query("SELECT i FROM Issue i WHERE i.municipalArea = :municipalArea AND i.isUrgent = true ORDER BY i.createdAt DESC")
    List<Issue> findUrgentIssuesByMunicipalArea(@Param("municipalArea") String municipalArea);

    @Query("SELECT i FROM Issue i WHERE i.municipalArea = :municipalArea AND i.status = 'PENDING' AND i.createdAt < :thresholdDate ORDER BY i.createdAt DESC")
    List<Issue> findPendingIssuesOlderThan(@Param("municipalArea") String municipalArea,
                                           @Param("thresholdDate") LocalDateTime thresholdDate);

    @Query("SELECT i FROM Issue i WHERE i.municipalArea = :municipalArea AND i.assignedWorker.id = :workerId ORDER BY i.createdAt DESC")
    List<Issue> findByMunicipalAreaAndAssignedWorker(@Param("municipalArea") String municipalArea,
                                                     @Param("workerId") Long workerId);

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.municipalArea = :municipalArea")
    Long countByMunicipalArea(@Param("municipalArea") String municipalArea);

    @Query("SELECT i.status, COUNT(i) FROM Issue i WHERE i.municipalArea = :municipalArea GROUP BY i.status")
    List<Object[]> countByStatusAndMunicipalArea(@Param("municipalArea") String municipalArea);

    @Query("SELECT i.category, COUNT(i) FROM Issue i WHERE i.municipalArea = :municipalArea GROUP BY i.category")
    List<Object[]> countByCategoryAndMunicipalArea(@Param("municipalArea") String municipalArea);
}