import React, { useState, useEffect } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { FaMoneyCheck } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jobService } from "../services/jobService";
import { useAuth } from "../context/AuthContext";

const Jobsection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    location: "",
    experienceLevel: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const filters = {
      keyword: searchFilters.keyword,
      location: searchFilters.location,
      experience: searchFilters.experienceLevel
    };
    
    const result = await jobService.getAllJobs(filters);
    
    if (result.success) {
      setJobs(result.data);
      setError("");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleClearSearch = () => {
    setSearchFilters({
      keyword: "",
      location: "",
      experienceLevel: "",
    });
    // Fetch all jobs after clearing filters
    setTimeout(() => {
      fetchJobs();
    }, 100);
  };

  const handleApplyClick = (jobId, jobTitle) => {
    if (!isAuthenticated) {
      alert("You are not logged in! Please log in to apply for jobs.");
      navigate("/login");
      return;
    }

    if (!isJobSeeker()) {
      alert("Only job seekers can apply for jobs.");
      return;
    }

    // Navigate to submit page with job ID and title
    navigate(`/submit/${jobId}`, { state: { jobTitle } });
  };

  const handleFilterChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl text-blue-500 font-bold">Available Job Openings</h2>
          <p className="opacity-50 mt-3">
            Explore the Latest Opportunities And Apply to Your Position That Suit Your Skills.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              name="keyword"
              placeholder="Job title or keywords"
              value={searchFilters.keyword}
              onChange={handleFilterChange}
              onKeyPress={handleKeyPress}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={searchFilters.location}
              onChange={handleFilterChange}
              onKeyPress={handleKeyPress}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              name="experienceLevel"
              value={searchFilters.experienceLevel}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Experience Level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 flex-1"
              >
                <FaSearch /> Search
              </button>
              <button
                onClick={handleClearSearch}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center justify-center"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-lg">Loading jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-4xl mx-auto">
            {error}
          </div>
        )}

        {/* Jobs List */}
        {!loading && jobs.length === 0 && !error && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No jobs found. Try adjusting your search criteria.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {jobs.map((job, index) => (
            <div key={job.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-blue-600 mb-3">{job.jobTitle}</h3>
              
              {job.jobPosition && (
                <p className="text-gray-600 mb-2">{job.jobPosition}</p>
              )}
              
              <div className="space-y-2 mb-4">
                <p className="flex items-center gap-2 text-sm">
                  <IoLocationOutline className="text-blue-500" />
                  <span className="font-semibold">Location:</span> {job.location}
                </p>
                
                {job.salaryDetails && (
                  <p className="flex items-center gap-2 text-sm">
                    <FaMoneyCheck className="text-green-500" />
                    <span className="font-semibold">Salary:</span> {job.salaryDetails}
                  </p>
                )}
                
                {job.experienceLevel && (
                  <p className="flex items-center gap-2 text-sm">
                    <FaBuilding className="text-purple-500" />
                    <span className="font-semibold">Experience:</span> {job.experienceLevel}
                  </p>
                )}
                
                {job.datePosted && (
                  <p className="flex items-center gap-2 text-sm">
                    <SlCalender className="text-orange-500" />
                    <span className="font-semibold">Posted:</span> {new Date(job.datePosted).toLocaleDateString()}
                  </p>
                )}
              </div>

              {job.description && (
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {job.description.length > 150 
                    ? `${job.description.substring(0, 150)}...` 
                    : job.description}
                </p>
              )}

              {job.requiredSkills && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Required Skills:</p>
                  <p className="text-sm text-gray-700">{job.requiredSkills}</p>
                </div>
              )}

              <button
                onClick={() => handleApplyClick(job.id, job.jobTitle)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CiLocationArrow1 /> Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobsection;
