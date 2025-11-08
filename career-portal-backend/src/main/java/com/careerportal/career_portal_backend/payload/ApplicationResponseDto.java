package com.careerportal.career_portal_backend.payload;

import java.time.LocalDateTime;

public class ApplicationResponseDto {
    private Long id;
    private String jobTitle;
    private String companyName;
    private String status; // PENDING, SHORTLISTED, REJECTED
    private LocalDateTime applicationDate;
    private Long jobPostingId;
    private Long jobSeekerProfileId;
    private String recruiterNotes; // For employers to see their own notes
    
    // Job seeker details (for employer view)
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    
    // Resume information
    private String resumeFileName;
    private Boolean hasResume;

    public ApplicationResponseDto() {
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }

    public Long getJobPostingId() {
        return jobPostingId;
    }

    public void setJobPostingId(Long jobPostingId) {
        this.jobPostingId = jobPostingId;
    }

    public Long getJobSeekerProfileId() {
        return jobSeekerProfileId;
    }

    public void setJobSeekerProfileId(Long jobSeekerProfileId) {
        this.jobSeekerProfileId = jobSeekerProfileId;
    }

    public String getRecruiterNotes() {
        return recruiterNotes;
    }

    public void setRecruiterNotes(String recruiterNotes) {
        this.recruiterNotes = recruiterNotes;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getCandidatePhone() {
        return candidatePhone;
    }

    public void setCandidatePhone(String candidatePhone) {
        this.candidatePhone = candidatePhone;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public Boolean getHasResume() {
        return hasResume;
    }

    public void setHasResume(Boolean hasResume) {
        this.hasResume = hasResume;
    }
}
