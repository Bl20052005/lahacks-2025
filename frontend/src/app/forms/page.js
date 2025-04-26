"use client";
import React from "react";
import FormSection from "./HSFormSection";
import InputField from "./HSInputField";
import FormColumn from "./HSFormColumn";
import SubmitButton from "./HSSubmitButton";

const CreateAccountHighSchool = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
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
          <div className="max-w-full w-[808px]">
            <div className="flex gap-5 max-md:flex-col">
              <FormColumn>
                <FormSection title="Core Info">
                  <InputField label="What high school are you going to?" />
                  <InputField label="Where do you live?" />
                </FormSection>

                <FormSection title="Interests & Goals">
                  <InputField label="What careers are you interested in?" />
                </FormSection>

                <FormSection title="Extracurriculars">
                  <InputField label="Club involvement?" />
                  <InputField label="Volunteer activities?" />
                </FormSection>
              </FormColumn>

              <FormColumn>
                <div className="flex flex-col self-stretch my-auto text-base text-black max-md:mt-10">
                  <div className="mt-16 max-md:mt-20">
                    <InputField label="What year are you in high school?" />
                  </div>
                  <div className="mt-40 max-md:mt-10">
                    <InputField label="What college do you aspire to attend?" />
                  </div>
                  <div className="mt-40 max-md:mt-10">
                    <InputField label="Sports?" />
                  </div>
                </div>
              </FormColumn>
            </div>
          </div>

          <div className="mt-10 max-w-full w-[808px] max-md:mt-10">
            <div className="flex gap-5 max-md:flex-col">
              <FormColumn>
                <FormSection title="Skills">
                  <InputField label="Relevant coursework (AP, honors, community college)?" />
                </FormSection>

                <FormSection title="Awards & Certificates">
                  <InputField label="Competition and awards?" />
                </FormSection>
              </FormColumn>

              <FormColumn>
                <div className="flex flex-col grow mt-16 text-base text-black max-md:mt-10">
                  <InputField label="General skills?" />
                  <div className="mt-20 max-md:mt-10">
                    <InputField label="Certifications?" />
                  </div>
                </div>
              </FormColumn>
            </div>
          </div>

          <FormSection title="Other">
            <InputField
              multiline={true}
              className="h-24 w-[808px] max-w-full"
            />
          </FormSection>

          <SubmitButton>Submit</SubmitButton>
        </form>
      </div>
    </main>
  );
};

export default CreateAccountHighSchool;
