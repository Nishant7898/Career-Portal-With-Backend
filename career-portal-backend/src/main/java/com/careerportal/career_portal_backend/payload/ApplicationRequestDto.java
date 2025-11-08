package com.careerportal.career_portal_backend.payload;

public class ApplicationRequestDto {
    // We could include a cover letter text here, but for simplicity,
    // we'll keep it minimal as the profile already has the resume.
    private String coverLetter;

    public ApplicationRequestDto() {
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
}
