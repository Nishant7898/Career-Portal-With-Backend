package com.careerportal.career_portal_backend.service;

import com.careerportal.career_portal_backend.entity.Employer;
import com.careerportal.career_portal_backend.entity.User;
import com.careerportal.career_portal_backend.payload.EmployerRegisterDto;
import com.careerportal.career_portal_backend.repository.EmployerRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmployerService {

    private static final Logger logger = LoggerFactory.getLogger(EmployerService.class);
    private final EmployerRepository employerRepository;

    public EmployerService(EmployerRepository employerRepository) {
        this.employerRepository = employerRepository;
    }

    /**
     * Creates an employer profile from registration data
     */
    public Employer createEmployerProfile(User user, EmployerRegisterDto registerDto) {
        logger.info("Creating employer profile for user: {}", user.getUsername());
        
        Employer employer = new Employer();
        employer.setUser(user);
        employer.setCompanyName(registerDto.getCompanyName());
        employer.setEmail(registerDto.getEmail());
        employer.setIndustry(registerDto.getIndustry());
        employer.setCompanySize(registerDto.getCompanySize());
        employer.setHeadquarters(registerDto.getHeadquarters());
        
        if (registerDto.getCompanyType() != null) {
            employer.setCompanyType(Employer.CompanyType.valueOf(registerDto.getCompanyType()));
        }
        
        employer.setFounded(registerDto.getFounded());
        employer.setSpecialities(registerDto.getSpecialities());
        employer.setCompanyAddress(registerDto.getCompanyAddress());
        employer.setCompanyPhone(registerDto.getCompanyPhone());
        
        Employer savedEmployer = employerRepository.save(employer);
        logger.info("Created employer profile with ID: {} for user: {}", savedEmployer.getId(), user.getUsername());
        
        return savedEmployer;
    }

    /**
     * Creates a default employer profile for a new user (for backward compatibility)
     */
    public Employer createDefaultEmployerProfile(User user) {
        logger.info("Creating default employer profile for user: {}", user.getUsername());
        
        Employer employer = new Employer();
        employer.setUser(user);
        employer.setCompanyName("Company Name - Please Update");
        employer.setEmail(user.getEmail() != null ? user.getEmail() : "Please Update Email");
        employer.setIndustry("Technology");
        employer.setCompanySize("Please Update");
        employer.setHeadquarters("Please Update Location");
        employer.setCompanyType(Employer.CompanyType.PRIVATE);
        employer.setSpecialities("Please Update Specialities");
        employer.setCompanyAddress("Please Update Address");
        employer.setCompanyPhone("Please Update Phone");
        
        Employer savedEmployer = employerRepository.save(employer);
        logger.info("Created default employer profile with ID: {} for user: {}", savedEmployer.getId(), user.getUsername());
        
        return savedEmployer;
    }

    /**
     * Gets or creates an employer profile for a user
     */
    public Employer getOrCreateEmployerProfile(User user) {
        return employerRepository.findByUser_Id(user.getId())
                .orElseGet(() -> createDefaultEmployerProfile(user));
    }

    /**
     * Updates an existing employer profile
     */
    public Employer updateEmployerProfile(User user, com.careerportal.career_portal_backend.payload.EmployerDto employerDto) {
        logger.info("Updating employer profile for user: {} with data: {}", user.getUsername(), employerDto);
        
        Employer employer = employerRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Employer profile not found for user: " + user.getUsername()));
        
        // Validate required fields
        if (employerDto.getCompanyName() != null && employerDto.getCompanyName().trim().isEmpty()) {
            throw new RuntimeException("Company name cannot be empty");
        }
        if (employerDto.getEmail() != null && employerDto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }
        if (employerDto.getIndustry() != null && employerDto.getIndustry().trim().isEmpty()) {
            throw new RuntimeException("Industry cannot be empty");
        }
        
        // Update all fields from DTO (including empty strings to allow clearing fields)
        if (employerDto.getCompanyName() != null) {
            employer.setCompanyName(employerDto.getCompanyName().trim());
        }
        if (employerDto.getEmail() != null) {
            employer.setEmail(employerDto.getEmail().trim());
        }
        if (employerDto.getIndustry() != null) {
            employer.setIndustry(employerDto.getIndustry().trim());
        }
        if (employerDto.getCompanySize() != null) {
            employer.setCompanySize(employerDto.getCompanySize().trim());
        }
        if (employerDto.getHeadquarters() != null) {
            employer.setHeadquarters(employerDto.getHeadquarters().trim());
        }
        if (employerDto.getCompanyType() != null) {
            String companyType = employerDto.getCompanyType().trim();
            if (!companyType.isEmpty()) {
                try {
                    employer.setCompanyType(Employer.CompanyType.valueOf(companyType));
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid company type: {}, keeping existing value", companyType);
                }
            } else {
                // Allow clearing the company type
                employer.setCompanyType(null);
            }
        }
        if (employerDto.getFounded() != null) {
            employer.setFounded(employerDto.getFounded());
        }
        if (employerDto.getSpecialities() != null) {
            employer.setSpecialities(employerDto.getSpecialities().trim());
        }
        if (employerDto.getCompanyAddress() != null) {
            employer.setCompanyAddress(employerDto.getCompanyAddress().trim());
        }
        if (employerDto.getCompanyPhone() != null) {
            employer.setCompanyPhone(employerDto.getCompanyPhone().trim());
        }
        
        Employer updatedEmployer = employerRepository.save(employer);
        logger.info("Updated employer profile with ID: {} for user: {}", updatedEmployer.getId(), user.getUsername());
        
        return updatedEmployer;
    }

    /**
     * Gets all employers with optional filters
     */
    public java.util.List<Employer> getAllEmployers(String companyName, String industry, Integer foundedAfter) {
        logger.info("Fetching all employers with filters");
        
        java.util.List<Employer> employers = employerRepository.findAll();
        
        // Apply filters
        if (companyName != null && !companyName.trim().isEmpty()) {
            employers = employers.stream()
                    .filter(emp -> emp.getCompanyName() != null && 
                            emp.getCompanyName().toLowerCase().contains(companyName.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
        }
        
        if (industry != null && !industry.trim().isEmpty()) {
            employers = employers.stream()
                    .filter(emp -> emp.getIndustry() != null && 
                            emp.getIndustry().toLowerCase().contains(industry.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
        }
        
        if (foundedAfter != null) {
            employers = employers.stream()
                    .filter(emp -> emp.getFounded() != null && emp.getFounded() >= foundedAfter)
                    .collect(java.util.stream.Collectors.toList());
        }
        
        logger.info("Returning {} employers after filtering", employers.size());
        return employers;
    }
}