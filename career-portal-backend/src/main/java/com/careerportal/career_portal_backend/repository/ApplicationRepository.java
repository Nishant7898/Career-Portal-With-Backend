package com.careerportal.career_portal_backend.repository;

import com.careerportal.career_portal_backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Find all applications submitted for a specific job post
    List<Application> findByJobPosting_Id(Long jobId);

    // Find all applications submitted by a specific job seeker
    List<Application> findByJobSeekerProfile_Id(Long seekerId);

    // Count applications for a specific job posting
    Long countByJobPosting_Id(Long jobId);
}