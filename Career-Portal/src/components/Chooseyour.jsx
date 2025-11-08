import React from "react";
import { PiStudentFill } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Chooseyour = () => {
    const navigate=useNavigate()
  return (
    <div className="h-screen w-screen items-center justify-center flex p-2 rounded-xl">
      <div className="h-[250px] items-center space-y-5 text-center justify-center flex flex-col font-bold w-[400px] px-10 p-3 rounded-2xl border border-white shadow-2xl">
        <p className="text-2xl">Choose Your Role </p>
        <div className="space-y-4 mt-2">
          <button onClick={()=>navigate("/candidate")} className="w-[300px] gap-2 p-1 cursor-pointer hover:bg-blue-700 items-center justify-center text-center flex rounded-md   text-white bg-blue-500">
           <PiStudentFill className="text-xl" /> Register As Candidate
          </button>
          <button onClick={()=>navigate("/ascompany")} className=" text-center gap-2 w-[300px] cursor-pointer hover:bg-rose-800 items-center justify-center  text-white flex rounded-md p-1  bg-rose-600">
         <FaBuilding />   Register As Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chooseyour;
