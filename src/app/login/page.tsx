
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push("/");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d18] p-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-2xl border border-gray-800 bg-[#111827] p-8"
      >
        <h1 className="text-center text-3xl font-bold">CricketLens</h1>
        <p className="text-center text-gray-400">Welcome back! Login to continue.</p>

        <div>
          <label className="mb-2 block text-sm">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
            placeholder="Enter your password"
          />
        </div>

        {message && <p className="text-sm text-red-400">{message}</p>}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
