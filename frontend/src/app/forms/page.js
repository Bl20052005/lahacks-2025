"use client";
import { useState } from "react";

export default function FormsPage() {
  const [input, setInput] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      setSubmissions([...submissions, input]);
      setInput("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow">
      <h1 className="text-2xl mb-4 font-bold">Submit a Form</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-foreground text-background p-2 rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Submissions</h2>
      <ul className="list-disc pl-5">
        {submissions.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
