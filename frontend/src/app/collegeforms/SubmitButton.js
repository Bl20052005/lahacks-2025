"use client";
import React from "react";

const SubmitButton = ({ children }) => {
  return (
    <button
      type="submit"
      className="px-7 py-5 text-xl font-medium text-center text-white whitespace-nowrap rounded-md bg-blue-950 hover:bg-blue-900 transition-colors max-md:px-5"
    >
      {children}
    </button>
  );
};

export default SubmitButton;
