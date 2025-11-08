import React, { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { jobService } from "../services/jobService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Postjob = () => {
  const { isEmployer } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobPosition: "",
    description: "",
    requiredSkills: "",
    location: "",
    experienceLevel: "",
    functionalArea: "",
    industry: "",
    salaryDetails: "",
  });

  // Check if user is employer
  if (!isEmployer()) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-2xl rounded-xl p-10 w-[600px] text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-4">Only employers can post jobs.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Login as Employer
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!jobData.jobTitle || !jobData.description || !jobData.location) {
      setError("Please fill all required fields!");
      return;
    }

    setLoading(true);

    try {
      const result = await jobService.createJob(jobData);
      
      if (result.success) {
        setSuccess("Job posted successfully!");
        setJobData({
          jobTitle: "",
          jobPosition: "",
          description: "",
          requiredSkills: "",
          location: "",
          experienceLevel: "",
          functionalArea: "",
          industry: "",
          salaryDetails: "",
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while posting the job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-[600px]">
        <h2 className="text-3xl items-center flex gap-2 justify-center font-bold text-center text-white bg-blue-700 w-full py-8 rounded-t-4xl
         mb-6">
        <FaBriefcase />  Post a New Job
        </h2>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <div>
            <label className="block font-semibold mb-1">Job Title*</label>
            <input
              type="text"
              name="jobTitle"
              value={jobData.jobTitle}
              onChange={handleChange}
              placeholder="Enter job title"
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Job Position</label>
            <input
              type="text"
              name="jobPosition"
              value={jobData.jobPosition}
              onChange={handleChange}
              placeholder="Enter job position"
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description*</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              placeholder="Enter job description"
              rows="4"
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold mb-1">Required Skills</label>
            <input
              type="text"
              name="requiredSkills"
              value={jobData.requiredSkills}
              onChange={handleChange}
              placeholder="e.g., Java, Spring Boot, React"
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Location*</label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              placeholder="Enter job location"
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Experience Level</label>
            <select
              name="experienceLevel"
              value={jobData.experienceLevel}
              onChange={handleChange}
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Select Experience Level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Functional Area</label>
            <input
              type="text"
              name="functionalArea"
              value={jobData.functionalArea}
              onChange={handleChange}
              placeholder="e.g., IT, Marketing, Sales"
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              value={jobData.industry}
              onChange={handleChange}
              placeholder="e.g., Technology, Healthcare, Finance"
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Salary Details</label>
            <input
              type="text"
              name="salaryDetails"
              value={jobData.salaryDetails}
              onChange={handleChange}
              placeholder="Enter salary range or amount"
              className="w-full border rounded-md p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-900 flex items-center text-center justify-center gap-2 cursor-pointer text-white font-semibold py-2 rounded-md hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
           <FaTelegramPlane /> {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Postjob;
