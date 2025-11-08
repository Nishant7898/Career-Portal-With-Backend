import React from "react";
import { FaBriefcase } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isEmployer, isJobSeeker, logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="bg-blue-800 flex px-20 justify-between h-[50px] text-white items-center">
      {/* Logo */}
      <p
        className="text-2xl flex gap-2 items-center font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        <FaBriefcase />
        Career Portal
      </p>

      {/* Navigation Buttons */}
      <div className="flex gap-5 items-center">
        <button className="hover:text-yellow-400" onClick={() => navigate("/")}>
          Home
        </button>

        <button
          className="hover:text-yellow-400"
          onClick={() => navigate("/jobs")}
        >
          Jobs
        </button>

        {/* Companies only for job seekers, not for employers */}
        <button
          className="hover:text-yellow-400"
          onClick={() =>
            isEmployer() ? navigate("/access-denied") : navigate("/companies")
          }
        >
          Companies
        </button>

        {/* Profile - available for authenticated users */}
        {isAuthenticated && (
          <button
            className="hover:text-yellow-400"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
        )}

        {/* Post Job - only for employers */}
        {/* {isEmployer() && (
          <button className="hover:text-yellow-400" onClick={() => navigate("/jobpost")}>
            Post Job
          </button>
        )} */}

        {/* Dashboard - only for employers */}
        {/* {isEmployer() && (
          <button className="hover:text-yellow-400" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        )} */}

        {/* Report page: job seekers get access denied */}
        <button
          className="hover:text-yellow-400"
          onClick={() =>
            isJobSeeker() ? navigate("/access-denied1") : navigate("/reports")
          }
        >
          Report
        </button>

        {/* Login / Logout */}
        {isAuthenticated ? (
          <button
            className="cursor-pointer flex gap-2 items-center hover:text-yellow-400"
            onClick={handleLogout}
          >
            <IoMdExit />
            Logout
          </button>
        ) : (
          <button
            className="cursor-pointer hover:text-yellow-400"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
