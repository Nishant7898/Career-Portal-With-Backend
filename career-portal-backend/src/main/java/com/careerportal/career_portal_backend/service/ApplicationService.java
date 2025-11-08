package com.careerportal.career_portal_backend.service;


import com.careerportal.career_portal_backend.entity.*;
import com.careerportal.career_portal_backend.execption.AccessDeniedException;
import com.careerportal.career_portal_backend.execption.ResourceNotFoundException;
import com.careerportal.career_portal_backend.payload.ApplicationResponseDto;
import com.careerportal.career_portal_backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final UserRepository userRepository;
    private final EmployerRepository employerRepository;
    private final FileStorageService fileStorageService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobPostingRepository jobPostingRepository,
                              JobSeekerProfileRepository jobSeekerProfileRepository,
                              UserRepository userRepository,
                              EmployerRepository employerRepository,
                              FileStorageService fileStorageService) {
        this.applicationRepository = applicationRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.userRepository = userRepository;
        this.employerRepository= employerRepository;
        this.fileStorageService = fileStorageService;
    }

    // --- Mapper ---
    private ApplicationResponseDto mapToDTO(Application application) {
        ApplicationResponseDto dto = new ApplicationResponseDto();
        dto.setId(application.getId());
        dto.setStatus(application.getStatus());
        dto.setApplicationDate(application.getApplicationDate());
        dto.setJobPostingId(application.getJobPosting().getId());
        dto.setJobSeekerProfileId(application.getJobSeekerProfile().getId());
        dto.setJobTitle(application.getJobPosting().getJobTitle());
        dto.setCompanyName(application.getJobPosting().getEmployer().getCompanyName());
        dto.setRecruiterNotes(application.getRecruiterNotes());
        
        // Add job seeker details
        JobSeekerProfile jobSeeker = application.getJobSeekerProfile();
        dto.setCandidateName(jobSeeker.getName());
        dto.setCandidateEmail(jobSeeker.getEmail());
        dto.setCandidatePhone(jobSeeker.getMobile());
        
        // Add resume information
        dto.setResumeFileName(application.getResumeFileName());
        dto.setHasResume(application.getResumeFileName() != null && !application.getResumeFileName().isEmpty());
        
        return dto;
    }

    // --- Core Business Logic Methods ---

    /** Job Seeker submits an application */
    public ApplicationResponseDto applyForJob(String username, Long jobId, org.springframework.web.multipart.MultipartFile resumeFile) {
        // 1. Fetch Job Seeker Profile
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job Seeker Profile", "User ID", user.getId().toString()));

        // 2. Fetch Job Posting
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", jobId.toString()));

        // ** (Add validation here: e.g., check if the user already applied) **

        // 3. Handle resume upload if provided
        String resumeFilePath = null;
        String resumeFileName = null;
        String resumeContentType = null;
        Long resumeFileSize = null;

        if (resumeFile != null && !resumeFile.isEmpty()) {
            try {
                // Store the resume file
                resumeFilePath = fileStorageService.storeFile(resumeFile, "resumes");
                resumeFileName = resumeFile.getOriginalFilename();
                resumeContentType = resumeFile.getContentType();
                resumeFileSize = resumeFile.getSize();
            } catch (Exception e) {
                throw new RuntimeException("Failed to store resume file: " + e.getMessage());
            }
        }

        // 4. Create and Save Application
        Application application = new Application();
        application.setJobSeekerProfile(profile);
        application.setJobPosting(job);
        application.setApplicationDate(LocalDateTime.now());
        application.setStatus("PENDING"); // Default status
        
        // Set resume information
        application.setResumeFileName(resumeFileName);
        application.setResumeFilePath(resumeFilePath);
        application.setResumeContentType(resumeContentType);
        application.setResumeFileSize(resumeFileSize);

        Application savedApplication = applicationRepository.save(application);
        return mapToDTO(savedApplication);
    }

    /** Job Seeker submits an application (without resume - for backward compatibility) */
    public ApplicationResponseDto applyForJob(String username, Long jobId) {
        return applyForJob(username, jobId, null);
    }

    /** Job Seeker views their application history */
    public List<ApplicationResponseDto> getMyApplications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job Seeker Profile", "User ID", user.getId().toString()));

        List<Application> applications = applicationRepository.findByJobSeekerProfile_Id(profile.getId());

        return applications.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ApplicationResponseDto> getApplicationsForJob(Long jobId, String employerUsername) {
        // 1. Get the authenticated Employer Profile
        User user = userRepository.findByUsername(employerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", employerUsername));
        Employer employer = employerRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer Profile", "User ID", user.getId().toString()));

        // 2. Fetch Job Posting and validate ownership
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", jobId.toString()));

        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("You are not authorized to view applications for this job.");
        }

        // 3. Fetch and map applications
        List<Application> applications = applicationRepository.findByJobPosting_Id(jobId);

        return applications.stream()
                .map(this::mapToDTO) // Reuse existing mapper
                .collect(Collectors.toList());
    }

    /** Employer updates the status of a specific application */
    public ApplicationResponseDto updateApplicationStatus(Long applicationId, String newStatus, String recruiterNotes, String employerUsername) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId.toString()));

        // 1. Validate that the job owner is the authenticated employer (Security check)
        if (!application.getJobPosting().getEmployer().getUser().getUsername().equals(employerUsername)) {
            throw new AccessDeniedException("You are not authorized to modify this application.");
        }

        // 2. Update status and notes
        application.setStatus(newStatus);
        application.setRecruiterNotes(recruiterNotes);

        Application updatedApplication = applicationRepository.save(application);
        return mapToDTO(updatedApplication);
    }
    /** Get application count for a specific job */
    public Long getApplicationCountForJob(Long jobId) {
        return applicationRepository.countByJobPosting_Id(jobId);
    }

    /** Get application counts for multiple jobs */
    public java.util.Map<Long, Long> getApplicationCountsForJobs(List<Long> jobIds) {
        return jobIds.stream()
                .collect(java.util.stream.Collectors.toMap(
                    jobId -> jobId,
                    this::getApplicationCountForJob
                ));
    }

    /** Get resume file for an application (for employers) */
    public org.springframework.core.io.Resource getApplicationResume(Long applicationId, String employerUsername) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId.toString()));

        // Verify that the job belongs to the authenticated employer
        if (!application.getJobPosting().getEmployer().getUser().getUsername().equals(employerUsername)) {
            throw new AccessDeniedException("You are not authorized to download this resume.");
        }

        if (application.getResumeFilePath() == null) {
            throw new RuntimeException("No resume file found for this application");
        }

        return fileStorageService.loadFileAsResource(application.getResumeFilePath());
    }

    /** Get resume filename for an application (for employers) */
    public String getApplicationResumeFileName(Long applicationId, String employerUsername) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId.toString()));

        // Verify that the job belongs to the authenticated employer
        if (!application.getJobPosting().getEmployer().getUser().getUsername().equals(employerUsername)) {
            throw new AccessDeniedException("You are not authorized to access this resume.");
        }

        return application.getResumeFileName() != null ? application.getResumeFileName() : "resume.pdf";
    }
}
