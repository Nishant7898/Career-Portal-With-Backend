import { useNavigate } from "react-router-dom";
import { MdLogin, MdOutlinePersonAddAlt } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex w-screen items-center justify-center">
      <div className="h-[350px] space-y-3 w-[600px] px-30 py-10 text-center items-center flex flex-col shadow-2xl bg-white">
        <p className="text-blue-600 text-5xl font-bold">
          Welcome To Career Portal
        </p>
        <p className="mt-5 opacity-35">
          Discover Job Opportunities And Connect With Employers That Value Your
          Skills
        </p>
        <div className="flex flex-row gap-2 mt-4">
          <button
            onClick={() => navigate("/login")}
            className="flex text-center cursor-pointer hover:bg-blue-600 items-center p-2 border-blue-500 bg-blue-700 text-white rounded-md gap-2 border px-4"
          >
            <MdLogin className="font-bold" />
            Login
          </button>
          <button
            onClick={() => navigate("/choose")}
            className="border flex gap-2 text-blue-800 cursor-pointer hover:bg-blue-700 hover:text-white border-blue-500 rounded-md p-2 text-center items-center px-4"
          >
            <MdOutlinePersonAddAlt />
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
