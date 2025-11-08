package com.careerportal.career_portal_backend.repository;
import com.careerportal.career_portal_backend.entity.JobSeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobSeekerProfileRepository extends JpaRepository<JobSeekerProfile, Long> {

    // Use JPA property expression to find the profile by the linked User's ID
    Optional<JobSeekerProfile> findByUser_Id(Long userId);
}