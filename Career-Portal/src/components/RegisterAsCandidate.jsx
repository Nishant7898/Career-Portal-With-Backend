import React, { useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { fileService } from "../services/fileService";

const RegisterAsCandidate = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    mobile: "",
    status: "",
    gender: "",
    dob: "",
    education: "",
    workExp: "",
    skills: "",
    resume: "",
    photo: "",
  });

  // ✅ Handle Resume Upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setFormData({ ...formData, resume: file.name });
    } else {
      alert("Please upload only .pdf file for Resume!");
      e.target.value = "";
    }
  };

  // ✅ Handle Photo Upload (convert to base64 for saving)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(file);
        setFormData({ ...formData, photo: reader.result }); // Save base64
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload only .jpg or .jpeg file for Photo!");
      e.target.value = "";
    }
  };

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

  const validateMobile = (mobile) => {
    // Basic mobile number validation (10-15 digits, may include + and spaces)
    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ''));
  };

  // Handle input changes with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
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
      case 'mobile':
        if (value && !validateMobile(value)) {
          errors.mobile = "Please enter a valid mobile number";
        } else {
          errors.mobile = "";
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  // ✅ Handle Register Button Click
  const handleRegister = async () => {
    setError("");
    const errors = {};
    
    // Comprehensive validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!validateMobile(formData.mobile)) {
      errors.mobile = "Please enter a valid mobile number";
    }
    
    if (!formData.status) {
      errors.status = "Please select your status";
    }
    
    if (!formData.gender) {
      errors.gender = "Please select your gender";
    }
    
    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    }
    
    if (!formData.education.trim()) {
      errors.education = "Education details are required";
    }
    
    if (!formData.skills.trim()) {
      errors.skills = "Skills are required";
    }

    if (!resume) {
      errors.resume = "Please upload your resume";
    }

    if (!photo) {
      errors.photo = "Please upload your photo";
    }

    // If there are validation errors, show them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please fix the validation errors below");
      return;
    }

    setLoading(true);

    try {
      // Upload files first
      const resumeResult = await fileService.uploadResume(resume);
      
      if (!resumeResult.success) {
        setError(`Resume upload failed: ${resumeResult.message}`);
        setLoading(false);
        return;
      }

      const photoResult = await fileService.uploadPhoto(photo);
      
      if (!photoResult.success) {
        setError(`Photo upload failed: ${photoResult.message}`);
        setLoading(false);
        return;
      }

      // Prepare registration data
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        mobile: formData.mobile,
        status: formData.status.toUpperCase(), // Convert to backend enum format
        gender: formData.gender.toUpperCase(),
        dob: formData.dob,
        education: formData.education,
        workExperience: formData.workExp,
        skills: formData.skills,
        resumeFilePath: resumeResult.data.filePath,
        photoFilePath: photoResult.data.filePath,
      };

      // Register user
      const result = await authService.registerJobSeeker(registrationData);
      
      if (result.success) {
        alert("Registration Successful! Please login to continue.");
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
    <div
      id="candidate"
      className="min-h-screen mb-10 flex items-center justify-center bg-gray-100"
    >
      <div className="h-full flex mt-4 rounded-xl text-center items-center flex-col w-[500px] bg-white border border-gray-300 shadow-2xl">
        <h1 className="text-2xl mt-6 flex gap-2 text-center justify-center items-center font-semibold text-blue-600">
          <HiUserAdd className="text-3xl" /> Register As Candidate
        </h1>

        <div className="mt-[70px] space-y-6">
          {[
            { label: "Username*", name: "username", type: "text" },
            { label: "Email*", name: "email", type: "email" },
            { label: "Password*", name: "password", type: "password" },
            { label: "Confirm Password*", name: "confirmPassword", type: "password" },
            { label: "Name*", name: "name", type: "text" },
            { label: "Mobile*", name: "mobile", type: "text" },
          ].map((input) => (
            <div key={input.name} className="flex flex-col text-start space-y-3">
              <p>{input.label}</p>
              <input
                type={input.type}
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                className={`w-[400px] border rounded-md px-3 py-2 focus:outline-none focus:ring-1 shadow-sm ${
                  validationErrors[input.name] 
                    ? 'border-red-400 focus:ring-red-500' 
                    : 'border-gray-400 focus:ring-blue-500'
                }`}
              />
              {validationErrors[input.name] && (
                <p className="text-red-500 text-sm">{validationErrors[input.name]}</p>
              )}
            </div>
          ))}

          {/* Status */}
          <div className="flex flex-col text-start space-y-3">
            <p>Status*</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="Fresher"
                  checked={formData.status === "Fresher"}
                  onChange={handleChange}
                />
                Fresher
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="Experienced"
                  checked={formData.status === "Experienced"}
                  onChange={handleChange}
                />
                Experienced
              </label>
            </div>
            {validationErrors.status && (
              <p className="text-red-500 text-sm">{validationErrors.status}</p>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col text-start space-y-3">
            <p>Gender*</p>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-[400px] border rounded-md px-3 py-2 focus:outline-none focus:ring-1 shadow-sm ${
                validationErrors.gender 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-gray-400 focus:ring-blue-500'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {validationErrors.gender && (
              <p className="text-red-500 text-sm">{validationErrors.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div className="flex flex-col text-start space-y-3">
            <p>DOB*</p>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-[400px] border rounded-md px-3 py-2 focus:outline-none focus:ring-1 shadow-sm ${
                validationErrors.dob 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-gray-400 focus:ring-blue-500'
              }`}
            />
            {validationErrors.dob && (
              <p className="text-red-500 text-sm">{validationErrors.dob}</p>
            )}
          </div>

          {/* Education */}
          <div className="flex flex-col text-start space-y-3">
            <p>Education*</p>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              className={`w-[400px] h-[120px] border rounded-md px-3 py-2 focus:outline-none focus:ring-1 shadow-sm ${
                validationErrors.education 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-gray-400 focus:ring-blue-500'
              }`}
            ></textarea>
            {validationErrors.education && (
              <p className="text-red-500 text-sm">{validationErrors.education}</p>
            )}
          </div>

          {/* Work Exp */}
          <div className="flex flex-col text-start space-y-3">
            <p>Work Exp*</p>
            <textarea
              name="workExp"
              value={formData.workExp}
              onChange={handleChange}
              className="w-[400px] h-[120px] border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            ></textarea>
          </div>

          {/* Skills */}
          <div className="flex flex-col text-start space-y-3">
            <p>Skills*</p>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className={`w-[400px] h-[120px] border rounded-md px-3 py-2 focus:outline-none focus:ring-1 shadow-sm ${
                validationErrors.skills 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-gray-400 focus:ring-blue-500'
              }`}
            ></textarea>
            {validationErrors.skills && (
              <p className="text-red-500 text-sm">{validationErrors.skills}</p>
            )}
          </div>

          {/* ✅ Resume Upload */}
          <div className="flex flex-col text-start space-y-3">
            <p>Resume*</p>
            <div className="flex flex-row">
              <button
                type="button"
                onClick={() => document.getElementById("resumeUpload").click()}
                className="bg-gray-200 p-1 border border-gray-400 hover:bg-gray-300 shadow-sm"
              >
                Choose File
              </button>
              <input
                type="file"
                id="resumeUpload"
                accept=".pdf"
                onChange={handleResumeUpload}
                style={{ display: "none" }}
              />
              <input
                type="text"
                name="resume"
                value={formData.resume}
                readOnly
                className={`w-[300px] border-l-0 rounded-r-md border px-3 focus:outline-none focus:ring-1 shadow-sm ${
                  validationErrors.resume 
                    ? 'border-red-400 focus:ring-red-500' 
                    : 'border-gray-400 focus:ring-blue-500'
                }`}
              />
            </div>
            {validationErrors.resume && (
              <p className="text-red-500 text-sm">{validationErrors.resume}</p>
            )}
          </div>

          {/* ✅ Photo Upload */}
          <div className="flex flex-col text-start space-y-3">
            <p>Photo*</p>
            <div className="flex flex-row">
              <button
                type="button"
                onClick={() => document.getElementById("photoUpload").click()}
                className="bg-gray-200 p-1 border border-gray-400 hover:bg-gray-300 shadow-sm"
              >
                Choose File
              </button>
              <input
                type="file"
                id="photoUpload"
                accept=".jpg,.jpeg"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />
              <input
                type="text"
                name="photo"
                value={photo ? photo.name : ""}
                readOnly
                className={`w-[300px] border-l-0 rounded-r-md border px-3 focus:outline-none focus:ring-1 shadow-sm ${
                  validationErrors.photo 
                    ? 'border-red-400 focus:ring-red-500' 
                    : 'border-gray-400 focus:ring-blue-500'
                }`}
              />
            </div>
            {validationErrors.photo && (
              <p className="text-red-500 text-sm">{validationErrors.photo}</p>
            )}

            {/* ✅ Live Image Preview */}
            {photo && (
              <div className="flex flex-col text-start space-y-3 mt-3">
                <p>Profile Preview:</p>
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Profile Preview"
                  className="w-[100px] h-[100px] object-cover border border-gray-400 rounded-md shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-[400px]">
              {error}
            </div>
          )}

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-blue-700 flex items-center gap-2 justify-center h-[50px] w-[400px] text-white font-semibold rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiUserAdd className="text-2xl" />
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <p className="mt-6 pb-10">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer font-semibold ml-2"
          >
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterAsCandidate;
