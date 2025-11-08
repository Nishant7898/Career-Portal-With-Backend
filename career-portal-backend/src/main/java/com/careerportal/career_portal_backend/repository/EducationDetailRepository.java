package com.careerportal.career_portal_backend.repository;

import com.careerportal.career_portal_backend.entity.EducationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationDetailRepository extends JpaRepository<EducationDetail, Long> {

    // Spring Data JPA automatically provides CRUD methods (save, findById, findAll, etc.)

    // Optional: You could add custom query methods if needed,
    // E.g., List<EducationDetail> findByJobSeekerProfile_Id(Long profileId);
    // However, since we are managing it via the JobSeekerProfile entity,
    // the basic methods are often enough.
}