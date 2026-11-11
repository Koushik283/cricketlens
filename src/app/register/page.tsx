
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push("/login");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d18] p-6 text-white">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-5 rounded-2xl border border-gray-800 bg-[#111827] p-8"
      >
        <h1 className="text-center text-3xl font-bold">Create Account</h1>
        <p className="text-center text-gray-400">
          Join the CricketLens community.
        </p>

        <div>
          <label className="mb-2 block text-sm">Full Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
            placeholder="Your email"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">Password</label>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
            placeholder="At least 8 characters"
          />
        </div>

        {message && <p className="text-sm text-red-400">{message}</p>}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already registered?{" "}
          <Link href="/login" className="text-blue-400">
            Login
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          New accounts are registered with Viewer access.
        </p>
      </form>
    </main>
  );
}
