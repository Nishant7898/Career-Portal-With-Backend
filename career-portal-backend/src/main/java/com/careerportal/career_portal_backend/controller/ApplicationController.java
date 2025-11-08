package com.careerportal.career_portal_backend.controller;

import com.careerportal.career_portal_backend.payload.ApplicationResponseDto;
import com.careerportal.career_portal_backend.payload.ApplicationStatusUpdateDto;
import com.careerportal.career_portal_backend.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // --- Job Seeker Endpoints ---

    // Apply for a job
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PostMapping("/{jobId}")
    public ResponseEntity<ApplicationResponseDto> applyForJob(
            @PathVariable Long jobId,
            @RequestParam(value = "resume", required = false) org.springframework.web.multipart.MultipartFile resumeFile,
            @AuthenticationPrincipal UserDetails userDetails) {

        ApplicationResponseDto application = applicationService.applyForJob(
                userDetails.getUsername(), jobId, resumeFile);

        return new ResponseEntity<>(application, HttpStatus.CREATED);
    }

    // View my applications
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/my-history")
    public ResponseEntity<List<ApplicationResponseDto>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ApplicationResponseDto> applications = applicationService.getMyApplications(
                userDetails.getUsername());

        return ResponseEntity.ok(applications);
    }

    // --- Employer Endpoints (Sketch) ---

    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponseDto>> getApplicationsForJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ApplicationResponseDto> applications = applicationService.getApplicationsForJob(
                jobId, userDetails.getUsername());

        return ResponseEntity.ok(applications);
    }

    // Update the status of a specific application
    @PreAuthorize("hasRole('EMPLOYER')")
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponseDto> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody ApplicationStatusUpdateDto updateDto,
            @AuthenticationPrincipal UserDetails userDetails) {

        ApplicationResponseDto updatedApplication = applicationService.updateApplicationStatus(
                applicationId,
                updateDto.getNewStatus(),
                updateDto.getRecruiterNotes(),
                userDetails.getUsername());

        return ResponseEntity.ok(updatedApplication);
    }

    // Download resume for an application
    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/{applicationId}/resume")
    public ResponseEntity<org.springframework.core.io.Resource> downloadResume(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            org.springframework.core.io.Resource resource = applicationService.getApplicationResume(
                    applicationId, userDetails.getUsername());

            String fileName = applicationService.getApplicationResumeFileName(applicationId, userDetails.getUsername());

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}