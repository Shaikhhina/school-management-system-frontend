import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">
        School Management System
      </h1>

      <p className="mb-6">
        Manage students and assignments easily
      </p>

      <button
        onClick={() => navigate("/login")}
        className="bg-white text-blue-500 px-6 py-2 rounded hover:bg-white hover:text-blue-600 transition-colors duration-200"
      >
        Login
      </button>
    </div>
  );
};

export default Welcome;
