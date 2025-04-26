"use client";
import React from "react";

const FormColumn = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-md:w-full max-md:ml-0 ${className}`}>
      {children}
    </div>
  );
};

export default FormColumn;
