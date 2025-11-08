package com.careerportal.career_portal_backend.controller;

import com.careerportal.career_portal_backend.entity.JobSeekerProfile;
import com.careerportal.career_portal_backend.payload.JobSeekerDto;
import com.careerportal.career_portal_backend.service.JobSeekerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobseekers")
public class JobSeekerController {

    private static final Logger logger = LoggerFactory.getLogger(JobSeekerController.class);
    private final JobSeekerService jobSeekerService;

    public JobSeekerController(JobSeekerService jobSeekerService) {
        this.jobSeekerService = jobSeekerService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobSeekerDto>> getAllJobSeekers() {
        try {
            logger.info("Fetching all job seekers");
            
            List<JobSeekerProfile> jobSeekers = jobSeekerService.getAllJobSeekers();
            List<JobSeekerDto> jobSeekerDtos = jobSeekers.stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
            
            logger.info("Found {} job seekers", jobSeekerDtos.size());
            return ResponseEntity.ok(jobSeekerDtos);
        } catch (Exception e) {
            logger.error("Error fetching job seekers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private JobSeekerDto mapToDto(JobSeekerProfile profile) {
        JobSeekerDto dto = new JobSeekerDto();
        dto.setId(profile.getId());
        dto.setName(profile.getName());
        dto.setEmail(profile.getEmail());
        dto.setMobile(profile.getMobile());
        dto.setStatus(profile.getStatus() != null ? profile.getStatus().toString() : null);
        dto.setGender(profile.getGender() != null ? profile.getGender().toString() : null);
        dto.setDob(profile.getDob());
        dto.setEducation(profile.getEducation());
        dto.setWorkExperience(profile.getWorkExperience());
        dto.setSkills(profile.getSkills());
        dto.setCreatedAt(profile.getCreatedAt());
        return dto;
    }
}