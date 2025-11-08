package com.careerportal.career_portal_backend.controller;

import com.careerportal.career_portal_backend.payload.JobSeekerProfileDto;
import com.careerportal.career_portal_backend.service.JobSeekerProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/jobseeker")
public class JobSeekerProfileController {

    private static final Logger logger = LoggerFactory.getLogger(JobSeekerProfileController.class);
    private final JobSeekerProfileService jobSeekerProfileService;

    public JobSeekerProfileController(JobSeekerProfileService jobSeekerProfileService) {
        this.jobSeekerProfileService = jobSeekerProfileService;
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/profile")
    public ResponseEntity<JobSeekerProfileDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Fetching job seeker profile for user: {}", userDetails.getUsername());
            JobSeekerProfileDto profile = jobSeekerProfileService.getProfileByUsername(userDetails.getUsername());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            logger.error("Error fetching job seeker profile for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PutMapping("/profile")
    public ResponseEntity<JobSeekerProfileDto> updateProfile(
            @RequestBody JobSeekerProfileDto profileDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Updating job seeker profile for user: {}", userDetails.getUsername());
            JobSeekerProfileDto updatedProfile = jobSeekerProfileService.updateProfile(userDetails.getUsername(), profileDto);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            logger.error("Error updating job seeker profile for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}