
"use client";

import { useEffect, useState } from "react";
import AuthControls from "@/components/AuthControls";

type DashboardData = {
  stats: {
    totalTeams: number;
    totalPlayers: number;
    totalMatches: number;
    completedMatches: number;
  };
  recentMatches: {
    id: number;
    matchDate: string;
    team1: string;
    team2: string;
    status: string;
    winner: string | null;
    score1: string | null;
    score2: string | null;
  }[];
  topPlayers: {
    name: string;
    team: string;
    runs: number;
  }[];
};

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load dashboard data");
        }
        return res.json();
      })
      .then((result) => setData(result))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: "Total Teams",
      value: data?.stats.totalTeams ?? 0,
      icon: "🏆",
    },
    {
      title: "Total Players",
      value: data?.stats.totalPlayers ?? 0,
      icon: "👥",
    },
    {
      title: "Total Matches",
      value: data?.stats.totalMatches ?? 0,
      icon: "🏏",
    },
    {
      title: "Completed Matches",
      value: data?.stats.completedMatches ?? 0,
      icon: "✅",
    },
  ];

  const matches = data?.recentMatches ?? [];
  const topPlayers = data?.topPlayers ?? [];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 p-6 md:block">
          <h1 className="text-2xl font-bold text-emerald-400">
            🏏 CricketLens
          </h1>

          <p className="mt-2 text-xs text-slate-400">
            ODI Cricket Analytics
          </p>

          <nav className="mt-10 space-y-3">
            <a href="/" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
              Dashboard
            </a>

            <a href="/matches" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
              Matches
            </a>

            <a href="/teams" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
              Teams
            </a>

            <a href="/players" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
              Players
            </a>

            <a href="/statistics" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
              Statistics
            </a>

            <a href="/feedback" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
              Feedback
            </a>
          </nav>

          <div className="mt-16 rounded-xl bg-slate-800 p-4">
            <p className="font-semibold">CricketLens</p>
            <p className="mt-1 text-xs text-slate-400">
              Explore international ODI cricket statistics.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-5 md:p-8">

          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <p className="mt-1 text-sm text-slate-400">
                Welcome to CricketLens analytics
              </p>
            </div>

            <AuthControls />
          </header>

          {/* Statistics Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex justify-between">
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <span>{stat.icon}</span>
                </div>

                <h3 className="mt-4 text-3xl font-bold">
                  {loading ? "..." : stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Recent Matches */}
          <div className="mt-10">
            <h3 className="text-xl font-bold">Recent Matches</h3>

            <div className="mt-4 space-y-4">
              {loading ? (
                <p className="text-slate-400">Loading matches...</p>
              ) : matches.length === 0 ? (
                <p className="text-slate-400">No matches found.</p>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <p className="font-semibold">
                        {match.team1} vs {match.team2}
                      </p>

                      <span className="text-xs text-emerald-400">
                        {match.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <p className="text-slate-300">
                        {match.team1}: {match.score1 ?? "Not available"}
                      </p>

                      <p className="text-slate-300">
                        {match.team2}: {match.score2 ?? "Not available"}
                      </p>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      {match.status === "Completed"
                        ? `Winner: ${match.winner ?? "Not available"}`
                        : `Match Date: ${match.matchDate}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Players */}
          <div className="mt-10">
            <h3 className="text-xl font-bold">Top Run Scorers</h3>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="p-4">Player</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">Runs</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-slate-400">
                        Loading players...
                      </td>
                    </tr>
                  ) : topPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-slate-400">
                        No player data found.
                      </td>
                    </tr>
                  ) : (
                    topPlayers.map((player) => (
                      <tr
                        key={player.name}
                        className="border-t border-slate-800"
                      >
                        <td className="p-4 font-medium">{player.name}</td>
                        <td className="p-4 text-slate-400">{player.team}</td>
                        <td className="p-4 font-semibold text-emerald-400">
                          {player.runs}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}
