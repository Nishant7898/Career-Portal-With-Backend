package com.careerportal.career_portal_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        // This configuration allows requests from your React development server
        registry.addMapping("/api/**") // Apply to all API endpoints
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // Support both ports
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Include OPTIONS for preflight
                .allowedHeaders("*") // Allowed request headers
                .allowCredentials(true) // Allows cookies and authorization headers (like JWT)
                .maxAge(3600); // Max age of the CORS pre-flight request
    }
}
