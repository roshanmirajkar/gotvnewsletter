"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setApiMessage("Thank you for adding your email to the AI newsletter 🚀");
    } catch (error) {
      setApiMessage("Error calling API");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <h1 className="text-6xl font-bold mb-2">AI Newsletter ✨</h1>
      <h2 className="text-lg mb-8">A daily AI newsletter sourced by AI agents & Firecrawl 🔥</h2>
      
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        {/* Email Input */}
       
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="border px-2 py-1 mr-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Join
        </button>
     
       
      </form>
       {/* API Response Message */}
       {apiMessage && (
          <p className="text-sm font-[family-name:var(--font-geist-mono)] mt-4">
            {apiMessage}
          </p>
        )}
    </div>
  );
}
