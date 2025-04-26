"use client";
import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-5 py-5 text-xl font-medium text-center text-white rounded-md bg-blue-950 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
