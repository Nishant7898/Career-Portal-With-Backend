import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Chooseyour from "./components/Chooseyour";
import RegisterAsCandidate from "./components/RegisterAsCandidate";
import Loginform from "./components/Loginform";
import Jobsection from "./components/Jobsection";
import Jobsubmit from "./components/Jobsubmit";
import RegisterAsCompany from "./components/RegisterAsCompany";
import Footer from "./components/Footer";
import CompanySection from "./components/CompanySection";
import Profile from "./components/Profilesection";
import EditProfile from "./components/Editprofile";
import Postjob from "./components/Postjob";
import EditCompanyProfile from "./components/EditcompanyProfile";
import CompanyAccessdenied from "./components/CompanyAccessdenied";
import Dashboard from "./components/Dashboard";
import CandidateAcessDenied from "./components/CandidateAcessDenied";
// Test and Debug Components - Commented out for production
// import ApiTest from "./components/ApiTest";
// import FileUploadTest from "./components/FileUploadTest";
// import LoginDebug from "./components/LoginDebug";
// import JobSeekerProfile from "./components/JobSeekerProfile";
// import EmployerProfile from "./components/EmployerProfile";
// import FileAccessTest from "./components/FileAccessTest";
// import CompaniesApiTest from "./components/CompaniesApiTest";
// import EmployerProfileTest from "./components/EmployerProfileTest";
// import JobPostingsTest from "./components/JobPostingsTest";
// import ApplicationTest from "./components/ApplicationTest";
import EditJob from "./components/EditJob";
// import EditJobTest from "./components/EditJobTest";
// import JobSearchTest from "./components/JobSearchTest";
import JobApplications from "./components/JobApplications";
import Report from "./components/Report";



const App = () => {
  return (
    <div className="bg-gray-100">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/choose" element={<Chooseyour />} />
            <Route path="/candidate" element={<RegisterAsCandidate />} />
            <Route path="/login" element={<Loginform />} />
            <Route path="/jobs" element={<Jobsection />} />
            <Route path="/submit/:jobId" element={<Jobsubmit />} />
            <Route path="/ascompany" element={<RegisterAsCompany />} />
            <Route path="/companies" element={<CompanySection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/jobpost" element={<Postjob />} />
            <Route path="/editcompanyprofile" element={<EditCompanyProfile />} />
            <Route path="/access-denied" element={<CompanyAccessdenied />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/access-denied1" element={<CandidateAcessDenied />} />
            {/* Test and Debug Routes - Commented out for production */}
            {/* <Route path="/api-test" element={<ApiTest />} /> */}
            {/* <Route path="/file-test" element={<FileUploadTest />} /> */}
            {/* <Route path="/login-debug" element={<LoginDebug />} /> */}
            {/* <Route path="/jobseeker-profile" element={<JobSeekerProfile />} /> */}
            {/* <Route path="/employer-profile" element={<EmployerProfile />} /> */}
            {/* <Route path="/file-access-test" element={<FileAccessTest />} /> */}
            {/* <Route path="/companies-api-test" element={<CompaniesApiTest />} /> */}
            {/* <Route path="/employer-profile-test" element={<EmployerProfileTest />} /> */}
            {/* <Route path="/job-postings-test" element={<JobPostingsTest />} /> */}
            {/* <Route path="/application-test" element={<ApplicationTest />} /> */}
            <Route path="/editjob/:jobId" element={<EditJob />} />
            {/* <Route path="/edit-job-test" element={<EditJobTest />} /> */}
            {/* <Route path="/job-search-test" element={<JobSearchTest />} /> */}
            <Route path="/job-applications/:jobId" element={<JobApplications />} />
            <Route path="/report" element={<Report />} />
            <Route path="/reports" element={<Report />} />

          </Routes>

          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
