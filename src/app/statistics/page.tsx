
"use client";

import { useEffect, useState } from "react";

type PlayerStat = {
  Player_ID: number;
  Player_Name: string;
  Team_Name: string;
  Team_Code: string;
  Runs: number;
  Wickets: number;
  Dismissals: number;
  Balls_Faced: number;
  Runs_Conceded: number;
  Balls_Bowled: number;
  Fours: number;
  Sixes: number;
  Maidens: number;
  Matches_Played: number;
  Highest_Score: number;
  Best_Bowling: string | null;
  Batting_Average: number | null;
  Strike_Rate: number | null;
  Economy: number | null;
  Bowling_Average: number | null;
};

type TeamStat = {
  Team_ID: number;
  Team_Name: string;
  Team_Code: string;
  Players: number;
  Matches_Played: number;
  Matches_Won: number;
};

type StatisticsData = {
  players: PlayerStat[];
  teams: TeamStat[];
};

const categories = [
  "Runs",
  "Wickets",
  "Average",
  "Strike Rate",
  "Economy",
  "Highest Score",
];

export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsData>({
    players: [],
    teams: [],
  });

  const [category, setCategory] = useState("Runs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/statistics")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load statistics");
        }
        return res.json();
      })
      .then((result) => setData(result))
      .catch((err) => {
        console.error(err);
        setError("Unable to load statistics. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedPlayers = [...data.players].sort((a, b) => {
    if (category === "Runs") return Number(b.Runs) - Number(a.Runs);

    if (category === "Wickets") {
      return Number(b.Wickets) - Number(a.Wickets);
    }

    if (category === "Average") {
      return Number(b.Batting_Average ?? -1) -
        Number(a.Batting_Average ?? -1);
    }

    if (category === "Strike Rate") {
      return Number(b.Strike_Rate ?? -1) -
        Number(a.Strike_Rate ?? -1);
    }

    if (category === "Economy") {
      return Number(a.Economy ?? Infinity) -
        Number(b.Economy ?? Infinity);
    }

    return Number(b.Highest_Score) - Number(a.Highest_Score);
  });

  const getValue = (p: PlayerStat) => {
    if (category === "Runs") return p.Runs;
    if (category === "Wickets") return p.Wickets;
    if (category === "Average") return p.Batting_Average ?? "N/A";
    if (category === "Strike Rate") return p.Strike_Rate ?? "N/A";
    if (category === "Economy") return p.Economy ?? "N/A";
    return p.Highest_Score;
  };

  return (
    <main className="min-h-screen bg-[#080d18] p-8 text-white">
      <h1 className="mb-2 text-3xl font-bold">Cricket Statistics</h1>

      <p className="mb-8 text-gray-400">
        Player and team statistics calculated from completed matches.
      </p>

      {loading ? (
        <p className="text-gray-400">Loading statistics...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <h2 className="mb-4 text-xl font-semibold">
            Player Leaderboard
          </h2>

          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-lg px-5 py-2 ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "bg-[#111827] text-gray-400 hover:bg-gray-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111827] text-gray-400">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Player</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">{category}</th>
                </tr>
              </thead>

              <tbody>
                {sortedPlayers.slice(0, 10).map((p, index) => (
                  <tr
                    key={p.Player_ID}
                    className="border-t border-gray-800"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-semibold">
                      {p.Player_Name}
                    </td>
                    <td className="p-4 text-gray-400">
                      {p.Team_Code}
                    </td>
                    <td className="p-4 font-bold text-blue-400">
                      {getValue(p)}
                    </td>
                  </tr>
                ))}

                {sortedPlayers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center text-gray-400"
                    >
                      No player statistics available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 className="mb-4 mt-10 text-xl font-semibold">
            Detailed Player Statistics
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111827] text-gray-400">
                <tr>
                  <th className="p-4">Player</th>
                  <th className="p-4">Matches</th>
                  <th className="p-4">Runs</th>
                  <th className="p-4">Highest</th>
                  <th className="p-4">Average</th>
                  <th className="p-4">Strike Rate</th>
                  <th className="p-4">4s</th>
                  <th className="p-4">6s</th>
                  <th className="p-4">Wickets</th>
                  <th className="p-4">Economy</th>
                  <th className="p-4">Best Bowling</th>
                </tr>
              </thead>

              <tbody>
                {data.players.map((p) => (
                  <tr
                    key={p.Player_ID}
                    className="border-t border-gray-800"
                  >
                    <td className="p-4 font-semibold">
                      {p.Player_Name}
                    </td>
                    <td className="p-4">{p.Matches_Played}</td>
                    <td className="p-4">{p.Runs}</td>
                    <td className="p-4">{p.Highest_Score}</td>
                    <td className="p-4">
                      {p.Batting_Average ?? "N/A"}
                    </td>
                    <td className="p-4">
                      {p.Strike_Rate ?? "N/A"}
                    </td>
                    <td className="p-4">{p.Fours}</td>
                    <td className="p-4">{p.Sixes}</td>
                    <td className="p-4">{p.Wickets}</td>
                    <td className="p-4">
                      {p.Economy ?? "N/A"}
                    </td>
                    <td className="p-4">
                      {p.Best_Bowling ?? "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-4 mt-10 text-xl font-semibold">
            Team Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.teams.map((t) => (
              <div
                key={t.Team_ID}
                className="rounded-xl border border-gray-800 bg-[#111827] p-5"
              >
                <h3 className="text-lg font-bold">{t.Team_Name}</h3>

                <p className="mt-3 text-sm text-gray-400">
                  Players: {t.Players}
                </p>

                <p className="text-sm text-gray-400">
                  Matches played: {t.Matches_Played}
                </p>

                <p className="text-sm text-green-400">
                  Matches won: {t.Matches_Won}
                </p>

                <p className="mt-2 text-sm text-blue-400">
                  Win percentage:{" "}
                  {t.Matches_Played > 0
                    ? (
                        (t.Matches_Won / t.Matches_Played) *
                        100
                      ).toFixed(1) + "%"
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
