package com.careerportal.career_portal_backend.service;

import com.careerportal.career_portal_backend.entity.Employer;
import com.careerportal.career_portal_backend.entity.JobPosting;
import com.careerportal.career_portal_backend.entity.User;
import com.careerportal.career_portal_backend.execption.ResourceNotFoundException;
import com.careerportal.career_portal_backend.payload.JobPostingDto;
import com.careerportal.career_portal_backend.repository.EmployerRepository;
import com.careerportal.career_portal_backend.repository.JobPostingRepository;
import com.careerportal.career_portal_backend.repository.UserRepository;
import com.careerportal.career_portal_backend.specifications.JobSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobPostingService {

    private static final Logger logger = LoggerFactory.getLogger(JobPostingService.class);

    private final JobPostingRepository jobPostingRepository;
    private final EmployerRepository employerRepository;
    private final UserRepository userRepository;
    private final EmployerService employerService;

    public JobPostingService(JobPostingRepository jobPostingRepository,
                             EmployerRepository employerRepository,
                             UserRepository userRepository,
                             EmployerService employerService) {
        this.jobPostingRepository = jobPostingRepository;
        this.employerRepository = employerRepository;
        this.userRepository = userRepository;
        this.employerService = employerService;
    }

    // --- Mapper (Simple conversion from DTO to Entity) ---
    private JobPosting mapToEntity(JobPostingDto jobPostingDto, Employer employer) {
        JobPosting job = new JobPosting();
        job.setJobTitle(jobPostingDto.getJobTitle());
        job.setJobPosition(jobPostingDto.getJobPosition());
        job.setDescription(jobPostingDto.getDescription());
        job.setRequiredSkills(jobPostingDto.getRequiredSkills());
        job.setLocation(jobPostingDto.getLocation());
        job.setExperienceLevel(jobPostingDto.getExperienceLevel());
        job.setFunctionalArea(jobPostingDto.getFunctionalArea());
        job.setIndustry(jobPostingDto.getIndustry());
        job.setSalaryDetails(jobPostingDto.getSalaryDetails());
        job.setEmployer(employer); // Set the posting employer
        job.setDatePosted(LocalDate.now());
        job.setIsActive(true);
        return job;
    }

    private JobPostingDto mapToDTO(JobPosting jobPosting) {
        JobPostingDto dto = new JobPostingDto();
        dto.setId(jobPosting.getId());
        dto.setJobTitle(jobPosting.getJobTitle());
        dto.setJobPosition(jobPosting.getJobPosition());
        dto.setDescription(jobPosting.getDescription());
        dto.setRequiredSkills(jobPosting.getRequiredSkills());
        dto.setLocation(jobPosting.getLocation());
        dto.setExperienceLevel(jobPosting.getExperienceLevel());
        dto.setFunctionalArea(jobPosting.getFunctionalArea());
        dto.setIndustry(jobPosting.getIndustry());
        dto.setSalaryDetails(jobPosting.getSalaryDetails());
        dto.setDatePosted(jobPosting.getDatePosted());
        dto.setIsActive(jobPosting.getIsActive());
        dto.setApplicationCount(0L); // Will be set by controller if needed
        return dto;
    }

    // --- Core Business Logic Methods ---

    /** Posts a new job listing */
    @Transactional
    public JobPostingDto createJobPosting(String username, JobPostingDto jobPostingDto) {
        try {
            logger.info("Creating job posting for username: {}", username);
            logger.info("Job posting data: {}", jobPostingDto);

            // 1. Get the authenticated User
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
            logger.info("Found user: {} with ID: {}", user.getUsername(), user.getId());

            // 2. Get or create the Employer profile linked to this User
            Employer employer = employerService.getOrCreateEmployerProfile(user);
            logger.info("Found/Created employer: {} with ID: {}", employer.getCompanyName(), employer.getId());

            // 3. Convert DTO to Entity and save
            JobPosting newJob = mapToEntity(jobPostingDto, employer);
            logger.info("Mapped job posting entity: {}", newJob);
            
            JobPosting savedJob = jobPostingRepository.save(newJob);
            logger.info("Saved job posting with ID: {}", savedJob.getId());

            // Verify the job was actually saved by fetching it again
            JobPosting verifyJob = jobPostingRepository.findById(savedJob.getId()).orElse(null);
            if (verifyJob != null) {
                logger.info("Verification successful: Job posting exists in database with ID: {}", verifyJob.getId());
            } else {
                logger.error("Verification failed: Job posting not found in database after save");
            }

            JobPostingDto result = mapToDTO(savedJob);
            logger.info("Returning job posting DTO: {}", result);
            
            return result;
        } catch (Exception e) {
            logger.error("Error creating job posting for username: {}", username, e);
            throw e;
        }
    }

    /** Gets all job listings (public view) */
    public List<JobPostingDto> getAllJobPostings() {
        logger.info("Fetching all job postings from database");
        List<JobPosting> jobs = jobPostingRepository.findAll();
        logger.info("Found {} job postings in database", jobs.size());
        
        // Log each job for debugging
        for (JobPosting job : jobs) {
            logger.info("Job ID: {}, Title: {}, Employer: {}", 
                job.getId(), job.getJobTitle(), 
                job.getEmployer() != null ? job.getEmployer().getCompanyName() : "null");
        }
        
        return jobs.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<JobPostingDto> searchJobPostings(String keyword, String location, String experienceLevel) {

        // Create the dynamic specification
        Specification<JobPosting> spec = JobSpecification.filterJobs(keyword, location, experienceLevel);

        // Use the findAll method from JpaSpecificationExecutor
        List<JobPosting> jobs = jobPostingRepository.findAll(spec);

        return jobs.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    /** Gets all job postings for a specific employer */
    public List<JobPostingDto> getJobPostingsByEmployer(String username) {
        try {
            logger.info("Fetching job postings for employer username: {}", username);
            
            // 1. Get the authenticated User
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
            logger.info("Found user: {} with ID: {}", user.getUsername(), user.getId());

            // 2. Get the Employer profile linked to this User
            Employer employer = employerRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found for user: " + username));
            logger.info("Found employer: {} with ID: {}", employer.getCompanyName(), employer.getId());

            // 3. Get all job postings for this employer
            List<JobPosting> jobs = jobPostingRepository.findByEmployer_Id(employer.getId());
            logger.info("Found {} job postings for employer: {}", jobs.size(), employer.getCompanyName());
            
            // Log each job for debugging
            for (JobPosting job : jobs) {
                logger.info("Job ID: {}, Title: {}, Posted: {}, Active: {}", 
                    job.getId(), job.getJobTitle(), job.getDatePosted(), job.getIsActive());
            }
            
            return jobs.stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching job postings for employer username: {}", username, e);
            throw e;
        }
    }

    /** Gets a job posting by ID */
    public JobPostingDto getJobById(Long jobId) {
        try {
            logger.info("Fetching job posting with ID: {}", jobId);
            
            JobPosting jobPosting = jobPostingRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job posting"));
            
            logger.info("Found job posting: {}", jobPosting.getJobTitle());
            return mapToDTO(jobPosting);
            
        } catch (Exception e) {
            logger.error("Error fetching job posting with ID: {}", jobId, e);
            throw e;
        }
    }

    /** Updates a job posting (only by the employer who created it) */
    @Transactional
    public JobPostingDto updateJobPosting(Long jobId, String username, JobPostingDto jobPostingDto) {
        try {
            logger.info("Updating job posting with ID: {} for username: {} with data: {}", jobId, username, jobPostingDto);
            
            // 1. Get the authenticated User
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
            logger.info("Found user: {} with ID: {}", user.getUsername(), user.getId());

            // 2. Get the Employer profile linked to this User
            Employer employer = employerRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found for user: " + username));
            logger.info("Found employer: {} with ID: {}", employer.getCompanyName(), employer.getId());

            // 3. Get the job posting and verify it belongs to this employer
            JobPosting jobPosting = jobPostingRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job posting id"));
            
            if (!jobPosting.getEmployer().getId().equals(employer.getId())) {
                throw new RuntimeException("You can only update your own job postings");
            }
            
            // 4. Update the job posting fields
            jobPosting.setJobTitle(jobPostingDto.getJobTitle());
            jobPosting.setJobPosition(jobPostingDto.getJobPosition());
            jobPosting.setDescription(jobPostingDto.getDescription());
            jobPosting.setRequiredSkills(jobPostingDto.getRequiredSkills());
            jobPosting.setLocation(jobPostingDto.getLocation());
            jobPosting.setExperienceLevel(jobPostingDto.getExperienceLevel());
            jobPosting.setFunctionalArea(jobPostingDto.getFunctionalArea());
            jobPosting.setIndustry(jobPostingDto.getIndustry());
            jobPosting.setSalaryDetails(jobPostingDto.getSalaryDetails());
            jobPosting.setIsActive(jobPostingDto.getIsActive());
            
            // 5. Save the updated job posting
            JobPosting updatedJobPosting = jobPostingRepository.save(jobPosting);
            logger.info("Successfully updated job posting with ID: {}", jobId);
            
            return mapToDTO(updatedJobPosting);
            
        } catch (Exception e) {
            logger.error("Error updating job posting with ID: {} for username: {}", jobId, username, e);
            throw e;
        }
    }

    /** Deletes a job posting (only by the employer who created it) */
    @Transactional
    public void deleteJobPosting(Long jobId, String username) {
        try {
            logger.info("Deleting job posting with ID: {} for username: {}", jobId, username);
            
            // 1. Get the authenticated User
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
            logger.info("Found user: {} with ID: {}", user.getUsername(), user.getId());

            // 2. Get the Employer profile linked to this User
            Employer employer = employerRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found for user: " + username));
            logger.info("Found employer: {} with ID: {}", employer.getCompanyName(), employer.getId());

            // 3. Get the job posting and verify it belongs to this employer
            JobPosting jobPosting = jobPostingRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));
            
            if (!jobPosting.getEmployer().getId().equals(employer.getId())) {
                throw new RuntimeException("You can only delete your own job postings");
            }
            
            // 4. Delete the job posting
            jobPostingRepository.delete(jobPosting);
            logger.info("Successfully deleted job posting with ID: {}", jobId);
            
        } catch (Exception e) {
            logger.error("Error deleting job posting with ID: {} for username: {}", jobId, username, e);
            throw e;
        }
    }
}