"use client";
import * as React from "react";
import { FormInput } from "./FormInput";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Login successful:", result);
        router.push("/home");
      } else {
        console.error("Login failed:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
          label="Username"
          type="username"
          value={formData.username}
          onChange={(value) => handleInputChange("username", value)}
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
            onClick={() => router.push("../create")}
          >
            Create account
          </button>
        </p>
      </div>
    </form>
  );
}
