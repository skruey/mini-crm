"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-extrabold tracking-tight">
            Mini CRM
          </CardTitle>
          <div className="text-center mb-4 text-xl font-semibold">
            {showSignup ? "Sign Up" : "Login"}
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={showSignup ? handleSignup : handleLogin}
            className="space-y-4"
          >
            <Input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full font-bold">
              {showSignup ? "Create Account" : "Login"}
            </Button>
          </form>

          <div className="mt-4 flex justify-center">
            {showSignup ? (
              <Button
                type="button"
                variant="link"
                onClick={() => setShowSignup(false)}
              >
                Back to login
              </Button>
            ) : (
              <Button
                type="button"
                variant="link"
                onClick={() => setShowSignup(true)}
              >
                Create Account
              </Button>
            )}
          </div>
          {error && (
            <div className="mt-4 text-center font-semibold text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
