
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AuthControls() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-semibold">{user.name}</p>
        <p className="text-xs text-sky-400">{user.role}</p>
      </div>

      {user.role === "Admin" && (
  <>
    <Link
      href="/admin/matches"
      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
    >
      Admin Panel
    </Link>

    <Link
      href="/admin/analytics"
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
    >
      SQL Analytics
    </Link>
    <Link
  href="/admin/database-reports"
  className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
>
  Database Reports
</Link>
<Link
  href="/admin/players"
  className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
>
  Add Player
</Link>
<Link
  href="/admin/stored-procedures"
  className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
>
  Stored Procedures
</Link>
<Link
  href="/admin/stored-functions"
  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
>
  Stored Functions
</Link>
<Link
  href="/admin/match-management"
  className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
>
  Match Management
</Link>
  </>
)}

      <button
        onClick={handleLogout}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
      >
        Logout
      </button>
    </div>
  );
}
