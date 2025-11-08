package com.careerportal.career_portal_backend.payload;

import jakarta.validation.constraints.NotBlank;

public class LoginDto {
    @NotBlank(message = "Username or email is required")
    private String usernameOrEmail; // Can be either username or email
    
    @NotBlank(message = "Password is required")
    private String password;

    public LoginDto() {
    }

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}