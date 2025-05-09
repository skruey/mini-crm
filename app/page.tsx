"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setShowSignup(false);
      router.push("/dashboard");
    } else {
      setError("Could not create account");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg border-4 border-crm-yellow bg-neutral-900">
        <h1 className="text-center mb-6 text-4xl font-extrabold tracking-tight text-crm-yellow">
          Mini CRM
        </h1>

        <h2 className="text-center mb-4 text-xl font-semibold text-white">
          {showSignup ? "Sign Up" : "Login"}
        </h2>

        <form
          onSubmit={showSignup ? handleSignup : handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border-2 border-crm-yellow text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crm-yellow"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border-2 border-crm-yellow text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crm-yellow"
          />

          <button
            type="submit"
            className="w-full py-2 px-4 font-bold rounded-lg shadow transition duration-150 bg-crm-yellow text-black hover:opacity-80 hover:cursor-pointer"
          >
            {showSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          {showSignup ? (
            <button
              type="button"
              onClick={() => setShowSignup(false)}
              className="font-medium text-white hover:underline hover:cursor-pointer"
            >
              Back to login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              className="font-medium text-white hover:underline hover:cursor-pointer"
            >
              Create Account
            </button>
          )}
        </div>
        {error && (
          <div className="mt-4 text-center font-semibold text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
