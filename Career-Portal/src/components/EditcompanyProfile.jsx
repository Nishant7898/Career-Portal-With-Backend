import React, { useState, useEffect } from "react";
import { FaBuilding } from "react-icons/fa";
import { IoMdSave } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/profileService";

const EditCompanyProfile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isEmployer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    industry: "",
    companySize: "",
    headquarters: "",
    companyType: "",
    founded: "",
    specialities: "",
    companyAddress: "",
    companyPhone: "",
  });

  // Load current employer profile data
  useEffect(() => {
    if (!isAuthenticated || !isEmployer()) {
      navigate("/login");
      return;
    }
    
    fetchCurrentProfile();
  }, [isAuthenticated, isEmployer, navigate]);

  const fetchCurrentProfile = async () => {
    setLoading(true);
    try {
      const result = await profileService.getEmployerProfile();
      if (result.success) {
        const profile = result.data;
        setFormData({
          companyName: profile.companyName || "",
          email: profile.email || "",
          industry: profile.industry || "",
          companySize: profile.companySize || "",
          headquarters: profile.headquarters || "",
          companyType: profile.companyType || "",
          founded: profile.founded || "",
          specialities: profile.specialities || "",
          companyAddress: profile.companyAddress || "",
          companyPhone: profile.companyPhone || "",
        });
        setError("");
      } else {
        setError("Failed to load company profile data");
      }
    } catch (error) {
      setError("Error loading company profile data");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  // Save updates
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const result = await profileService.updateEmployerProfile(formData);
      
      if (result.success) {
        setSuccess("Company profile updated successfully!");
        setError("");
        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setError(result.message || "Failed to update company profile");
        setSuccess("");
        console.error("Update failed:", result);
      }
    } catch (error) {
      console.error("Error updating company profile:", error);
      setError("An error occurred while updating company profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancel & go back
  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-xl">Loading company profile data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <form
        onSubmit={handleSave}
        className="bg-white shadow-2xl rounded-xl p-10 w-[700px]"
      >
        <h1 className="text-3xl flex items-center justify-center gap-2 text-white py-8 rounded-t-4xl font-bold text-center bg-blue-700 mb-6">
          <FaBuilding /> Edit Company Profile
        </h1>

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
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Basic company fields */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Industry *
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Company Size
            </label>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
            >
              <option value="">Select Company Size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Headquarters
            </label>
            <input
              type="text"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Company Type
            </label>
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
            >
              <option value="">Select Company Type</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="STARTUP">Startup</option>
              <option value="NON_PROFIT">Non-Profit</option>
              <option value="GOVERNMENT">Government</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="LLC">LLC</option>
              <option value="CORPORATION">Corporation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Founded Year
            </label>
            <input
              type="number"
              name="founded"
              value={formData.founded}
              onChange={handleChange}
              min="1800"
              max="2030"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Company Phone
            </label>
            <input
              type="tel"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              placeholder="e.g., +1-555-123-4567"
            />
          </div>

          {/* Textareas */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Specialities
            </label>
            <textarea
              name="specialities"
              value={formData.specialities}
              onChange={handleChange}
              className="w-full h-[100px] border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              placeholder="e.g., Software Development, Cloud Solutions, AI/ML"
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Company Address
            </label>
            <textarea
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className="w-full h-[100px] border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600"
              placeholder="Full company address"
            ></textarea>
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

export default EditCompanyProfile;
