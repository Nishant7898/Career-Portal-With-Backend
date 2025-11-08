import React, { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { IoIosAttach } from "react-icons/io";
import { IoMdSave } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/profileService";
import { fileService } from "../services/fileService";

const EditProfile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    status: "",
    gender: "",
    dob: "",
    education: "",
    workExperience: "",
    skills: "",
    resumeFilePath: "",
    photoFilePath: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  // Load current profile data
  useEffect(() => {
    if (!isAuthenticated || !isJobSeeker()) {
      navigate("/login");
      return;
    }
    
    fetchCurrentProfile();
  }, [isAuthenticated, isJobSeeker, navigate]);

  const fetchCurrentProfile = async () => {
    setLoading(true);
    try {
      const result = await profileService.getJobSeekerProfile();
      if (result.success) {
        const profile = result.data;
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          mobile: profile.mobile || "",
          status: profile.status || "",
          gender: profile.gender || "",
          dob: profile.dob || "",
          education: profile.education || "",
          workExperience: profile.workExperience || "",
          skills: profile.skills || "",
          resumeFilePath: profile.resumeFilePath || "",
          photoFilePath: profile.photoFilePath || "",
        });
        setError("");
      } else {
        setError("Failed to load profile data");
      }
    } catch (error) {
      setError("Error loading profile data");
    } finally {
      setLoading(false);
    }
  };

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please upload a valid PDF file.");
      e.target.value = "";
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png")) {
      setPhotoFile(file);
    } else {
      alert("Please upload only .jpg, .jpeg, or .png image!");
      e.target.value = "";
    }
  };

  // Clear resume
  const handleClearResume = () => {
    setFormData((prev) => ({ ...prev, resumeFilePath: "" }));
    setResumeFile(null);
  };

  // Clear photo
  const handleClearPhoto = () => {
    setFormData((prev) => ({ ...prev, photoFilePath: "" }));
    setPhotoFile(null);
  };

  // Save updates
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let updatedFormData = { ...formData };

      // Upload new resume if selected
      if (resumeFile) {
        const resumeResult = await fileService.uploadResume(resumeFile);
        if (resumeResult.success) {
          updatedFormData.resumeFilePath = resumeResult.data.filePath;
        } else {
          setError(`Resume upload failed: ${resumeResult.message}`);
          setSaving(false);
          return;
        }
      }

      // Upload new photo if selected
      if (photoFile) {
        const photoResult = await fileService.uploadPhoto(photoFile);
        if (photoResult.success) {
          updatedFormData.photoFilePath = photoResult.data.filePath;
        } else {
          setError(`Photo upload failed: ${photoResult.message}`);
          setSaving(false);
          return;
        }
      }

      // Update profile
      const result = await profileService.updateJobSeekerProfile(updatedFormData);
      if (result.success) {
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-xl">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <form
        onSubmit={handleSave}
        className="bg-white shadow-2xl rounded-xl p-10 w-[800px]"
      >
        <h1 className="text-3xl flex items-center justify-center gap-2 font-bold text-center text-blue-700 ">
          <FaUserEdit /> Update Your Profile
        </h1>
        <p className="text-center mb-8 mt-2 opacity-50">
          Please fill out the information below carefully.
        </p>

        {/* -------- PERSONAL INFORMATION -------- */}
        <h2 className="text-xl flex text-blue-500 items-center gap-2 font-semibold  mb-4 border-b pb-2">
          <FaUser className="text-blue-500" /> Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Mobile *</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="FRESHER">Fresher</option>
              <option value="EXPERIENCED">Experienced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* -------- PROFESSIONAL INFORMATION -------- */}
        <h2 className="text-xl items-center  font-semibold text-blue-700 flex gap-2 mb-4 border-b pb-2">
          <PiStudentFill /> Professional Information
        </h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold">Education *</label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full h-[120px] border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              placeholder="Enter your educational background"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Work Experience
            </label>
            <textarea
              name="workExperience"
              value={formData.workExperience}
              onChange={handleChange}
              className="w-full h-[120px] border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              placeholder="Enter your work experience"
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold">Skills *</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full h-[150px] border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-blue-500"
              placeholder="Enter your skills (e.g., Java, React, Python)"
              required
            ></textarea>
          </div>
        </div>

        {/* -------- ATTACHMENTS -------- */}
        <h2 className="text-xl flex items-center gap-2 font-semibold text-blue-700 mb-4 border-b pb-2">
          <IoIosAttach /> Attachments
        </h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Resume */}
          <div>
            <label className="block text-sm font-semibold mb-1">Resume</label>

            {/* Current Resume Section (on top) */}
            {formData.resumeFilePath ? (
              <div className="flex items-center gap-3 mb-3">
                <a
                  href={`http://localhost:8080/uploads/${formData.resumeFilePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Current Resume
                </a>
                <button
                  type="button"
                  onClick={handleClearResume}
                  className="text-red-500 text-sm hover:underline"
                >
                  Clear
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-2">No resume uploaded</p>
            )}

            {/* Choose File Button */}
            <div className="mt-1">
              <button
                type="button"
                onClick={() => document.getElementById("resumeUpload").click()}
                className="bg-gray-200 border px-3 py-1 rounded-md hover:bg-gray-300"
              >
                Choose New File
              </button>
              <input
                type="file"
                id="resumeUpload"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleResumeUpload}
              />
              <span className="ml-3 text-sm text-gray-600">
                {resumeFile ? resumeFile.name : "No new file selected"}
              </span>
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-semibold mb-1">Photo</label>

            {/* Current Photo Section (on top) */}
            {formData.photoFilePath ? (
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={`http://localhost:8080/uploads/${formData.photoFilePath}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="text-red-500 text-sm hover:underline"
                >
                  Clear
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-2">No photo uploaded</p>
            )}

            {/* New Photo Preview */}
            {photoFile && (
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={URL.createObjectURL(photoFile)}
                  alt="New Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
                />
                <span className="text-green-600 text-sm">New photo selected</span>
              </div>
            )}

            {/* Choose File Button */}
            <div>
              <button
                type="button"
                onClick={() => document.getElementById("photoUpload").click()}
                className="bg-gray-200 border px-3 py-1 rounded-md hover:bg-gray-300"
              >
                Choose New File
              </button>
              <input
                type="file"
                id="photoUpload"
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
              <span className="ml-3 text-sm text-gray-600">
                {photoFile ? photoFile.name : "No new file selected"}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* -------- ACTION BUTTONS -------- */}
        <div className="flex justify-between gap-6 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="text-black border border-gray-400 flex items-center gap-2 px-8 py-2 rounded-md hover:bg-gray-500 transition disabled:opacity-50"
          >
            <FaArrowLeft /> Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-700 flex items-center gap-2 text-white px-8 py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
          >
            <IoMdSave /> {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
