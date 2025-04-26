"use client";
import React from "react";

const InputField = ({ label, multiline = false, className = "" }) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-4 text-base text-black">{label}</label>}
      {multiline ? (
        <textarea
          className={`flex shrink-0 rounded-md border border-solid border-neutral-400 bg-zinc-300 bg-opacity-0 px-3 py-2 text-black ${className}`}
        />
      ) : (
        <input
          className={`flex shrink-0 h-[38px] rounded-md border border-solid border-neutral-400 bg-zinc-300 bg-opacity-0 px-3 py-2 text-black ${className}`}
        />
      )}
    </div>
  );
};

export default InputField;
