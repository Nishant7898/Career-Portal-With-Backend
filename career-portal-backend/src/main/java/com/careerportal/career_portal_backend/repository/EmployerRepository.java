package com.careerportal.career_portal_backend.repository;

import com.careerportal.career_portal_backend.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployerRepository extends JpaRepository<Employer, Long> {

    // Find the employer profile by the linked User's ID
    Optional<Employer> findByUser_Id(Long userId);
    
    // Check if company name already exists
    Boolean existsByCompanyName(String companyName);
}
