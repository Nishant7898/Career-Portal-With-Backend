package com.careerportal.career_portal_backend.specifications;

import com.careerportal.career_portal_backend.entity.JobPosting;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class JobSpecification {

    public static Specification<JobPosting> filterJobs(String keyword, String location, String experienceLevel) {
        return (Root<JobPosting> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {

            Predicate predicate = criteriaBuilder.conjunction(); // Start with a True predicate (AND logic)

            // 1. Keyword Search (Search across multiple fields: title, description, skills)
            if (StringUtils.hasText(keyword)) {
                String likeKeyword = "%" + keyword.toLowerCase() + "%";
                Predicate keywordPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("jobTitle")), likeKeyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likeKeyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("requiredSkills")), likeKeyword)
                );
                predicate = criteriaBuilder.and(predicate, keywordPredicate);
            }

            // 2. Location Filter
            if (StringUtils.hasText(location)) {
                String likeLocation = "%" + location.toLowerCase() + "%";
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), likeLocation)
                );
            }

            // 3. Experience Level Filter (Exact match or LIKE, depending on data structure)
            if (StringUtils.hasText(experienceLevel)) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("experienceLevel"), experienceLevel)
                );
            }

            // Always filter for active jobs
            predicate = criteriaBuilder.and(predicate, criteriaBuilder.isTrue(root.get("isActive")));

            return predicate;
        };
    }
}