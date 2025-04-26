"use client";
import React from "react";

const InputField = ({ label, multiline = false, className = "", ...props }) => {
  return (
    <div className="flex flex-col flex-1 w-full">
      {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
      {multiline ? (
        <textarea
          className={`flex w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white ${className}`}
          {...props}
        />
      ) : (
        <input
          className={`flex w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default InputField;
