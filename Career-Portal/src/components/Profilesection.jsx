import { useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isEmployer, isJobSeeker, loading, userRole } =
    useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      return;
    }

    // Redirect to appropriate profile edit page based on user role
    if (isEmployer()) {
      navigate("/editcompanyprofile");
    } else if (isJobSeeker()) {
      navigate("/editprofile");
    }
  }, [isAuthenticated, isEmployer, isJobSeeker, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col gap-4 justify-center text-center items-center text-2xl font-bold">
        <div className="flex gap-2 items-center">
          <MdErrorOutline className="text-red-500 text-2xl" />
          Please Login Or Register First.
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-base"
        >
          Login
        </button>
      </div>
    );
  }

  // Show loading while redirecting
  if (isEmployer() || isJobSeeker()) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-xl">Redirecting to profile...</div>
      </div>
    );
  }

  // Fallback for unknown role - show debug info
  return (
    <div className="h-screen flex flex-col gap-4 justify-center text-center items-center">
      <div className="flex gap-2 items-center text-2xl font-bold">
        <MdErrorOutline className="text-red-500 text-2xl" />
        Unable to determine user role
      </div>

      {/* Debug Information */}
      <div className="bg-gray-100 p-4 rounded-lg max-w-md">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <div className="text-sm text-left space-y-1">
          <p>
            <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
          </p>
          <p>
            <strong>User Role:</strong> {userRole || "None"}
          </p>
          <p>
            <strong>Is Employer:</strong> {isEmployer() ? "Yes" : "No"}
          </p>
          <p>
            <strong>Is Job Seeker:</strong> {isJobSeeker() ? "Yes" : "No"}
          </p>
          <p>
            <strong>Token in Storage:</strong>{" "}
            {localStorage.getItem("token") ? "Yes" : "No"}
          </p>
          <p>
            <strong>Role in Storage:</strong>{" "}
            {localStorage.getItem("userRole") || "None"}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
      >
        Login Again
      </button>
    </div>
  );
};

export default Profile;
