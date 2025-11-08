# Career Portal

A full-stack web application that connects job seekers with employers, facilitating job postings, applications, and candidate management.

## 🌟 Features

### For Job Seekers
- **User Registration & Authentication** - Secure signup and login with JWT authentication
- **Profile Management** - Create and update detailed profiles with resume and photo uploads
- **Job Search & Filtering** - Browse and search jobs by title, location, skills, and experience level
- **Job Applications** - Apply to jobs with resume submission
- **Application Tracking** - View application status and history

### For Employers
- **Company Profile Management** - Create and manage company profiles
- **Job Posting** - Post, edit, and manage job listings
- **Application Management** - Review applications, update candidate status
- **Dashboard** - View all job postings and application statistics
- **Candidate Reports** - Access detailed candidate information and resumes

## 🏗️ Architecture

This project follows a modern full-stack architecture:

- **Frontend**: React.js with Vite, TailwindCSS for styling
- **Backend**: Spring Boot (Java 17) with RESTful APIs
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local file system for resumes and photos

## 📁 Project Structure

```
career-portal/
├── Career-Portal/          # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── context/        # React context (Auth)
│   │   └── Pages/          # Page components
│   └── package.json
│
├── career-portal-backend/  # Backend Spring Boot application
│   ├── src/main/java/
│   │   └── com/careerportal/career_portal_backend/
│   │       ├── controller/ # REST controllers
│   │       ├── service/    # Business logic
│   │       ├── entity/     # JPA entities
│   │       ├── repository/ # Data access layer
│   │       ├── security/   # JWT & security config
│   │       └── payload/    # DTOs
│   └── pom.xml
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Java** (JDK 17 or higher)
- **Maven** (v3.6 or higher)
- **MySQL** (v8.0 or higher)

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE career_portal;
```

2. Update database credentials in `career-portal-backend/src/main/resources/application.properties`

### Backend Setup

```bash
cd career-portal-backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

```bash
cd Career-Portal
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📚 Documentation

- [Frontend Documentation](./Career-Portal/README.md)
- [Backend Documentation](./career-portal-backend/README.md)

## 🔑 Default Roles

The application supports two user roles:
- **ROLE_JOB_SEEKER** - For candidates looking for jobs
- **ROLE_EMPLOYER** - For companies posting jobs

## 🛠️ Technology Stack

### Frontend
- React 19
- Vite
- TailwindCSS 4
- React Router DOM
- Axios
- React Icons

### Backend
- Spring Boot 3.5.7
- Spring Security
- Spring Data JPA
- MySQL
- JWT (jjwt 0.11.5)
- Maven

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register/jobseeker` - Job seeker registration
- `POST /api/auth/register/employer` - Employer registration

### Job Postings
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/{id}` - Get job by ID
- `POST /api/jobs` - Create job posting (Employer only)
- `PUT /api/jobs/{id}` - Update job posting (Employer only)
- `DELETE /api/jobs/{id}` - Delete job posting (Employer only)

### Applications
- `POST /api/applications/apply/{jobId}` - Apply to a job
- `GET /api/applications/job/{jobId}` - Get applications for a job (Employer only)
- `PUT /api/applications/{id}/status` - Update application status (Employer only)

### Profiles
- `GET /api/jobseeker/profile` - Get job seeker profile
- `PUT /api/jobseeker/profile` - Update job seeker profile
- `GET /api/employer/profile` - Get employer profile
- `PUT /api/employer/profile` - Update employer profile

## 🔒 Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control (RBAC)
- CORS configuration for frontend-backend communication
- Secure file upload validation

## 📦 File Upload

The application supports file uploads for:
- Job seeker resumes (PDF, DOC, DOCX)
- Job seeker profile photos (JPG, PNG)

Files are stored in the `uploads/` directory on the server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- Pushpraj Kushwaha  (Backend)
- Nishant Pathak  (Frontend)

## 🙏 Acknowledgments

- Spring Boot documentation
- React documentation
- TailwindCSS for the styling framework
