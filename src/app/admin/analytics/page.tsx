
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Batter = {
  Player_ID: number;
  Player_Name: string;
  Team_Name: string;
  Total_Runs: number;
};

type Bowler = {
  Player_ID: number;
  Player_Name: string;
  Team_Name: string;
  Total_Wickets: number;
};

type AveragePlayer = {
  Player_ID: number;
  Player_Name: string;
  Team_Name: string;
  Total_Runs: number;
  Times_Out: number;
  Batting_Average: number;
};

type TeamPerformance = {
  Team_ID: number;
  Team_Name: string;
  Matches_Played: number;
  Matches_Won: number;
  Total_Runs: number;
  Win_Percentage: number | null;
};

export default function AdminAnalyticsPage() {
  const [batters, setBatters] = useState<Batter[]>([]);
  const [bowlers, setBowlers] = useState<Bowler[]>([]);
  const [averages, setAverages] = useState<AveragePlayer[]>([]);
  const [teamPerformance, setTeamPerformance] =
    useState<TeamPerformance[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        // Check Admin authentication
        const auth = await fetch("/api/auth/me");
        const authData = await auth.json();

        if (!auth.ok || authData.user?.role !== "Admin") {
          window.location.href = "/";
          return;
        }

        // Fetch all four analytics reports
        const [
          runsRes,
          wicketsRes,
          averageRes,
          teamRes,
        ] = await Promise.all([
          fetch("/api/admin/analytics/top-runs"),
          fetch("/api/admin/analytics/top-wickets"),
          fetch("/api/admin/analytics/top-average"),
          fetch("/api/admin/analytics/team-performance"),
        ]);

        const runsData = await runsRes.json();
        const wicketsData = await wicketsRes.json();
        const averageData = await averageRes.json();
        const teamData = await teamRes.json();

        if (
          !runsRes.ok ||
          !wicketsRes.ok ||
          !averageRes.ok ||
          !teamRes.ok
        ) {
          throw new Error("Failed to load analytics.");
        }

        setBatters(runsData.players);
        setBowlers(wicketsData.players);
        setAverages(averageData.players);
        setTeamPerformance(teamData.teams);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* Navigation */}
        <Link
          href="/admin/matches"
          className="text-blue-400 hover:underline"
        >
          ← Back to Admin Panel
        </Link>

        {/* Page Heading */}
        <h1 className="text-3xl font-bold mt-6">
          SQL Analytics Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Advanced cricket analytics powered by SQL Common Table Expressions.
        </p>

        {loading ? (
          <p className="mt-8 text-gray-400">
            Loading analytics...
          </p>
        ) : error ? (
          <p className="mt-8 text-red-400">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

            {/* Top Run Scorers */}
            <section className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                Top 5 Run Scorers
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="p-3">Rank</th>
                      <th className="p-3">Player</th>
                      <th className="p-3">Team</th>
                      <th className="p-3">Runs</th>
                    </tr>
                  </thead>

                  <tbody>
                    {batters.map((p, i) => (
                      <tr
                        key={p.Player_ID}
                        className="border-b border-gray-800"
                      >
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3">{p.Player_Name}</td>
                        <td className="p-3">{p.Team_Name}</td>
                        <td className="p-3 text-green-400 font-bold">
                          {p.Total_Runs}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Top Wicket Takers */}
            <section className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                Top 5 Wicket Takers
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="p-3">Rank</th>
                      <th className="p-3">Player</th>
                      <th className="p-3">Team</th>
                      <th className="p-3">Wickets</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bowlers.map((p, i) => (
                      <tr
                        key={p.Player_ID}
                        className="border-b border-gray-800"
                      >
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3">{p.Player_Name}</td>
                        <td className="p-3">{p.Team_Name}</td>
                        <td className="p-3 text-blue-400 font-bold">
                          {p.Total_Wickets}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Top Batting Averages */}
            <section className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
              <h2 className="text-xl font-bold mb-2">
                Top 5 Batting Averages
              </h2>

              <p className="text-gray-400 text-sm mb-4">
                Total runs divided by number of times dismissed.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="p-3">Rank</th>
                      <th className="p-3">Player</th>
                      <th className="p-3">Team</th>
                      <th className="p-3">Runs</th>
                      <th className="p-3">Times Out</th>
                      <th className="p-3">Average</th>
                    </tr>
                  </thead>

                  <tbody>
                    {averages.map((p, i) => (
                      <tr
                        key={p.Player_ID}
                        className="border-b border-gray-800"
                      >
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3">{p.Player_Name}</td>
                        <td className="p-3">{p.Team_Name}</td>
                        <td className="p-3">{p.Total_Runs}</td>
                        <td className="p-3">{p.Times_Out}</td>
                        <td className="p-3 text-yellow-400 font-bold">
                          {Number(p.Batting_Average).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Team-wise Performance */}
            <section className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
              <h2 className="text-xl font-bold mb-2">
                Team-wise Performance
              </h2>

              <p className="text-gray-400 text-sm mb-4">
                Match wins, matches played, total runs and win percentage.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="p-3">Team</th>
                      <th className="p-3">Played</th>
                      <th className="p-3">Won</th>
                      <th className="p-3">Total Runs</th>
                      <th className="p-3">Win %</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teamPerformance.map((team) => (
                      <tr
                        key={team.Team_ID}
                        className="border-b border-gray-800"
                      >
                        <td className="p-3 font-semibold">
                          {team.Team_Name}
                        </td>
                        <td className="p-3">
                          {team.Matches_Played}
                        </td>
                        <td className="p-3">
                          {team.Matches_Won}
                        </td>
                        <td className="p-3">
                          {team.Total_Runs}
                        </td>
                        <td className="p-3 text-green-400 font-bold">
                          {team.Win_Percentage == null
                            ? "N/A"
                            : `${Number(team.Win_Percentage).toFixed(2)}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}
      </div>
    </main>
  );
}
