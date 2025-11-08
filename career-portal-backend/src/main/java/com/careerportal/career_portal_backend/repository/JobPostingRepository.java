package com.careerportal.career_portal_backend.repository;

import com.careerportal.career_portal_backend.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long>,
        JpaSpecificationExecutor<JobPosting> {

    List<JobPosting> findByEmployer_Id(Long employerId);
}