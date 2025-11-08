import { useState, useEffect } from "react";
import { FaChartBar } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa6";
import { FaIndustry } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { AiFillFileExcel } from "react-icons/ai";
import { MdOutlineWatchLater } from "react-icons/md";
import { FaSearch, FaEye } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { companyService } from "../services/companyService";

const CompanySection = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(10);
  const [filters, setFilters] = useState({
    companyName: "",
    industry: "",
    foundedAfter: "",
    profileCreateAfter: ""
  });

  // Fetch all companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await companyService.getAllCompanies();
      
      if (result.success) {
        // console.log('Companies fetched:', result.data);
        setCompanies(result.data);
        setFilteredCompanies(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      // console.error('Error fetching companies:', error);
      setError('Failed to fetch companies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    let filtered = [...companies];

    // Filter by company name
    if (filters.companyName.trim()) {
      filtered = filtered.filter(company =>
        company.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    }

    // Filter by industry
    if (filters.industry.trim()) {
      filtered = filtered.filter(company =>
        company.industry?.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }

    // Filter by founded after year
    if (filters.foundedAfter.trim()) {
      const year = parseInt(filters.foundedAfter);
      if (!isNaN(year)) {
        filtered = filtered.filter(company =>
          company.founded && company.founded >= year
        );
      }
    }

    // Filter by profile creation date
    if (filters.profileCreateAfter) {
      const filterDate = new Date(filters.profileCreateAfter);
      filtered = filtered.filter(company => {
        if (company.createdAt) {
          const companyDate = new Date(company.createdAt);
          return companyDate >= filterDate;
        }
        return false;
      });
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleClearFilters = () => {
    setFilters({
      companyName: "",
      industry: "",
      foundedAfter: "",
      profileCreateAfter: ""
    });
    setFilteredCompanies(companies);
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = [
      'Company Name', 'Email', 'Phone', 'Industry', 'Size', 
      'Headquarters', 'Type', 'Founded', 'Specialities', 'Profile Created'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredCompanies.map(company => [
        `"${company.companyName || ''}"`,
        `"${company.email || ''}"`,
        `"${company.companyPhone || ''}"`,
        `"${company.industry || ''}"`,
        `"${company.companySize || ''}"`,
        `"${company.headquarters || ''}"`,
        `"${company.companyType || ''}"`,
        `"${company.founded || ''}"`,
        `"${company.specialities || ''}"`,
        `"${company.createdAt ? new Date(company.createdAt).toLocaleDateString() : ''}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `companies_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };



  // Pagination logic
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-200">
        <div className="text-xl text-gray-600">Loading companies...</div>
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
          onClick={fetchCompanies}
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
          <FaChartBar /> Company Profiles ({filteredCompanies.length})
        </h2>
        <p className="mt-2 opacity-50">
          Search and export company data easily with filters below.
        </p>

        <div className="flex items-center space-x-8 mt-12 flex-wrap justify-center gap-4">
          <div className="flex flex-col items-center gap-2 text-center justify-center">
            <p className="font-semibold flex items-center gap-2">
              <FaBuilding />
              Company Name
            </p>
            <input 
              type="text" 
              value={filters.companyName}
              onChange={(e) => handleFilterChange('companyName', e.target.value)}
              className="border p-2 border-gray-400 rounded-md w-40" 
              placeholder="Search by name"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center justify-center">
            <p className="font-semibold flex items-center gap-2">
              <FaIndustry />
              Industry
            </p>
            <input 
              type="text" 
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="border p-2 border-gray-400 rounded-md w-40" 
              placeholder="Search by industry"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center justify-center">
            <p className="font-semibold flex items-center gap-2">
              <SlCalender />
              Founded After (year)
            </p>
            <input 
              type="number" 
              value={filters.foundedAfter}
              onChange={(e) => handleFilterChange('foundedAfter', e.target.value)}
              className="border p-2 border-gray-400 rounded-md w-40" 
              placeholder="e.g. 2010"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center justify-center">
            <p className="font-semibold flex items-center gap-2">
              <MdOutlineWatchLater />
              Profile Created After
            </p>
            <input
              type="date"
              value={filters.profileCreateAfter}
              onChange={(e) => handleFilterChange('profileCreateAfter', e.target.value)}
              className="border border-gray-400 p-2 rounded-md w-40"
            />
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
            disabled={filteredCompanies.length === 0}
          >
            <AiFillFileExcel />
            Export CSV ({filteredCompanies.length})
          </button>
        </div>

        <div className="mt-12 w-full overflow-x-auto">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No companies found</p>
              <p className="mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <table className="w-full border border-gray-400 text-sm">
              <thead>
                <tr className="bg-blue-600 text-white border border-gray-400">
                  <th className="p-3 border border-gray-400 font-semibold">Company</th>
                  <th className="p-3 border border-gray-400 font-semibold">Email</th>
                  <th className="p-3 border border-gray-400 font-semibold">Phone</th>
                  <th className="p-3 border border-gray-400 font-semibold">Industry</th>
                  <th className="p-3 border border-gray-400 font-semibold">Size</th>
                  <th className="p-3 border border-gray-400 font-semibold">Headquarters</th>
                  <th className="p-3 border border-gray-400 font-semibold">Type</th>
                  <th className="p-3 border border-gray-400 font-semibold">Founded</th>
                  <th className="p-3 border border-gray-400 font-semibold">Specialities</th>
                  <th className="p-3 border border-gray-400 font-semibold">Profile Created</th>
                </tr>
              </thead>
              <tbody>
                {currentCompanies.map((company, index) => (
                  <tr key={company.id || index} className="text-center hover:bg-gray-50">
                    <td className="border border-gray-400 p-2 font-medium">
                      <span className="font-medium">
                        {company.companyName || 'N/A'}
                      </span>
                    </td>
                    <td className="border border-gray-400 p-2 text-blue-600">
                      {company.email || 'N/A'}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {company.companyPhone || 'N/A'}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {company.industry || 'N/A'}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {company.companySize || 'N/A'}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {company.headquarters || 'N/A'}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {company.companyType || 'N/A'}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {company.founded || 'N/A'}
                    </td>
                    <td className="border border-gray-400 p-2 max-w-xs truncate" title={company.specialities}>
                      {company.specialities || 'N/A'}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {filteredCompanies.length > companiesPerPage && (
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
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
                Page {currentPage} of {totalPages} ({filteredCompanies.length} companies)
              </span>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default CompanySection;
