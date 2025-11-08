package com.careerportal.career_portal_backend.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class JobPostingDto {
    private Long id;
    
    @NotBlank(message = "Job title is required")
    private String jobTitle;
    
    private String jobPosition;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String requiredSkills;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String experienceLevel;
    private String functionalArea;
    private String industry;
    private String salaryDetails;
    private LocalDate datePosted;
    private Boolean isActive;
    private Long applicationCount;

    public JobPostingDto() {
    }

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getJobTitle() {
		return jobTitle;
	}
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}
	public String getJobPosition() {
		return jobPosition;
	}
	public void setJobPosition(String jobPosition) {
		this.jobPosition = jobPosition;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getRequiredSkills() {
		return requiredSkills;
	}
	public void setRequiredSkills(String requiredSkills) {
		this.requiredSkills = requiredSkills;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getExperienceLevel() {
		return experienceLevel;
	}
	public void setExperienceLevel(String experienceLevel) {
		this.experienceLevel = experienceLevel;
	}
	public String getFunctionalArea() {
		return functionalArea;
	}
	public void setFunctionalArea(String functionalArea) {
		this.functionalArea = functionalArea;
	}
	public String getIndustry() {
		return industry;
	}
	public void setIndustry(String industry) {
		this.industry = industry;
	}
	public String getSalaryDetails() {
		return salaryDetails;
	}
	public void setSalaryDetails(String salaryDetails) {
		this.salaryDetails = salaryDetails;
	}
	public LocalDate getDatePosted() {
		return datePosted;
	}
	public void setDatePosted(LocalDate datePosted) {
		this.datePosted = datePosted;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	public Long getApplicationCount() {
		return applicationCount;
	}
	public void setApplicationCount(Long applicationCount) {
		this.applicationCount = applicationCount;
	}
    
}