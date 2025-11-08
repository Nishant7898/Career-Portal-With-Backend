import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBriefcase, FaArrowLeft } from "react-icons/fa";
import { IoMdSave } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/jobService";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isEmployer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobPosition: "",
    description: "",
    requiredSkills: "",
    location: "",
    experienceLevel: "",
    functionalArea: "",
    industry: "",
    salaryDetails: "",
    isActive: true,
  });

  useEffect(() => {
    if (!isAuthenticated || !isEmployer()) {
      navigate("/login");
      return;
    }
    
    fetchJobDetails();
  }, [isAuthenticated, isEmployer, navigate, jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const result = await jobService.getJobById(jobId);
      if (result.success) {
        const job = result.data;
        setFormData({
          jobTitle: job.jobTitle || "",
          jobPosition: job.jobPosition || "",
          description: job.description || "",
          requiredSkills: job.requiredSkills || "",
          location: job.location || "",
          experienceLevel: job.experienceLevel || "",
          functionalArea: job.functionalArea || "",
          industry: job.industry || "",
          salaryDetails: job.salaryDetails || "",
          isActive: job.isActive !== false,
        });
        setError("");
      } else {
        setError("Failed to load job details");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError("Error loading job details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await jobService.updateJob(jobId, formData);
      
      if (result.success) {
        setSuccess("Job posting updated successfully!");
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(result.message || "Failed to update job posting");
        console.error("Update failed:", result);
      }
    } catch (error) {
      console.error("Error updating job posting:", error);
      setError("An error occurred while updating the job posting: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (error && !formData.jobTitle) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col gap-4 justify-center items-center">
        <div className="flex gap-2 items-center text-red-600 text-xl font-semibold">
          {error}
        </div>
        <button
          onClick={handleCancel}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-4xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl flex items-center gap-2 text-blue-700 font-bold">
            <FaBriefcase /> Edit Job Posting
          </h1>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Form fields in grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Job Position */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Job Position
            </label>
            <input
              type="text"
              name="jobPosition"
              value={formData.jobPosition}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
            >
              <option value="">Select Experience Level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          {/* Functional Area */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Functional Area
            </label>
            <input
              type="text"
              name="functionalArea"
              value={formData.functionalArea}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              placeholder="e.g., Software Development, Marketing"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              placeholder="e.g., Technology, Healthcare"
            />
          </div>

          {/* Salary Details */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Salary Details
            </label>
            <input
              type="text"
              name="salaryDetails"
              value={formData.salaryDetails}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              placeholder="e.g., $80,000 - $120,000 per year"
            />
          </div>

          {/* Required Skills */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Required Skills
            </label>
            <textarea
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              className="w-full h-[100px] border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              placeholder="List the key skills required for this position"
            ></textarea>
          </div>

          {/* Job Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-[150px] border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              placeholder="Provide a detailed description of the job role and responsibilities"
              required
            ></textarea>
          </div>

          {/* Job Status */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold">Job is Active</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Uncheck to make this job posting inactive (hidden from job seekers)
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="border border-gray-400 flex items-center gap-2 px-8 py-2 rounded-md hover:bg-gray-500 hover:text-white transition disabled:opacity-50"
          >
            <FaArrowLeft /> Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-700 text-white flex items-center gap-2 px-8 py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
          >
            <IoMdSave /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;