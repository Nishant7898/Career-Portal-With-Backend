import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaEye,
} from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/jobService";
import { applicationService } from "../services/applicationService";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isEmployer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !isEmployer()) {
      navigate("/login");
      return;
    }

    fetchJobApplications();
  }, [isAuthenticated, isEmployer, navigate, jobId]);

  const fetchJobApplications = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch job details
      const jobResult = await jobService.getJobById(jobId);
      if (jobResult.success) {
        setJob(jobResult.data);
      }

      // Fetch applications
      const applicationsResult = await applicationService.getApplicationsForJob(
        jobId
      );
      if (applicationsResult.success) {
        setApplications(applicationsResult.data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching job applications:", error);
      setError("Failed to load job applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const result = await applicationService.updateApplicationStatus(
        applicationId,
        newStatus
      );
      if (result.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        alert("Failed to update application status: " + result.message);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Error updating application status");
    }
  };

  const handleDownloadResume = async (applicationId) => {
    try {
      const result = await applicationService.downloadResume(applicationId);
      if (!result.success) {
        alert("Failed to download resume: " + result.message);
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Error downloading resume");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col gap-4 justify-center items-center">
        <div className="flex gap-2 items-center text-red-600 text-xl font-semibold">
          <MdErrorOutline className="text-2xl" />
          {error}
        </div>
        <button
          onClick={fetchJobApplications}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Applications for: {job?.title || `Job #${jobId}`}
        </h1>

        {job && (
          <div className="text-gray-600">
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            {/* <p>
              <strong>Posted:</strong>{" "}
              {new Date(job.postedOn || job.createdAt).toLocaleDateString()}
            </p> */}
            <p>
              <strong>Total Applications:</strong> {applications.length}
            </p>
          </div>
        )}
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Applications ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No applications received yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser className="text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {application.candidateName}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {application.candidateEmail}
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        {application.candidatePhone}
                      </div> */}
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Applied on:{" "}
                      {new Date(
                        application.applicationDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <select
                      value={application.status}
                      onChange={(e) =>
                        handleStatusChange(application.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-sm border ${
                        application.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : application.status === "SHORTLISTED"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : application.status === "HIRED"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-red-100 text-red-800 border-red-300"
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="HIRED">Hired</option>
                    </select>

                    {application.hasResume ? (
                      <button
                        onClick={() => handleDownloadResume(application.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm flex items-center gap-1"
                      >
                        <FaEye className="text-xs" />
                        Download Resume
                      </button>
                    ) : (
                      <button
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        disabled
                      >
                        <FaEye className="text-xs" />
                        No Resume
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
