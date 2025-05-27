"use client";

import { useState } from "react";
import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });
      
      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black bg-opacity-50 rounded-lg border border-cyan-500">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Team Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-gray-900 border border-cyan-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Enter your team member email"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-1">
            Team Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-gray-900 border border-cyan-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Enter your team password"
          />
        </div>
        
        {error && (
          <div className="text-red-400 text-sm font-medium py-1">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-400">
        Don't have a team? <a href="/register" className="text-cyan-400 hover:text-cyan-300">Register</a>
      </div>
    </div>
  );
} 