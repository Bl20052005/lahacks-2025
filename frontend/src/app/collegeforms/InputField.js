"use client";
import React from "react";

const InputField = ({ label, name, value, onChange, multiline = false, className = "" }) => {
  console.log(name, "name")
  return (
    <div className="flex flex-col flex-1 w-full">
      {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className={`flex w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white ${className}`}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={`flex w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white ${className}`}
        />
      )}
    </div>
  );
};

export default InputField;
