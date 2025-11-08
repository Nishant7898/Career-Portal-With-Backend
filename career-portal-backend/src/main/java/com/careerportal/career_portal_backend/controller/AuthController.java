package com.careerportal.career_portal_backend.controller;


import com.careerportal.career_portal_backend.entity.Role;
import com.careerportal.career_portal_backend.entity.User;
import com.careerportal.career_portal_backend.payload.LoginDto;
import com.careerportal.career_portal_backend.payload.RegisterDto;
import com.careerportal.career_portal_backend.payload.JobSeekerRegisterDto;
import com.careerportal.career_portal_backend.payload.EmployerRegisterDto;
import com.careerportal.career_portal_backend.repository.RoleRepository;
import com.careerportal.career_portal_backend.repository.UserRepository;
import com.careerportal.career_portal_backend.repository.EmployerRepository;
import com.careerportal.career_portal_backend.security.JwtTokenProvider;
import com.careerportal.career_portal_backend.service.EmployerService;
import com.careerportal.career_portal_backend.service.JobSeekerProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmployerService employerService;
    private final JobSeekerProfileService jobSeekerProfileService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          EmployerRepository employerRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider tokenProvider,
                          EmployerService employerService,
                          JobSeekerProfileService jobSeekerProfileService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.employerRepository = employerRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.employerService = employerService;
        this.jobSeekerProfileService = jobSeekerProfileService;
    }

    // --- Login Endpoint ---
    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody @jakarta.validation.Valid LoginDto loginDto){
        try {
            logger.info("Login attempt for user: {}", loginDto.getUsernameOrEmail());

            // 1. Authenticate the user credentials (supports both username and email)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsernameOrEmail(), loginDto.getPassword()));

            // 2. Set the authentication in the Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. Generate JWT token
            String token = tokenProvider.generateToken(authentication);

            logger.info("Login successful for user: {}", loginDto.getUsernameOrEmail());

            // 4. Return the token to the client
            return new ResponseEntity<>("Bearer " + token, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Login failed for user: {}", loginDto.getUsernameOrEmail(), e);
            return new ResponseEntity<>("Invalid username/email or password", HttpStatus.UNAUTHORIZED);
        }
    }

    // --- Register Endpoint ---
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterDto registerDto){

        // 1. Check if username already exists
        if(userRepository.existsByUsername(registerDto.getUsername())){
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        // 2. Create the new User object
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword())); // HASH the password

        // 3. Assign the appropriate Role
        Role role = null;
        if (registerDto.getRole().equalsIgnoreCase("jobseeker")) {
            // Find or create the JOB_SEEKER role
            role = roleRepository.findByName("ROLE_JOB_SEEKER")
                    .orElseGet(() -> new Role("ROLE_JOB_SEEKER"));
        } else if (registerDto.getRole().equalsIgnoreCase("employer")) {
            // Find or create the EMPLOYER role
            role = roleRepository.findByName("ROLE_EMPLOYER")
                    .orElseGet(() -> new Role("ROLE_EMPLOYER"));
        } else {
            return new ResponseEntity<>("Invalid role specified!", HttpStatus.BAD_REQUEST);
        }

        // Save the role if it was newly created
        if (role.getId() == null) {
            role = roleRepository.save(role);
        }

        user.setRoles(Collections.singleton(role));

        // 4. Save the new User to the database
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", savedUser.getUsername());

        // 5. Create corresponding profile based on role
        if (registerDto.getRole().equalsIgnoreCase("employer")) {
            employerService.createDefaultEmployerProfile(savedUser);
            logger.info("Created employer profile for user: {}", savedUser.getUsername());
        }
        // Note: JobSeeker profiles will be created via separate registration endpoint

        return new ResponseEntity<>("User registered successfully!", HttpStatus.OK);
    }

    // --- Job Seeker Registration Endpoint ---
    @PostMapping("/register/jobseeker")
    public ResponseEntity<String> registerJobSeeker(@RequestBody @jakarta.validation.Valid JobSeekerRegisterDto registerDto) {
        try {
            logger.info("Registering job seeker: {}", registerDto.getUsername());

            // 1. Check if username or email already exists
            if (userRepository.existsByUsername(registerDto.getUsername())) {
                return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
            }

            // Check if email already exists
            if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
                return new ResponseEntity<>("Email is already registered!", HttpStatus.BAD_REQUEST);
            }

            // 2. Create the new User object
            User user = new User();
            user.setUsername(registerDto.getUsername());
            user.setEmail(registerDto.getEmail());
            user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

            // 3. Assign the JOB_SEEKER role
            Role role = roleRepository.findByName("ROLE_JOB_SEEKER")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_JOB_SEEKER")));

            user.setRoles(Collections.singleton(role));

            // 4. Save the new User to the database
            User savedUser = userRepository.save(user);
            logger.info("Job seeker user registered successfully: {}", savedUser.getUsername());

            // 5. Create the job seeker profile
            jobSeekerProfileService.createJobSeekerProfile(savedUser, registerDto);
            logger.info("Created job seeker profile for user: {}", savedUser.getUsername());

            return new ResponseEntity<>("Job seeker registered successfully!", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error registering job seeker: {}", registerDto.getUsername(), e);
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- Employer Registration Endpoint ---
    @PostMapping("/register/employer")
    public ResponseEntity<String> registerEmployer(@RequestBody @jakarta.validation.Valid EmployerRegisterDto registerDto) {
        try {
            logger.info("Registering employer: {}", registerDto.getUsername());

            // 1. Check if username or email already exists
            if (userRepository.existsByUsername(registerDto.getUsername())) {
                return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
            }

            // Check if email already exists
            if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
                return new ResponseEntity<>("Email is already registered!", HttpStatus.BAD_REQUEST);
            }

            // Check if company name already exists
            if (employerRepository.existsByCompanyName(registerDto.getCompanyName())) {
                return new ResponseEntity<>("Company name is already registered!", HttpStatus.BAD_REQUEST);
            }

            // 2. Create the new User object
            User user = new User();
            user.setUsername(registerDto.getUsername());
            user.setEmail(registerDto.getEmail());
            user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

            // 3. Assign the EMPLOYER role
            Role role = roleRepository.findByName("ROLE_EMPLOYER")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_EMPLOYER")));

            user.setRoles(Collections.singleton(role));

            // 4. Save the new User to the database
            User savedUser = userRepository.save(user);
            logger.info("Employer user registered successfully: {}", savedUser.getUsername());

            // 5. Create the employer profile
            employerService.createEmployerProfile(savedUser, registerDto);
            logger.info("Created employer profile for user: {}", savedUser.getUsername());

            return new ResponseEntity<>("Employer registered successfully!", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error registering employer: {}", registerDto.getUsername(), e);
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
