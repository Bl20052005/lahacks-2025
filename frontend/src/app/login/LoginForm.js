"use client";
import * as React from "react";
import { FormInput } from "./FormInput";
import { Button } from "./Button";

export function LoginForm() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center px-0 py-14 rounded-md bg-neutral-200 h-[550px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[600px] max-md:px-0 max-md:py-10 max-md:w-4/5 max-sm:px-0 max-sm:py-8 max-sm:w-[90%]"
    >
      <div className="flex flex-col items-center w-full">
        <h1 className="mb-10 text-3xl font-semibold text-center text-neutral-800 max-sm:text-2xl">
          Sign in to your account
        </h1>

        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => handleInputChange("email", value)}
        />

        <FormInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => handleInputChange("password", value)}
        />

        <Button type="submit">Sign in</Button>

        <p className="mt-8 text-lg text-black max-sm:text-base">
          New to Loom?{" "}
          <button
            type="button"
            className="font-bold text-blue-900 cursor-pointer"
            onClick={() => console.log("Create account clicked")}
          >
            Create account
          </button>
        </p>
      </div>
    </form>
  );
}
