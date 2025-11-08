package com.careerportal.career_portal_backend.controller;

import com.careerportal.career_portal_backend.entity.Employer;
import com.careerportal.career_portal_backend.entity.User;
import com.careerportal.career_portal_backend.payload.EmployerDto;
import com.careerportal.career_portal_backend.repository.UserRepository;
import com.careerportal.career_portal_backend.service.EmployerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    private static final Logger logger = LoggerFactory.getLogger(EmployerController.class);
    private final EmployerService employerService;
    private final UserRepository userRepository;

    public EmployerController(EmployerService employerService, UserRepository userRepository) {
        this.employerService = employerService;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/profile")
    public ResponseEntity<EmployerDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Fetching employer profile for user: {}", userDetails.getUsername());
            
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Employer employer = employerService.getOrCreateEmployerProfile(user);
            EmployerDto employerDto = mapToDto(employer);
            
            return ResponseEntity.ok(employerDto);
        } catch (Exception e) {
            logger.error("Error fetching employer profile for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PreAuthorize("hasRole('EMPLOYER')")
    @PutMapping("/profile")
    public ResponseEntity<EmployerDto> updateProfile(
            @RequestBody EmployerDto employerDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Updating employer profile for user: {} with data: {}", userDetails.getUsername(), employerDto);
            
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Actually update the employer profile using the service
            Employer updatedEmployer = employerService.updateEmployerProfile(user, employerDto);
            EmployerDto updatedDto = mapToDto(updatedEmployer);
            
            logger.info("Successfully updated employer profile for user: {}", userDetails.getUsername());
            return ResponseEntity.ok(updatedDto);
        } catch (Exception e) {
            logger.error("Error updating employer profile for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('EMPLOYER')")
    @PostMapping("/create-profile")
    public ResponseEntity<String> createEmployerProfile(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Creating employer profile for user: {}", userDetails.getUsername());
            
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Employer employer = employerService.getOrCreateEmployerProfile(user);
            
            return ResponseEntity.ok("Employer profile created/updated successfully with ID: " + employer.getId());
        } catch (Exception e) {
            logger.error("Error creating employer profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating employer profile: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<java.util.List<EmployerDto>> getAllEmployers(
            @RequestParam(value = "companyName", required = false) String companyName,
            @RequestParam(value = "industry", required = false) String industry,
            @RequestParam(value = "foundedAfter", required = false) Integer foundedAfter) {
        try {
            logger.info("Fetching all employers with filters - companyName: {}, industry: {}, foundedAfter: {}", 
                companyName, industry, foundedAfter);
            
            java.util.List<Employer> employers = employerService.getAllEmployers(companyName, industry, foundedAfter);
            java.util.List<EmployerDto> employerDtos = employers.stream()
                    .map(this::mapToDto)
                    .collect(java.util.stream.Collectors.toList());
            
            logger.info("Found {} employers", employerDtos.size());
            return ResponseEntity.ok(employerDtos);
        } catch (Exception e) {
            logger.error("Error fetching employers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private EmployerDto mapToDto(Employer employer) {
        EmployerDto dto = new EmployerDto();
        dto.setId(employer.getId());
        dto.setCompanyName(employer.getCompanyName());
        dto.setEmail(employer.getEmail());
        dto.setIndustry(employer.getIndustry());
        dto.setCompanySize(employer.getCompanySize());
        dto.setHeadquarters(employer.getHeadquarters());
        dto.setCompanyType(employer.getCompanyType() != null ? employer.getCompanyType().toString() : null);
        dto.setFounded(employer.getFounded());
        dto.setSpecialities(employer.getSpecialities());
        dto.setCompanyAddress(employer.getCompanyAddress());
        dto.setCompanyPhone(employer.getCompanyPhone());
        dto.setCreatedAt(employer.getCreatedAt());
        return dto;
    }
}