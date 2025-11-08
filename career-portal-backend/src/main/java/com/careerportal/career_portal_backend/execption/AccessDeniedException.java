package com.careerportal.career_portal_backend.execption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Tells Spring to respond with HTTP 403 (Forbidden) when this exception is thrown
@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class AccessDeniedException extends RuntimeException {

    // Simple constructor that accepts the custom error message
    public AccessDeniedException(String message) {
        super(message);
    }
}
