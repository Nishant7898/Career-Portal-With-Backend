package com.careerportal.career_portal_backend.payload;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class EmployerRegisterDto {
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotBlank(message = "Company name is required")
    private String companyName;
    
    @NotBlank(message = "Industry is required")
    private String industry;
    
    private String companySize; // Optional
    
    private String headquarters; // Optional
    
    @Pattern(regexp = "^(PUBLIC|PRIVATE|STARTUP|NON_PROFIT|GOVERNMENT|PARTNERSHIP|LLC|CORPORATION)$", 
             message = "Company type must be one of: PUBLIC, PRIVATE, STARTUP, NON_PROFIT, GOVERNMENT, PARTNERSHIP, LLC, CORPORATION")
    private String companyType; // Optional
    
    @Min(value = 1800, message = "Founded year must be after 1800")
    @Max(value = 2030, message = "Founded year cannot be in the future")
    private Integer founded; // Optional
    
    private String specialities; // Optional
    
    private String companyAddress; // Optional
    
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "Please provide a valid phone number")
    private String companyPhone; // Optional

    public EmployerRegisterDto() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getCompanySize() {
        return companySize;
    }

    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }

    public String getHeadquarters() {
        return headquarters;
    }

    public void setHeadquarters(String headquarters) {
        this.headquarters = headquarters;
    }

    public String getCompanyType() {
        return companyType;
    }

    public void setCompanyType(String companyType) {
        this.companyType = companyType;
    }

    public Integer getFounded() {
        return founded;
    }

    public void setFounded(Integer founded) {
        this.founded = founded;
    }

    public String getSpecialities() {
        return specialities;
    }

    public void setSpecialities(String specialities) {
        this.specialities = specialities;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getCompanyPhone() {
        return companyPhone;
    }

    public void setCompanyPhone(String companyPhone) {
        this.companyPhone = companyPhone;
    }
}