
"use client";

import { useEffect, useState } from "react";

type Player = {
  Player_ID: number;
  Player_Name: string;
  Role: string;
  Batting_Style: string | null;
  Bowling_Style: string | null;
  Team_ID: number;
  Team_Name: string;
  Team_Code: string;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState("All");
  const [role, setRole] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const teams = [...new Set(players.map((p) => p.Team_Name))];
  const roles = [...new Set(players.map((p) => p.Role))];

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      `${p.Player_Name} ${p.Team_Name} ${p.Team_Code}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesTeam = team === "All" || p.Team_Name === team;
    const matchesRole = role === "All" || p.Role === role;

    return matchesSearch && matchesTeam && matchesRole;
  });

  return (
    <main className="min-h-screen bg-[#080d18] p-8 text-white">
      <h1 className="mb-2 text-3xl font-bold">Players</h1>
      <p className="mb-8 text-gray-400">
        Explore international cricket players.
      </p>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search players..."
          className="rounded-lg border border-gray-700 bg-[#111827] p-3"
        />

        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="rounded-lg border border-gray-700 bg-[#111827] p-3"
        >
          <option value="All">All Teams</option>
          {teams.map((t) => <option key={t}>{t}</option>)}
        </select>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-gray-700 bg-[#111827] p-3"
        >
          <option value="All">All Roles</option>
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading players...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((p) => (
            <div
              key={p.Player_ID}
              className="rounded-xl border border-gray-800 bg-[#111827] p-5"
            >
              <h2 className="text-lg font-bold">{p.Player_Name}</h2>
              <p className="mt-1 text-blue-400">
                {p.Team_Name} ({p.Team_Code})
              </p>
              <p className="mt-3 text-sm text-gray-300">{p.Role}</p>
              <p className="mt-1 text-sm text-gray-400">
                Batting: {p.Batting_Style || "Not specified"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Bowling: {p.Bowling_Style || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredPlayers.length === 0 && (
        <p className="text-gray-400">No players found.</p>
      )}

      <p className="mt-6 text-sm text-gray-500">
        Showing {filteredPlayers.length} of {players.length} players
      </p>
    </main>
  );
}
