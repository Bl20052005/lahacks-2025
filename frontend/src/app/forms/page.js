"use client";
import React, { useState } from "react";
import FormSection from "./HSFormSection";
import InputField from "./HSInputField";
import FormColumn from "./HSFormColumn";
import SubmitButton from "./HSSubmitButton";
import { useRouter } from "next/navigation";

const CreateAccountHighSchool = () => {
  const router = useRouter()
  const [formData, setFormData] = React.useState({
    highSchool: "",
    year: "",
    location: "",
    careers: "",
    college: "",
    clubs: "",
    sports: "",
    volunteer: "",
    coursework: "",
    skills: "",
    awards: "",
    certifications: "",
    other: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    try {
      const response = await fetch("/api/hs-form", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        router.push("../home");
        console.log("Form submitted successfully", result, formData);
        // Optionally reset form or show success message
      } else {
        console.error("Submission failed", result.error);
        // Optionally show error message to user
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally show network error to user
    }
  };

  return (
    <main className="overflow-hidden bg-black">
      <div className="flex relative flex-col pt-8 pr-20 pb-36 pl-3 w-full min-h-[1582px] max-md:pr-5 max-md:pb-24 max-md:max-w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/007c9327f648f6f9d28f698c241e2b5679e7d0ad?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
          alt="Background"
          className="object-cover absolute inset-0 size-full"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f889e319d79bf5e19de58793acb908f20457fb63?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
          alt="Logo"
          className="object-contain relative z-10 max-w-full aspect-[2.95] w-[177px]"
        />

        <form
          onSubmit={handleSubmit}
          className="flex relative flex-col items-start self-center px-16 pt-11 pb-7 mt-24 -mb-7 w-full rounded-3xl bg-neutral-200 max-w-[1096px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:px-5 max-md:mt-10 max-md:mb-2.5 max-md:max-w-full"
        >
          <div className="max-w-full w-full">
            <div className="flex gap-5 max-md:flex-col">
              <FormColumn>
                <FormSection title="Core Info*">
                  <div className="flex gap-5 max-md:flex-col">
                    <InputField
                      name="highSchool"
                      label="What high school do you attend?"
                      value={formData.highSchool}
                      onChange={handleInputChange}
                    />
                    <InputField
                      name="year"
                      label="What year are you in high school?"
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-5 mt-5 max-md:flex-col">
                    <InputField
                      name="location"
                      label="Where do you live?"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </FormSection>

                <FormSection title="Interests & Goals">
                  <div className="flex gap-5 max-md:flex-col">
                    <InputField
                      name="careers"
                      label="What careers are you interested in?"
                      value={formData.careers}
                      onChange={handleInputChange}
                    />
                    <InputField
                      name="college"
                      label="What college do you aspire to attend?"
                      value={formData.college}
                      onChange={handleInputChange}
                    />
                  </div>
                </FormSection>

                <FormSection title="Extracurriculars">
                  <div className="flex gap-5 max-md:flex-col">
                    <InputField
                      name="clubs"
                      label="Club involvement?"
                      value={formData.clubs}
                      onChange={handleInputChange}
                    />
                    <InputField
                      name="sports"
                      label="Sports?"
                      value={formData.sports}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-5 mt-5 max-md:flex-col">
                    <InputField
                      name="volunteer"
                      label="Volunteer activities?"
                      value={formData.volunteer}
                      onChange={handleInputChange}
                    />
                  </div>
                </FormSection>

                <FormSection title="Skills">
                  <div className="flex gap-5 max-md:flex-col">
                    <InputField
                      name="coursework"
                      label="Relevant coursework (AP, honors, community college)?"
                      value={formData.coursework}
                      onChange={handleInputChange}
                    />
                    <InputField
                      name="skills"
                      label="General skills?"
                      value={formData.skills}
                      onChange={handleInputChange}
                    />
                  </div>
                </FormSection>

                <FormSection title="Awards & Certificates">
                  <div className="flex gap-5 max-md:flex-col">
                    <InputField
                      name="awards"
                      label="Competition and awards?"
                      value={formData.awards}
                      onChange={handleInputChange}
                    />
                    <InputField
                      name="certifications"
                      label="Certifications?"
                      value={formData.certifications}
                      onChange={handleInputChange}
                    />
                  </div>
                </FormSection>

                <FormSection title="Other">
                  <InputField
                    name="other"
                    className="h-24 w-full"
                    value={formData.other}
                    onChange={handleInputChange}
                  />
                </FormSection>
              </FormColumn>
            </div>
          </div>
          <SubmitButton>Submit</SubmitButton>
        </form>
      </div>
    </main>
  );
};

export default CreateAccountHighSchool;
