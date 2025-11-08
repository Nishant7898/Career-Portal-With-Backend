import React from "react";
import { IoBanSharp } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

const CompanyAccessDenied = () => {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="h-[400px] w-[500px] border border-gray-200 shadow-2xl bg-white rounded-xl flex flex-col items-center justify-center text-center p-6">
        <IoBanSharp className="text-red-600 text-6xl mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600">
   You are not authorized to view reports from other companies.
   Please return to your dashboard or contact support if you believe this is an error.
        </p>
     <button className="flex items-center gap-2 mt-8 border border-blue-900 p-2 px-2 font-semibold text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer rounded-md"><FaArrowLeft />Go Back To Home</button>
      </div>
    </div>
  );
};

export default CompanyAccessDenied;
