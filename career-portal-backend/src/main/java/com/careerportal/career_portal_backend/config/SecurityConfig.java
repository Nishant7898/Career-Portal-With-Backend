package com.careerportal.career_portal_backend.config;

import com.careerportal.career_portal_backend.security.JwtAuthenticationEntryPoint;
import com.careerportal.career_portal_backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    public SecurityConfig(UserDetailsService userDetailsService,
                          JwtAuthenticationFilter jwtAuthenticationFilter,
                          JwtAuthenticationEntryPoint authenticationEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    // Use BCrypt for password hashing
    @Bean
    public static PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    // Manages the authentication process
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // Define security rules and filters
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable()) // Disable CSRF for stateless REST APIs
                .authorizeHttpRequests((authorize) ->
                        authorize.requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll() // Allow public access to login/register
                                .requestMatchers(HttpMethod.POST, "/api/files/**").permitAll() // Allow public access to file uploads for registration
                                .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()  // Allow public access to view job listings
                                .requestMatchers(HttpMethod.GET, "/api/employer/all").permitAll() // Allow public access to view companies
                                .requestMatchers(HttpMethod.GET, "/api/jobseekers/all").permitAll() // Allow public access to view job seekers
                                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll() // Allow public access to uploaded files
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight requests
                                .anyRequest().authenticated() // Secure all other endpoints
                ).exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint) // Handle unauthorized access
                ).sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Use stateless sessions (JWT)

        // Add the JWT filter before Spring's default authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
