"use client";
import React from "react";

const FormSection = ({ title, children }) => {
  return (
    <section className="mb-8">
      {title && (
        <header className="text-3xl font-bold text-black mb-10">{title}</header>
      )}
      {children}
    </section>
  );
};

export default FormSection;
