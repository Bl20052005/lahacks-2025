"use client";
import React from "react";

const RadioGroup = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-lg text-left text-black mb-6">
        What is your education level?
      </label>
      <div className="flex flex-col gap-5 ml-6 max-w-full w-[249px] max-md:ml-2.5">
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="highSchool"
            name="education"
            value="highSchool"
            checked={value === "highSchool"}
            onChange={(e) => onChange(e.target.value)}
            className="w-6 h-6 rounded-full border-2 border-solid border-neutral-300 appearance-none checked:bg-blue-950"
          />
          <label
            htmlFor="highSchool"
            className="text-base text-black cursor-pointer"
          >
            High School
          </label>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="secondary"
            name="education"
            value="secondary"
            checked={value === "secondary"}
            onChange={(e) => onChange(e.target.value)}
            className="w-6 h-6 rounded-full border-2 border-solid border-neutral-300 appearance-none checked:bg-blue-950"
          />
          <label
            htmlFor="secondary"
            className="text-base text-black cursor-pointer"
          >
            Secondary Education
          </label>
        </div>
      </div>
    </div>
  );
};

export default RadioGroup;
