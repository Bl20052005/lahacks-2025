"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import Button from "./Button";
import { useRouter } from "next/navigation";

const CreateAccountForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    education: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
       
        if (formData.education === "highSchool") {
          router.push("/forms");
        } else  {
          router.push("/collegeforms");
        }
      } else {
        console.error("Signup failed:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };  

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-hidden bg-[url('bkgd2.jpg')] bg-cover bg-center bg-no-repeat">
      <form
        onSubmit={handleSubmit}
        className="flex relative flex-col items-start self-center px-14 pt-16 pb-7 mt-11 mb-0 max-w-full rounded-md bg-neutral-200 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[483px] max-md:px-5 max-md:mt-10 max-md:mb-2.5"
      >
        <h1 className="text-3xl font-semibold text-neutral-800">Get started</h1>
        <div className="w-full space-y-7 mt-10">
          <InputField
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username")(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password")(e.target.value)}
          />
          <RadioGroup
            value={formData.education}
            onChange={handleChange("education")}
          />
        </div>
        <Button
          type="submit"
          className="self-center mt-16 w-[200px] max-md:mt-10"
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default CreateAccountForm;
