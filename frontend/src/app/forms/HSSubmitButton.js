"use client";
import React from "react";

const SubmitButton = ({ children = "Submit", ...props }) => {
  return (
    <button
      className="mt-4 text-xl font-medium text-white rounded-md cursor-pointer bg-blue-950 h-[53px] w-[125px] max-md:text-lg max-sm:text-base"
      type="submit"
      {...props}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
