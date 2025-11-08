package com.careerportal.career_portal_backend.repository;

import com.careerportal.career_portal_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Used during the JWT login process to fetch the user details
    Optional<User> findByUsername(String username);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Used to ensure no duplicate usernames/emails during registration
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}