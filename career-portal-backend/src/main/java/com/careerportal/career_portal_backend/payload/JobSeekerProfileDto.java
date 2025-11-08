package com.careerportal.career_portal_backend.payload;

import java.time.LocalDate;
import java.util.List;


public class JobSeekerProfileDto {
    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String status; // FRESHER or EXPERIENCED
    private String gender; // MALE, FEMALE, OTHER
    private LocalDate dob;
    private String education;
    private String workExperience;
    private String skills;
    private String resumeFilePath;
    private String photoFilePath;

    // Education Details (for detailed education records)
    private List<EducationDetailDto> educationDetails;

    public JobSeekerProfileDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getWorkExperience() {
        return workExperience;
    }

    public void setWorkExperience(String workExperience) {
        this.workExperience = workExperience;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResumeFilePath() {
        return resumeFilePath;
    }

    public void setResumeFilePath(String resumeFilePath) {
        this.resumeFilePath = resumeFilePath;
    }

    public String getPhotoFilePath() {
        return photoFilePath;
    }

    public void setPhotoFilePath(String photoFilePath) {
        this.photoFilePath = photoFilePath;
    }

    public List<EducationDetailDto> getEducationDetails() {
        return educationDetails;
    }

    public void setEducationDetails(List<EducationDetailDto> educationDetails) {
        this.educationDetails = educationDetails;
    }
}