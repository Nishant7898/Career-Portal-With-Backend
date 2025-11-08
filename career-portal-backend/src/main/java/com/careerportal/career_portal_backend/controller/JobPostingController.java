package com.careerportal.career_portal_backend.controller;

import com.careerportal.career_portal_backend.payload.JobPostingDto;
import com.careerportal.career_portal_backend.service.JobPostingService;
import com.careerportal.career_portal_backend.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobPostingController {

    private static final Logger logger = LoggerFactory.getLogger(JobPostingController.class);
    private final JobPostingService jobPostingService;
    private final ApplicationService applicationService;

    public JobPostingController(JobPostingService jobPostingService, ApplicationService applicationService) {
        this.jobPostingService = jobPostingService;
        this.applicationService = applicationService;
    }

    // --- Debug endpoint to check if jobs are being created ---
    @GetMapping("/all")
    public ResponseEntity<List<JobPostingDto>> getAllJobsDebug() {
        logger.info("Fetching all job postings for debug");
        List<JobPostingDto> jobs = jobPostingService.getAllJobPostings();
        logger.info("Found {} job postings", jobs.size());
        return ResponseEntity.ok(jobs);
    }

    // --- Secured Endpoint (Only EMPLOYER role can post) ---
    @PreAuthorize("hasRole('EMPLOYER')")
    @PostMapping
    public ResponseEntity<JobPostingDto> createJob(
            @RequestBody @jakarta.validation.Valid JobPostingDto jobPostingDto,
            @AuthenticationPrincipal UserDetails userDetails) { // Get current logged-in user details

        try {
            logger.info("Received job posting request from user: {}", userDetails.getUsername());
            logger.info("Job posting data: {}", jobPostingDto);

            // Pass the username to the service to find the correct Employer
            JobPostingDto newJob = jobPostingService.createJobPosting(
                    userDetails.getUsername(), jobPostingDto);

            logger.info("Successfully created job posting: {}", newJob);
            return new ResponseEntity<>(newJob, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating job posting for user: {}", userDetails.getUsername(), e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<JobPostingDto>> searchJobs(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "experience", required = false) String experienceLevel) {

        // Use the search method with all optional parameters
        List<JobPostingDto> jobList = jobPostingService.searchJobPostings(keyword, location, experienceLevel);

        return ResponseEntity.ok(jobList);
    }

    // --- Get job postings for the current employer ---
    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/employer")
    public ResponseEntity<List<JobPostingDto>> getEmployerJobs(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Fetching job postings for employer: {}", userDetails.getUsername());
            
            List<JobPostingDto> jobs = jobPostingService.getJobPostingsByEmployer(userDetails.getUsername());
            
            // Add application counts to each job
            for (JobPostingDto job : jobs) {
                try {
                    Long applicationCount = applicationService.getApplicationCountForJob(job.getId());
                    job.setApplicationCount(applicationCount);
                    logger.debug("Job {} has {} applications", job.getId(), applicationCount);
                } catch (Exception e) {
                    logger.warn("Failed to get application count for job {}: {}", job.getId(), e.getMessage());
                    job.setApplicationCount(0L);
                }
            }
            
            logger.info("Returning {} job postings for employer: {}", jobs.size(), userDetails.getUsername());
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            logger.error("Error fetching job postings for employer: {}", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // --- Get job posting by ID ---
    @GetMapping("/{id}")
    public ResponseEntity<JobPostingDto> getJobById(@PathVariable Long id) {
        try {
            logger.info("Fetching job posting with ID: {}", id);
            
            JobPostingDto job = jobPostingService.getJobById(id);
            
            logger.info("Successfully fetched job posting with ID: {}", id);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            logger.error("Error fetching job posting with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // --- Update job posting ---
    @PreAuthorize("hasRole('EMPLOYER')")
    @PutMapping("/{id}")
    public ResponseEntity<JobPostingDto> updateJob(
            @PathVariable Long id,
            @RequestBody @jakarta.validation.Valid JobPostingDto jobPostingDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Updating job posting with ID: {} for employer: {}", id, userDetails.getUsername());
            logger.info("Job posting update data: {}", jobPostingDto);
            
            JobPostingDto updatedJob = jobPostingService.updateJobPosting(id, userDetails.getUsername(), jobPostingDto);
            
            logger.info("Successfully updated job posting with ID: {}", id);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            logger.error("Error updating job posting with ID: {} for employer: {}", id, userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // --- Delete job posting ---
    @PreAuthorize("hasRole('EMPLOYER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Deleting job posting with ID: {} for employer: {}", id, userDetails.getUsername());
            
            jobPostingService.deleteJobPosting(id, userDetails.getUsername());
            
            logger.info("Successfully deleted job posting with ID: {}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting job posting with ID: {} for employer: {}", id, userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}