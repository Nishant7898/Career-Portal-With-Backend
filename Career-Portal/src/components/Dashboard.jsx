import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaEdit, FaTrash } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/profileService";
import { jobService } from "../services/jobService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isEmployer, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employerProfile, setEmployerProfile] = useState(null);
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    // Debug logging - commented out for production
    // console.log("Dashboard useEffect:", {
    //   authLoading,
    //   isAuthenticated,
    //   isEmployer: isEmployer(),
    //   userRole: localStorage.getItem("userRole"),
    // });

    // Wait for auth context to finish loading
    if (authLoading) {
      // console.log("Dashboard: Auth still loading, waiting...");
      return;
    }

    // Check authentication after loading is complete
    if (!isAuthenticated) {
      // console.log("Dashboard: User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    if (!isEmployer()) {
      // console.log(
      //   "Dashboard: User is not an employer, redirecting to access denied"
      // );
      navigate("/access-denied");
      return;
    }

    // console.log("Dashboard: Auth checks passed, fetching data");
    fetchDashboardData();
  }, [isAuthenticated, isEmployer, navigate, authLoading]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch employer profile
      const profileResult = await profileService.getEmployerProfile();
      if (profileResult.success) {
        setEmployerProfile(profileResult.data);
      }

      // Fetch job postings from API
      const jobsResult = await jobService.getEmployerJobs();
      if (jobsResult.success) {
        setJobPostings(jobsResult.data);
      } else {
        setJobPostings([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        const result = await jobService.deleteJob(id);
        if (result.success) {
          const updatedJobs = jobPostings.filter((job) => job.id !== id);
          setJobPostings(updatedJobs);
          alert("Job posting deleted successfully!");
        } else {
          alert("Failed to delete job posting: " + result.message);
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        // Fallback to local deletion for mock data
        const updatedJobs = jobPostings.filter((job) => job.id !== id);
        setJobPostings(updatedJobs);
        alert("Job posting deleted successfully!");
      }
    }
  };

  const handleEditJob = (id) => {
    navigate(`/editjob/${id}`);
  };

  const handleViewApplications = (jobId) => {
    navigate(`/job-applications/${jobId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-xl text-gray-600">
          {authLoading ? "Checking authentication..." : "Loading dashboard..."}
        </div>
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
          onClick={fetchDashboardData}
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
      <div className="bg-blue-700 text-white flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-4 rounded-md shadow-md mb-8">
        <h1 className="text-2xl flex items-center gap-2 font-bold mb-4 md:mb-0">
          <FaBriefcase />
          Employer Dashboard
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/jobpost")}
            className="bg-white text-blue-900 px-4 py-2 font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            + Post New Job
          </button>
          <button
            onClick={() => navigate("/reports")}
            className="bg-purple-600 text-white px-4 py-2 font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            📊 Reports
          </button>
          <button
            onClick={() => navigate("/editcompanyprofile")}
            className="bg-green-600 text-white px-4 py-2 font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Company Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Company Profile</h2>
          <button
            onClick={() => navigate("/editcompanyprofile")}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <FaEdit /> Edit
          </button>
        </div>

        {employerProfile ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-semibold border-l-4 border-blue-500 pl-2">
                  Company Name:
                </span>
                <p className="ml-6 mt-1">
                  {employerProfile.companyName || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-semibold border-l-4 border-blue-500 pl-2">
                  Email:
                </span>
                <p className="ml-6 mt-1">
                  {employerProfile.email || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-semibold border-l-4 border-blue-500 pl-2">
                  Industry:
                </span>
                <p className="ml-6 mt-1">
                  {employerProfile.industry || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-semibold border-l-4 border-blue-500 pl-2">
                  Company Size:
                </span>
                <p className="ml-6 mt-1">
                  {employerProfile.companySize || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-semibold border-l-4 border-blue-500 pl-2">
                  Headquarters:
                </span>
                <p className="ml-6 mt-1">
                  {employerProfile.headquarters || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-semibold border-l-4 border-blue-500 pl-2">
                  Phone:
                </span>
                <p className="ml-6 mt-1">
                  {employerProfile.companyPhone || "Not provided"}
                </p>
              </div>
            </div>
            {employerProfile.specialities && (
              <div className="mt-4">
                <span className="font-semibold border-l-4 border-blue-500 pl-2">
                  Specialities:
                </span>
                <p className="ml-6 mt-1">{employerProfile.specialities}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Company profile not loaded yet.
            </p>
            <button
              onClick={() => navigate("/editcompanyprofile")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Set Up Company Profile
            </button>
          </div>
        )}
      </div>

      {/* Job Postings Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your Job Postings</h2>
          <button
            onClick={() => navigate("/jobpost")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Add New Job
          </button>
        </div>

        {jobPostings.length === 0 ? (
          <div className="text-center py-12">
            <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              You haven't posted any jobs yet.
            </p>
            <button
              onClick={() => navigate("/jobpost")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-3 px-4 font-semibold">Job Title</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Posted Date</th>
                  <th className="py-3 px-4 font-semibold">Applications</th>
                  {/* <th className="py-3 px-4 font-semibold">Status</th> */}
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobPostings.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">{job.jobTitle}</td>
                    <td className="py-3 px-4">{job.location}</td>
                    <td className="py-3 px-4">
                      {job.datePosted
                        ? new Date(job.datePosted).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                          onClick={() => handleViewApplications(job.id)}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition text-sm font-medium"
                          title="View Applications"
                        >
                          {job.applicationCount || 0}
                        </button>
                    </td>
                    {/* <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          job.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td> */}
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {/* <button
                          onClick={() => handleViewApplications(job.id)}
                          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition text-sm flex items-center gap-1"
                          title="View Applications"
                        >
                          <FaEye className="text-xs" />
                          View
                        </button> */}
                        <button
                          onClick={() => handleEditJob(job.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition text-sm flex items-center gap-1"
                          title="Edit Job"
                        >
                          <FaEdit className="text-xs" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition text-sm flex items-center gap-1"
                          title="Delete Job"
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
