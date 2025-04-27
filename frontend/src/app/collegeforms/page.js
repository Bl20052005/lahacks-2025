"use client";
import React from "react";
import FormSection from "./FormSection";
import InputField from "./InputField";
import FormColumn from "./FormColumn";
import SubmitButton from "./SubmitButton";

const CreateAccountHighSchool = () => {
  const [formData, setFormData] = React.useState({
    college: "",
    year: "",
    major: "",
    gpa: "",
    careers: "",
    companies: "",
    graduateSchool: "",
    internshipExperience: "",
    clubsLeadership: "",
    coursework: "",
    skills: "",
    volunteerActivities: "",
    organizations: "",
    other: ""
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
      console.log(formData, "formData", JSON.stringify(formData))
      const response = await fetch("/api/college-form", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        console.log("Form submitted successfully", result);
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
                    name="college"
                    label="What college do you attend?"
                    value={formData.college}
                    onChange={handleInputChange}
                  />
                  <InputField 
                    name="year"
                    label="What year are you in college?"
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-5 mt-5 max-md:flex-col">
                  <InputField 
                    name="major"
                    label="What is your major?"
                    value={formData.major}
                    onChange={handleInputChange}
                  />
                  <InputField 
                    name="gpa"
                    label="Current GPA?"
                    value={formData.gpa}
                    onChange={handleInputChange}
                  />
                </div>
              </FormSection>

              <FormSection title="Career Planning">
                <div className="flex gap-5 max-md:flex-col">
                  <InputField 
                    name="careers"
                    label="What careers are you interested in?"
                    value={formData.careers}
                    onChange={handleInputChange}
                  />
                  <InputField 
                    name="companies"
                    label="Are there any specific companies you want to work at?"
                    value={formData.companies}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-5 mt-5 max-md:flex-col">
                  <InputField 
                    name="graduateSchool"
                    label="Are you planning to attend graduate school? (medical school, law school, etc.)"
                    value={formData.graduateSchool}
                    onChange={handleInputChange}
                  />
                </div>
              </FormSection>

              <FormSection title="Experience">
                <div className="flex gap-5 max-md:flex-col">
                  <InputField
                    name="internshipExperience"
                    label="Any internship or research experience? If so, please elaborate."
                    multiline
                    className="h-28"
                    value={formData.internshipExperience}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-5 mt-5 max-md:flex-col">
                  <InputField
                    name="clubsLeadership"
                    label="What clubs are you involved in and do you hold any leadership positions?"
                    multiline
                    className="h-28"
                    value={formData.clubsLeadership}
                    onChange={handleInputChange}
                  />
                </div>
              </FormSection>

              <FormSection title="Skills">
                <div className="flex gap-5 max-md:flex-col">
                  <InputField 
                    name="coursework"
                    label="Relevant coursework?"
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

              <FormSection title="Extracurriculars">
                <div className="flex gap-5 max-md:flex-col">
                  <InputField 
                    name="volunteerActivities"
                    label="Volunteer Activities?"
                    value={formData.volunteerActivities}
                    onChange={handleInputChange}
                  />
                  <InputField 
                    name="organizations"
                    label="Organizations and societies?"
                    value={formData.organizations}
                    onChange={handleInputChange}
                  />
                </div>
              </FormSection>

              <FormSection title="Other">
                <InputField
                  name="other"
                  multiline={true}
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
