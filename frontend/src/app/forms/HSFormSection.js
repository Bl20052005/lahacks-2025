"use client";
import React from "react";

const FormSection = ({ title, children }) => {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-2xl font-bold text-black max-md:text-2xl max-sm:text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
};

export default FormSection;
