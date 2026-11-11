
"use client";

import { useEffect, useState } from "react";

type Match = {
  Match_ID: number;
  Match_Date: string;
  Series_Name: string;
  Status: string;
  Team1: string;
  Team1_Code: string;
  Team2: string;
  Team2_Code: string;
  Winner: string | null;
  Venue_Name: string;
  City: string;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const filteredMatches = matches.filter((m) => {
    const text =
      `${m.Team1} ${m.Team2} ${m.Team1_Code} ${m.Team2_Code} ${m.Venue_Name} ${m.City}`
        .toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      (status === "All" || m.Status === status)
    );
  });

  return (
    <main className="min-h-screen bg-[#080d18] p-8 text-white">
      <h1 className="mb-2 text-3xl font-bold">ODI Matches</h1>
      <p className="mb-8 text-gray-400">
        Explore international cricket matches.
      </p>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search team or venue..."
          className="rounded-lg border border-gray-700 bg-[#111827] p-3"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-700 bg-[#111827] p-3"
        >
          <option value="All">All Matches</option>
          <option value="Completed">Completed</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Abandoned">Abandoned</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading matches...</p>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((m) => (
            <div
              key={m.Match_ID}
              className="rounded-xl border border-gray-800 bg-[#111827] p-5"
            >
              <div className="mb-4 flex flex-wrap justify-between gap-2">
                <span className="text-sm text-gray-400">
                  Match #{m.Match_ID} ·{" "}
                  {new Date(m.Match_Date).toLocaleDateString()}
                </span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
                  {m.Status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <h2 className="text-xl font-bold">{m.Team1_Code}</h2>
                  <p className="text-sm text-gray-400">{m.Team1}</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{m.Team2_Code}</h2>
                  <p className="text-sm text-gray-400">{m.Team2}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-800 pt-3 text-sm text-gray-400">
                <p>{m.Series_Name}</p>
                <p>{m.Venue_Name}, {m.City}</p>
                <p className="mt-2 text-green-400">
                  {m.Winner ? `Winner: ${m.Winner}` : "Result not available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredMatches.length === 0 && (
        <p className="text-gray-400">No matches found.</p>
      )}

      <p className="mt-6 text-sm text-gray-500">
        Showing {filteredMatches.length} of {matches.length} matches
      </p>
    </main>
  );
}
