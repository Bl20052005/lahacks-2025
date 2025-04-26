"use client";
import React from "react";
import FormSection from "./FormSection";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";

const InputDesign = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <main className="flex flex-col items-center p-8 mx-auto w-full max-w-none min-h-screen bg-cover bg-[url('https://cdn.builder.io/api/v1/image/assets/TEMP/e3f268d78c70f05e9fa6710943187597579160e0?placeholderIfAbsent=true')] max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0b5f620c505a6895b2c6461013531d7cbdf3268?placeholderIfAbsent=true"
          className="mb-8 h-[60px] w-[177px]"
          alt="Logo"
        />
        <form
          onSubmit={handleSubmit}
          className="p-10 rounded-3xl bg-neutral-200 max-w-[800px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[90%] max-md:p-8 max-sm:p-6"
        >
          <FormSection title="Core Info">
            <FormInput label="What high school are you going to?" />
            <FormInput label="What year are you in high school?" />
            <FormInput label="Where do you live?" />
          </FormSection>

          <FormSection title="Interests & Goals">
            <FormInput label="What careers are you interested in?" />
            <FormInput label="What college do you aspire to attend?" />
          </FormSection>

          <FormSection title="Extracurriculars">
            <FormInput label="Club involvement?" />
            <FormInput label="Sports?" />
            <FormInput label="Volunteer activities?" />
          </FormSection>

          <FormSection title="Skills">
            <FormInput label="Relevant coursework (AP, honors, community college)?" />
            <FormInput label="General skills?" />
          </FormSection>

          <FormSection title="Awards & Certificates">
            <FormInput label="Competition and awards?" />
            <FormInput label="Certifications?" />
          </FormSection>

          <FormSection title="Other">
            <FormInput className="h-24" />
          </FormSection>

          <SubmitButton />
        </form>
      </main>
    </>
  );
};

export default InputDesign;
