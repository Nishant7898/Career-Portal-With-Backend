# Career Portal - Backend

Spring Boot RESTful API backend for the Career Portal platform.

## 🎯 Features

- **RESTful API** - Clean and well-structured REST endpoints
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Separate permissions for job seekers and employers
- **File Management** - Resume and photo upload/download functionality
- **Database Integration** - MySQL with JPA/Hibernate
- **Input Validation** - Request validation using Bean Validation
- **Exception Handling** - Centralized error handling
- **CORS Configuration** - Configured for frontend integration

## 🛠️ Technology Stack

- **Spring Boot** 3.5.7 - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **MySQL** - Relational database
- **JWT (jjwt)** 0.11.5 - JSON Web Token implementation
- **Hibernate** - ORM framework
- **Maven** - Build and dependency management
- **Java** 17 - Programming language

## 📁 Project Structure

```
career-portal-backend/
├── src/main/java/com/careerportal/career_portal_backend/
│   ├── config/              # Configuration classes
│   │   ├── SecurityConfig.java
│   │   └── WebMvcConfig.java
│   ├── controller/          # REST controllers
│   │   ├── AuthController.java
│   │   ├── JobPostingController.java
│   │   ├── ApplicationController.java
│   │   ├── JobSeekerController.java
│   │   └── EmployerController.java
│   ├── entity/              # JPA entities
│   │   ├── User.java
│   │   ├── JobPosting.java
│   │   ├── Application.java
│   │   ├── JobSeekerProfile.java
│   │   ├── Employer.java
│   │   └── Role.java
│   ├── repository/          # Data access layer
│   │   ├── UserRepository.java
│   │   ├── JobPostingRepository.java
│   │   └── ...
│   ├── service/             # Business logic
│   │   ├── JobPostingService.java
│   │   ├── ApplicationService.java
│   │   ├── EmployerService.java
│   │   └── ...
│   ├── security/            # Security components
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtAuthenticationEntryPoint.java
│   │   └── CustomUserDetailsService.java
│   ├── payload/             # DTOs
│   │   ├── LoginDto.java
│   │   ├── JobPostingDto.java
│   │   └── ...
│   ├── exception/           # Custom exceptions
│   │   ├── ResourceNotFoundException.java
│   │   └── AccessDeniedException.java
│   └── CareerPortalBackendApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── ...
├── uploads/                 # File storage directory
├── pom.xml
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Java JDK 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE career_portal;
```

2. Create a MySQL user (optional):
```sql
CREATE USER 'career_portal_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON career_portal.* TO 'career_portal_user'@'localhost';
FLUSH PRIVILEGES;
```

### Configuration

Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/career_portal
spring.datasource.username=root
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration
app.jwt-secret=your-secret-key-here-make-it-long-and-secure
app.jwt-expiration-milliseconds=604800000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Server Port
server.port=8080
```

### Installation & Running

1. Clone the repository
2. Navigate to the backend directory:
```bash
cd career-portal-backend
```

3. Install dependencies and build:
```bash
mvn clean install
```

4. Run the application:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### Alternative: Run with JAR

```bash
mvn clean package
java -jar target/career-portal-backend-0.0.1-SNAPSHOT.jar
```

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register Job Seeker
```http
POST /api/auth/register/jobseeker
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "mobile": "1234567890",
  "status": "FRESHER",
  "gender": "MALE",
  "dob": "1995-01-15",
  "education": "Bachelor's in Computer Science",
  "workExperience": "None",
  "skills": "Java, Spring Boot, React"
}
```

#### Register Employer
```http
POST /api/auth/register/employer
Content-Type: application/json

{
  "username": "tech_corp",
  "email": "hr@techcorp.com",
  "password": "password123",
  "companyName": "Tech Corp",
  "industry": "Information Technology",
  "companySize": "51-200",
  "headquarters": "San Francisco, CA"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "john_doe",
  "password": "password123"
}

Response:
Bearer eyJhbGciOiJIUzI1NiJ9...
```

### Job Posting Endpoints

#### Get All Jobs (with filters)
```http
GET /api/jobs?title=developer&location=remote&skills=java
Authorization: Bearer {token}
```

#### Get Job by ID
```http
GET /api/jobs/{jobId}
Authorization: Bearer {token}
```

#### Create Job Posting (Employer only)
```http
POST /api/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobTitle": "Senior Java Developer",
  "description": "We are looking for...",
  "requiredSkills": "Java, Spring Boot, MySQL",
  "location": "Remote",
  "experienceLevel": "5+ years",
  "salaryDetails": "$100k - $150k"
}
```

#### Update Job Posting (Employer only)
```http
PUT /api/jobs/{jobId}
Authorization: Bearer {token}
Content-Type: application/json
```

#### Delete Job Posting (Employer only)
```http
DELETE /api/jobs/{jobId}
Authorization: Bearer {token}
```

### Application Endpoints

#### Apply to Job
```http
POST /api/applications/apply/{jobId}
Authorization: Bearer {token}
Content-Type: multipart/form-data

resume: [file]
```

#### Get Applications for Job (Employer only)
```http
GET /api/applications/job/{jobId}
Authorization: Bearer {token}
```

#### Update Application Status (Employer only)
```http
PUT /api/applications/{applicationId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "newStatus": "SHORTLISTED",
  "recruiterNotes": "Good candidate"
}
```

#### Download Resume
```http
GET /api/applications/{applicationId}/resume
Authorization: Bearer {token}
```

### Profile Endpoints

#### Get Job Seeker Profile
```http
GET /api/jobseeker/profile
Authorization: Bearer {token}
```

#### Update Job Seeker Profile
```http
PUT /api/jobseeker/profile
Authorization: Bearer {token}
Content-Type: application/json
```

#### Get Employer Profile
```http
GET /api/employer/profile
Authorization: Bearer {token}
```

#### Update Employer Profile
```http
PUT /api/employer/profile
Authorization: Bearer {token}
Content-Type: application/json
```

### File Upload Endpoints

#### Upload Resume
```http
POST /api/files/upload/resume
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [resume.pdf]
```

#### Upload Photo
```http
POST /api/files/upload/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [photo.jpg]
```

## 🔐 Security

### JWT Authentication

The application uses JWT for stateless authentication:

1. User logs in with credentials
2. Server validates and returns JWT token
3. Client includes token in Authorization header for subsequent requests
4. Server validates token and extracts user information

### Token Structure

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VybmFtZSIsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Password Encryption

- Passwords are hashed using BCrypt
- Salt rounds: 10 (default)
- Never store plain text passwords

### Role-Based Access Control

Two main roles:
- `ROLE_JOB_SEEKER` - Can apply to jobs, manage profile
- `ROLE_EMPLOYER` - Can post jobs, manage applications

### CORS Configuration

Configured to allow requests from:
- `http://localhost:5173` (Frontend dev server)
- Add production URLs as needed

## 🗄️ Database Schema

### Main Tables

- **users** - User authentication data
- **roles** - User roles
- **user_roles** - Many-to-many relationship
- **job_seeker_profiles** - Job seeker information
- **employers** - Employer/company information
- **job_postings** - Job listings
- **applications** - Job applications
- **education_details** - Education history

### Entity Relationships

```
User (1) -----> (1) JobSeekerProfile
User (1) -----> (1) Employer
Employer (1) --> (*) JobPosting
JobPosting (1) --> (*) Application
JobSeekerProfile (1) --> (*) Application
```

## 📦 Dependencies

### Core Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

### JWT Dependencies

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
```

## 🧪 Testing

Run tests:
```bash
mvn test
```

Run with coverage:
```bash
mvn clean test jacoco:report
```

## 🐛 Common Issues & Solutions

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in application.properties
- Ensure database exists

### JWT Token Issues
- Verify JWT secret is configured
- Check token expiration time
- Ensure token is sent in Authorization header

### File Upload Issues
- Check file size limits in application.properties
- Verify uploads directory exists and has write permissions
- Ensure proper multipart configuration

### CORS Issues
- Add frontend URL to CORS configuration
- Check allowed methods and headers

## 🔧 Configuration Properties

### Application Properties

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/career_portal
spring.datasource.username=root
spring.datasource.password=password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt-secret=your-secret-key
app.jwt-expiration-milliseconds=604800000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=./uploads
```

## 📊 Logging

Configure logging in `application.properties`:

```properties
logging.level.root=INFO
logging.level.com.careerportal=DEBUG
logging.level.org.springframework.security=DEBUG
logging.file.name=logs/career-portal.log
```

## 🚀 Deployment

### Build for Production

```bash
mvn clean package -DskipTests
```

### Run Production JAR

```bash
java -jar target/career-portal-backend-0.0.1-SNAPSHOT.jar
```

### Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t career-portal-backend .
docker run -p 8080:8080 career-portal-backend
```

## 📝 Best Practices

- Use DTOs for API requests/responses
- Implement proper exception handling
- Validate all user inputs
- Use transactions for data consistency
- Log important operations
- Keep controllers thin, business logic in services
- Use meaningful HTTP status codes
- Document API endpoints

## 🤝 Contributing

1. Follow Java coding conventions
2. Write unit tests for new features
3. Update API documentation
4. Use meaningful commit messages
5. Keep methods small and focused

## 📄 License

This project is part of the Career Portal application.
