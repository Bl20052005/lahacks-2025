"use client";
import React from "react";

const InputField = ({ label, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-left mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        name={name}
        className="w-full h-[47px] rounded-md border border-solid border-neutral-400 bg-zinc-300 bg-opacity-0 px-3 text-black"
        {...props}
      />
    </div>
  );
};

export default InputField;
