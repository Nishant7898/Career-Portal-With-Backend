package com.careerportal.career_portal_backend.service;

import com.careerportal.career_portal_backend.entity.JobSeekerProfile;
import com.careerportal.career_portal_backend.repository.JobSeekerProfileRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class JobSeekerService {

    private static final Logger logger = LoggerFactory.getLogger(JobSeekerService.class);
    private final JobSeekerProfileRepository jobSeekerProfileRepository;

    public JobSeekerService(JobSeekerProfileRepository jobSeekerProfileRepository) {
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
    }

    /**
     * Gets all job seeker profiles
     */
    public List<JobSeekerProfile> getAllJobSeekers() {
        logger.info("Fetching all job seekers");
        
        List<JobSeekerProfile> jobSeekers = jobSeekerProfileRepository.findAll();
        
        logger.info("Returning {} job seekers", jobSeekers.size());
        return jobSeekers;
    }
}