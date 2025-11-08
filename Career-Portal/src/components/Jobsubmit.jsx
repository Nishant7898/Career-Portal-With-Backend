import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { applicationService } from "../services/applicationService";
import { jobService } from "../services/jobService";

const Jobsubmit = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();
  
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [job, setJob] = useState(null);
  const [jobTitle, setJobTitle] = useState(location.state?.jobTitle || "");

  useEffect(() => {
    if (!isAuthenticated || !isJobSeeker()) {
      navigate("/login");
      return;
    }

    fetchJobDetails();
  }, [isAuthenticated, isJobSeeker, navigate, jobId]);

  const fetchJobDetails = async () => {
    try {
      const result = await jobService.getJobById(jobId);
      if (result.success) {
        setJob(result.data);
        setJobTitle(result.data.jobTitle);
      } else {
        setError("Failed to load job details");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError("Error loading job details");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      setError("");
    } else {
      alert("Please upload a valid PDF file!");
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!fileName) {
      alert("Please upload your resume first!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get the file from the input
      const fileInput = document.getElementById('file-upload');
      const file = fileInput.files[0];
      
      const result = await applicationService.applyForJob(jobId, file);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("An error occurred while submitting your application");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSubmitted(false);
    setFileName("");
    setError("");
  };

  const handleBackToJobs = () => {
    navigate("/jobs");
  };

  if (error && !job) {
    return (
      <div className="h-screen w-screen items-center bg-gray-100 flex justify-center">
        <div className="h-auto w-[500px] rounded-md bg-white border-white shadow-2xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBackToJobs}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen items-center bg-gray-100 flex justify-center">
      <div className="h-auto w-[500px] rounded-md bg-white border-white shadow-2xl p-4 relative">
        {/* Back button */}
        <button
          onClick={handleBackToJobs}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft />
        </button>

        {/* Title only before submission */}
        {!submitted && (
          <div className="bg-blue-600 text-white text-xl p-3 font-semibold text-center mb-4">
            Apply to "{jobTitle}"
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Before Submit */}
        {!submitted ? (
          <>
            {job && (
              <div className="mb-4 px-4">
                <h3 className="font-semibold text-gray-800 mb-2">Job Details:</h3>
                <p className="text-sm text-gray-600 mb-1"><strong>Location:</strong> {job.location}</p>
                {job.salaryDetails && (
                  <p className="text-sm text-gray-600 mb-1"><strong>Salary:</strong> {job.salaryDetails}</p>
                )}
                {job.experienceLevel && (
                  <p className="text-sm text-gray-600 mb-1"><strong>Experience:</strong> {job.experienceLevel}</p>
                )}
              </div>
            )}

            <div className="mt-4 px-5 flex items-center gap-2">
              <span className="font-medium">Resume:</span>
              <label
                htmlFor="file-upload"
                className="border text-xs p-2 px-3 hover:bg-gray-400 bg-gray-200 cursor-pointer rounded"
              >
                Choose file
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-600">
                {fileName ? fileName : "No File Chosen"}
              </p>
            </div>

            <p className="text-xs text-gray-500 px-5 mt-2">
              * Resume upload is required but file processing will be implemented later
            </p>

            <div className="flex gap-3 px-4 mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading || !fileName}
                className="bg-green-700 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              <button
                onClick={handleBackToJobs}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success Message Row */}
            <div className="flex justify-between items-center mt-4 px-4">
              <p className="text-green-700 font-semibold text-lg">
                🎉 Application submitted successfully!
              </p>
              <button onClick={handleCancel}>
                <RxCross2 className="text-red-600 text-2xl hover:text-red-800 cursor-pointer" />
              </button>
            </div>

            <div className="mt-6 px-5">
              <p className="text-gray-700 mb-4">
                Your application for "{jobTitle}" has been submitted and the employer will review it soon.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleBackToJobs}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Browse More Jobs
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  View My Applications
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Jobsubmit;
