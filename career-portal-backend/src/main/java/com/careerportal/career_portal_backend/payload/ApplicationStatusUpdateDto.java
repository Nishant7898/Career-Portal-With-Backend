package com.careerportal.career_portal_backend.payload;

public class ApplicationStatusUpdateDto {
    private String newStatus;
    private String recruiterNotes;

    public ApplicationStatusUpdateDto() {
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public String getRecruiterNotes() {
        return recruiterNotes;
    }

    public void setRecruiterNotes(String recruiterNotes) {
        this.recruiterNotes = recruiterNotes;
    }
}