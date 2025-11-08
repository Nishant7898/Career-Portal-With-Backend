import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiUserAdd } from "react-icons/hi";
import { authService } from "../services/authService";

const RegisterAsCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industry: "",
    companySize: "",
    headquarters: "",
    companyType: "",
    founded: "",
    specialities: "",
    companyAddress: "",
    companyPhone: "",
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone) => {
    // Basic phone number validation
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Real-time validation
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          errors.email = "";
        }
        break;
      case 'password':
        if (value && !validatePassword(value)) {
          errors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
        } else {
          errors.password = "";
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          errors.confirmPassword = "Passwords do not match";
        } else {
          errors.confirmPassword = "";
        }
        break;
      case 'companyPhone':
        if (value && !validatePhone(value)) {
          errors.companyPhone = "Please enter a valid phone number";
        } else {
          errors.companyPhone = "";
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.companyName || !formData.industry) {
      setError("Please fill all required fields!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Prepare registration data
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        headquarters: formData.headquarters,
        companyType: formData.companyType,
        founded: formData.founded ? parseInt(formData.founded) : null,
        specialities: formData.specialities,
        companyAddress: formData.companyAddress,
        companyPhone: formData.companyPhone,
      };

      // Register employer
      const result = await authService.registerEmployer(registrationData);
      
      if (result.success) {
        alert("Company registered successfully! Please login to continue.");
        navigate("/login");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mb-10  scroll-smooth flex items-center justify-center">
      <div className="h-full mt-10 shadow-2xl rounded-2xl flex text-center items-center flex-col w-[500px] bg-white border border-white">
        <h1 className="text-2xl mt-6 flex gap-2 text-center justify-center items-center">
          <HiUserAdd className="text-blue-500 text-3xl" /> Register As Company
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-[50px] space-y-6">
            <div className="flex flex-col text-start space-y-3">
              <p>Username*</p>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Email*</p>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Password*</p>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Confirm Password*</p>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Company Name*</p>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                type="text"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Industry*</p>
              <input
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                type="text"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Company Size</p>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              >
                <option value="">Select Company Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Headquarters</p>
              <input
                name="headquarters"
                value={formData.headquarters}
                onChange={handleChange}
                type="text"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Company Type</p>
              <select
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
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
            <div className="flex flex-col text-start space-y-3">
              <p>Founded</p>
              <input
                name="founded"
                value={formData.founded}
                onChange={handleChange}
                type="number"
                min="1800"
                max="2030"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Specialities</p>
              <textarea
                name="specialities"
                value={formData.specialities}
                onChange={handleChange}
                className="w-[400px] h-[100px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
                placeholder="e.g., Software Development, Cloud Solutions, AI/ML"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Company Address</p>
              <textarea
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                className="w-[400px] h-[100px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
                placeholder="Full company address"
              />
            </div>
            <div className="flex flex-col text-start space-y-3">
              <p>Company Phone</p>
              <input
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                type="tel"
                className="w-[400px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl"
                placeholder="e.g., +1-555-123-4567"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-[400px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 flex items-center gap-2 justify-center h-[50px] w-[400px] text-white font-semibold rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiUserAdd className="text-2xl" />
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        <p className="mt-6 pb-10">
          Already Have An Account?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer font-semibold ml-2 text-center"
          >
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterAsCompany;
