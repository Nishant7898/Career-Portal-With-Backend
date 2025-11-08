import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiFillFileExcel } from "react-icons/ai";
import { MdErrorOutline } from "react-icons/md";
import { jobSeekerService } from "../services/jobSeekerService";
import { useAuth } from "../context/AuthContext";

const Report = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isEmployer, loading: authLoading } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(10);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    skills: "",
    status: "",
  });

  // Check authentication and role before loading data
  useEffect(() => {
    // Debug logging - commented out for production
    // console.log("Report useEffect:", {
    //   authLoading,
    //   isAuthenticated,
    //   isEmployer: isEmployer(),
    //   userRole: localStorage.getItem("userRole"),
    // });

    // Wait for auth context to finish loading
    if (authLoading) {
      // console.log("Report: Auth still loading, waiting...");
      return;
    }

    // Check authentication after loading is complete
    if (!isAuthenticated) {
      // console.log("Report: User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    if (!isEmployer()) {
      // console.log(
      //   "Report: User is not an employer, redirecting to access denied"
      // );
      navigate("/access-denied");
      return;
    }

    // console.log("Report: Auth checks passed, fetching candidates");
    fetchCandidates();
  }, [isAuthenticated, isEmployer, navigate, authLoading]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await jobSeekerService.getAllJobSeekers();

      if (result.success) {
        // console.log("Candidates fetched:", result.data);
        setCandidates(result.data);
        setFilteredCandidates(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      // console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    let filtered = [...candidates];

    // Filter by name
    if (filters.name.trim()) {
      filtered = filtered.filter((candidate) =>
        candidate.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filter by email
    if (filters.email.trim()) {
      filtered = filtered.filter((candidate) =>
        candidate.email?.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    // Filter by skills
    if (filters.skills.trim()) {
      filtered = filtered.filter((candidate) =>
        candidate.skills?.toLowerCase().includes(filters.skills.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status.trim()) {
      filtered = filtered.filter((candidate) =>
        candidate.status?.toLowerCase().includes(filters.status.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      email: "",
      skills: "",
      status: "",
    });
    setFilteredCandidates(candidates);
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = [
      "Name",
      "Email",
      "Mobile",
      "Gender",
      "Status",
      "Education",
      "Work Experience",
      "Skills",
      "Date of Birth",
      "Profile Created",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredCandidates.map((candidate) =>
        [
          `"${candidate.name || ""}"`,
          `"${candidate.email || ""}"`,
          `"${candidate.mobile || ""}"`,
          `"${candidate.gender || ""}"`,
          `"${candidate.status || ""}"`,
          `"${candidate.education || ""}"`,
          `"${candidate.workExperience || ""}"`,
          `"${candidate.skills || ""}"`,
          `"${candidate.dob || ""}"`,
          `"${
            candidate.createdAt
              ? new Date(candidate.createdAt).toLocaleDateString()
              : ""
          }"`,
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `candidates_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-200">
        <div className="text-xl text-gray-600">
          {authLoading ? "Checking authentication..." : "Loading candidates..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center bg-gray-200">
        <div className="flex gap-2 items-center text-red-600 text-xl font-semibold">
          <MdErrorOutline className="text-2xl" />
          {error}
        </div>
        <button
          onClick={fetchCandidates}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen items-center justify-center flex bg-gray-200">
      <div className="h-full pb-20 mt-[50px] flex pt-4 text-center rounded-xl flex-col items-center w-[90vw] shadow-2xl p-2 bg-white">
        <h2 className="text-4xl flex gap-2 text-center items-center font-bold text-blue-500">
          <FaUsers /> Candidate Profiles ({filteredCandidates.length})
        </h2>
        <p className="mt-2 opacity-50">
          Search and export candidate data easily with filters below.
        </p>

        <div className="flex items-center space-x-8 mt-12 flex-wrap justify-center gap-4">
          <div className="flex flex-col items-center gap-2 text-center justify-center">
            <p className="font-semibold flex items-center gap-2">
              <FaUsers />
              Name
            </p>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="border p-2 border-gray-400 rounded-md w-40"
              placeholder="Search by name"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center justify-center">
            <p className="font-semibold flex items-center gap-2">📧 Email</p>
            <input
              type="text"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="border p-2 border-gray-400 rounded-md w-40"
              placeholder="Search by email"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center justify-center">
            <p className="font-semibold flex items-center gap-2">🛠️ Skills</p>
            <input
              type="text"
              value={filters.skills}
              onChange={(e) => handleFilterChange("skills", e.target.value)}
              className="border p-2 border-gray-400 rounded-md w-40"
              placeholder="Search by skills"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center justify-center">
            <p className="font-semibold flex items-center gap-2">💼 Status</p>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border p-2 border-gray-400 rounded-md w-40"
            >
              <option value="">All Status</option>
              <option value="FRESHER">Fresher</option>
              <option value="EXPERIENCED">Experienced</option>
            </select>
          </div>
        </div>

        <div className="mt-8 items-center space-x-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleSearch}
            className="border px-6 flex items-center font-semibold gap-2 hover:bg-blue-600 cursor-pointer border-blue-600 rounded-md bg-blue-500 p-2 text-white transition-colors"
          >
            <FaSearch /> Search
          </button>
          <button
            onClick={handleClearFilters}
            className="border px-6 flex items-center font-semibold gap-2 hover:bg-gray-600 cursor-pointer border-gray-600 rounded-md bg-gray-500 p-2 text-white transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={exportToExcel}
            className="border text-green-800 hover:text-white hover:bg-green-800 cursor-pointer flex items-center gap-2 font-semibold p-2 rounded-md border-green-600 transition-colors"
            disabled={filteredCandidates.length === 0}
          >
            <AiFillFileExcel />
            Export CSV ({filteredCandidates.length})
          </button>
        </div>

        <div className="mt-12 w-full overflow-x-auto">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No candidates found</p>
              <p className="mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <table className="w-full border border-gray-400 text-sm">
              <thead>
                <tr className="bg-blue-600 text-white border border-gray-400">
                  <th className="p-3 border border-gray-400 font-semibold">
                    Name
                  </th>
                  <th className="p-3 border border-gray-400 font-semibold">
                    Email
                  </th>
                  <th className="p-3 border border-gray-400 font-semibold">
                    Mobile
                  </th>
                  <th className="p-3 border border-gray-400 font-semibold">
                    Gender
                  </th>
                  <th className="p-3 border border-gray-400 font-semibold">
                    Status
                  </th>
                  <th className="p-3 border border-gray-400 font-semibold">
                    Education
                  </th>
                  <th className="p-3 border border-gray-400 font-semibold">
                    Skills
                  </th>
                  <th className="p-3 border border-gray-400 font-semibold">
                    Profile Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((candidate, index) => (
                  <tr
                    key={candidate.id || index}
                    className="text-center hover:bg-gray-50"
                  >
                    <td className="border border-gray-400 p-2 font-medium">
                      {candidate.name || "N/A"}
                    </td>
                    <td className="border border-gray-400 p-2 text-blue-600">
                      {candidate.email || "N/A"}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {candidate.mobile || "N/A"}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {candidate.gender || "N/A"}
                    </td>
                    <td className="border border-gray-400 p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          candidate.status === "EXPERIENCED"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {candidate.status || "N/A"}
                      </span>
                    </td>
                    <td
                      className="border border-gray-400 p-2 max-w-xs truncate"
                      title={candidate.education}
                    >
                      {candidate.education || "N/A"}
                    </td>
                    <td
                      className="border border-gray-400 p-2 max-w-xs truncate"
                      title={candidate.skills}
                    >
                      {candidate.skills || "N/A"}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {candidate.createdAt
                        ? new Date(candidate.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {filteredCandidates.length > candidatesPerPage && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>

              <span className="ml-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({filteredCandidates.length}{" "}
                candidates)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
