"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [sources, setSources] = useState([""]);
  const [apiMessage, setApiMessage] = useState("");

  // Handle changes to individual source inputs
  const handleSourceChange = (index: number, value: string) => {
    const newSources = [...sources];
    newSources[index] = value;
    setSources(newSources);
  };

  // Add a new empty source input
  const addSource = () => {
    setSources([...sources, ""]);
  };

  // Remove a source input
  const removeSource = (index: number) => {
    const newSources = [...sources];
    newSources.splice(index, 1);
    setSources(newSources);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, sources })
      });
      const data = await response.json();
      setApiMessage(data.message);
    } catch (error) {
      setApiMessage("Error calling API");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        {/* Email Input */}
        <div className="flex flex-col items-start">
          <label htmlFor="email" className="mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="border px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Sources Input */}
        <div className="flex flex-col items-start">
          <label className="mb-1">Sources:</label>
          {sources.map((source, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="border px-2 py-1 mr-2"
                value={source}
                onChange={(e) => handleSourceChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => removeSource(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addSource} className="mt-2 text-blue-500">
            Add Source
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 mt-4"
        >
          Submit
        </button>

        {/* API Response Message */}
        {apiMessage && (
          <p className="text-sm font-[family-name:var(--font-geist-mono)] mt-4">
            API Response: {apiMessage}
          </p>
        )}
      </form>
    </div>
  );
}
