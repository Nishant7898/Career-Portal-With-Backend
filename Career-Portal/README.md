# Career Portal - Frontend

React-based frontend application for the Career Portal platform.

## 🎨 Features

- **Modern UI/UX** - Clean and responsive design using TailwindCSS
- **Role-Based Navigation** - Different interfaces for job seekers and employers
- **Real-time Updates** - Dynamic content updates without page refresh
- **File Upload** - Resume and photo upload functionality
- **Advanced Search** - Filter jobs by multiple criteria
- **Authentication** - Secure JWT-based authentication with context management

## 🛠️ Technology Stack

- **React** 19.1.0 - UI library
- **Vite** 6.3.5 - Build tool and dev server
- **TailwindCSS** 4.1.16 - Utility-first CSS framework
- **React Router DOM** 7.9.5 - Client-side routing
- **Axios** 1.13.1 - HTTP client
- **React Icons** 5.5.0 - Icon library

## 📁 Project Structure

```
Career-Portal/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Jobsection.jsx
│   │   ├── Profilesection.jsx
│   │   └── ...
│   ├── context/           # React Context
│   │   └── AuthContext.jsx
│   ├── services/          # API services
│   │   ├── authService.js
│   │   ├── jobService.js
│   │   ├── profileService.js
│   │   └── ...
│   ├── Pages/             # Page components
│   │   └── Home.jsx
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint:
   - The backend API URL is set to `http://localhost:8080` by default
   - Update in service files if your backend runs on a different port

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔑 Environment Variables

Create a `.env` file in the root directory (optional):

```env
VITE_API_URL=http://localhost:8080
```

## 📱 Components Overview

### Core Components

- **Navbar** - Navigation bar with role-based menu items
- **Dashboard** - Employer dashboard showing job postings and statistics
- **Jobsection** - Job listing with search and filter functionality
- **Profilesection** - User profile management
- **Loginform** - User authentication form
- **RegisterAsCandidate** - Job seeker registration form
- **RegisterAsCompany** - Employer registration form

### Job Management Components

- **Postjob** - Create new job posting (Employer)
- **EditJob** - Edit existing job posting (Employer)
- **Jobsubmit** - Job application form (Job Seeker)
- **JobApplications** - View and manage applications (Employer)

### Profile Components

- **Editprofile** - Edit job seeker profile
- **EditcompanyProfile** - Edit employer/company profile
- **CompanySection** - Browse companies
- **Report** - Candidate reports (Employer)

## 🔐 Authentication Flow

1. User logs in via `/login`
2. JWT token is received and stored in localStorage
3. AuthContext provides authentication state globally
4. Protected routes check authentication before rendering
5. Token is sent with each API request via Axios interceptors

## 🎯 Key Features Implementation

### Authentication Context

```javascript
import { useAuth } from '../context/AuthContext';

const { isAuthenticated, userRole, login, logout, isEmployer, isJobSeeker } = useAuth();
```

### API Service Pattern

```javascript
import { jobService } from '../services/jobService';

const result = await jobService.getAllJobs(filters);
if (result.success) {
  // Handle success
}
```

### File Upload

```javascript
import { fileService } from '../services/fileService';

const result = await fileService.uploadResume(file);
```

## 🎨 Styling

The project uses TailwindCSS for styling. Key design principles:

- **Responsive Design** - Mobile-first approach
- **Color Scheme** - Blue primary color (#2563eb)
- **Consistent Spacing** - Using Tailwind's spacing scale
- **Accessibility** - Proper contrast ratios and semantic HTML

### Custom Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Custom configurations
    },
  },
}
```

## 🔄 State Management

- **Local State** - useState for component-level state
- **Context API** - AuthContext for global authentication state
- **No Redux** - Keeping it simple with React's built-in tools

## 📡 API Integration

All API calls are centralized in service files:

- `authService.js` - Authentication endpoints
- `jobService.js` - Job posting endpoints
- `applicationService.js` - Application management
- `profileService.js` - Profile management
- `fileService.js` - File upload/download
- `companyService.js` - Company information
- `jobSeekerService.js` - Job seeker data

### API Base Configuration

```javascript
const API_URL = 'http://localhost:8080/api';
```

## 🧪 Development Tips

### Hot Module Replacement (HMR)

Vite provides fast HMR for instant feedback during development.

### Code Organization

- Keep components small and focused
- Use custom hooks for reusable logic
- Separate business logic from UI components
- Use service layer for API calls

### Best Practices

- Use functional components with hooks
- Implement proper error handling
- Show loading states during API calls
- Validate user input before submission
- Use semantic HTML elements

## 🐛 Common Issues & Solutions

### CORS Errors
- Ensure backend CORS configuration allows `http://localhost:5173`
- Check that credentials are included in requests

### Authentication Issues
- Clear localStorage if token is invalid
- Check token expiration
- Verify JWT secret matches backend

### File Upload Issues
- Check file size limits
- Verify file type restrictions
- Ensure proper multipart/form-data headers

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.9.5",
  "axios": "^1.13.1",
  "react-icons": "^5.5.0",
  "tailwindcss": "^4.1.16"
}
```

### Development Dependencies
```json
{
  "vite": "^6.3.5",
  "@vitejs/plugin-react": "^4.4.1",
  "eslint": "^9.25.0"
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables for Production

Set the following in your hosting platform:
- `VITE_API_URL` - Your production backend URL

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test your changes thoroughly
5. Update documentation as needed

## 📄 License

This project is part of the Career Portal application.
