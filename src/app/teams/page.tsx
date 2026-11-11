
"use client";

import { useEffect, useState } from "react";

type Team = {
  Team_ID: number;
  Team_Name: string;
  Team_Code: string;
  Country: string;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const filteredTeams = teams.filter((team) =>
    `${team.Team_Name} ${team.Team_Code} ${team.Country}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#080d18] p-8 text-white">
      <h1 className="mb-2 text-3xl font-bold">International Teams</h1>
      <p className="mb-8 text-gray-400">
        Explore teams registered in CricketLens.
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search teams..."
        className="mb-8 w-full max-w-md rounded-lg border border-gray-700 bg-[#111827] p-3 text-white outline-none"
      />

      {loading ? (
        <p className="text-gray-400">Loading teams...</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <div
              key={team.Team_ID}
              className="rounded-xl border border-gray-800 bg-[#111827] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">{team.Team_Name}</h2>
                <span className="rounded-lg bg-blue-500/20 px-3 py-1 text-blue-400">
                  {team.Team_Code}
                </span>
              </div>
              <p className="text-gray-400">{team.Country}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredTeams.length === 0 && (
        <p className="text-gray-400">No teams found.</p>
      )}
    </main>
  );
}
