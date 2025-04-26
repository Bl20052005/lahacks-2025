"use client";
import React from "react";

const FormInput = ({ label, type = "text", className = "", ...props }) => {
  const inputId =
    label?.toLowerCase().replace(/\s+/g, "-") || Math.random().toString(36);

  return (
    <div className="mb-6">
      <label
        htmlFor={inputId}
        className="mb-2 block text-base text-black max-md:text-base max-sm:text-sm"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        className={`p-2 w-full text-base text-black rounded-md border border-solid bg-zinc-300 bg-opacity-0 border-neutral-400 ${
          className || "h-[38px]"
        } max-md:text-base max-sm:text-sm`}
        {...props}
      />
    </div>
  );
};

export default FormInput;
