package com.civicissue.repository;

import com.civicissue.entity.Issue;
import com.civicissue.entity.IssueStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IssueStatusHistoryRepository extends JpaRepository<IssueStatusHistory, Long> {
    List<IssueStatusHistory> findByIssueOrderByChangedAtAsc(Issue issue);
}