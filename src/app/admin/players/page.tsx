"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

type Team = {
  Team_ID: number;
  Team_Name: string;
};

export default function AddPlayerPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPage() {
      const authResponse = await fetch("/api/auth/me");
      const authData = await authResponse.json();

      if (!authResponse.ok || authData.user?.role !== "Admin") {
        window.location.href = "/";
        return;
      }

      const response = await fetch("/api/teams");
      const data = await response.json();

      setTeams(Array.isArray(data) ? data : data.teams || []);
    }

    loadPage();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setMessage("");
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const player = {
      Player_Name: formData.get("Player_Name"),
      Role: formData.get("Role"),
      Batting_Style: formData.get("Batting_Style"),
      Bowling_Style: formData.get("Bowling_Style"),
      Team_ID: Number(formData.get("Team_ID")),
    };

    try {
      const response = await fetch("/api/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(player),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add player.");
      }

      setMessage(data.message);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/matches"
          className="text-blue-400 hover:underline"
        >
          ← Back to Admin Panel
        </Link>

        <h1 className="text-3xl font-bold mt-6">Add New Player</h1>
        <p className="text-gray-400 mt-2">
          Register a player under an existing team or country.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-xl p-6 mt-8 space-y-5"
        >
          <div>
            <label className="block mb-2">Player Name</label>
            <input
              name="Player_Name"
              required
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              placeholder="Enter player name"
            />
          </div>

          <div>
            <label className="block mb-2">Player Role</label>
            <select
  name="Role"
  required
  className="w-full p-3 rounded bg-gray-800 border border-gray-700"
>
  <option value="">Select role</option>
  <option value="Batter">Batter</option>
  <option value="Bowler">Bowler</option>
  <option value="All-Rounder">All-Rounder</option>
  <option value="Wicket-Keeper">Wicket-Keeper</option>
</select>
          </div>

          <div>
            <label className="block mb-2">Batting Style</label>
            <select
              name="Batting_Style"
              required
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            >
              <option value="">Select batting style</option>
              <option value="Right-handed">Right-handed</option>
              <option value="Left-handed">Left-handed</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Bowling Style</label>
            <select
              name="Bowling_Style"
              required
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            >
              <option value="">Select bowling style</option>
              <option value="Right-arm fast">Right-arm fast</option>
              <option value="Left-arm fast">Left-arm fast</option>
              <option value="Right-arm medium">Right-arm medium</option>
              <option value="Left-arm medium">Left-arm medium</option>
              <option value="Off-spin">Off-spin</option>
              <option value="Leg-spin">Leg-spin</option>
              <option value="Left-arm orthodox">Left-arm orthodox</option>
              <option value="Left-arm wrist spin">Left-arm wrist spin</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Team / Country</label>
            <select
              name="Team_ID"
              required
              defaultValue=""
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            >
              <option value="" disabled>Select team</option>
              {teams.map((team) => (
                <option key={team.Team_ID} value={team.Team_ID}>
                  {team.Team_Name}
                </option>
              ))}
            </select>
          </div>

          {message && (
            <p className="text-green-400">{message}</p>
          )}

          {error && (
            <p className="text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded-lg font-semibold"
          >
            {loading ? "Adding Player..." : "Add Player"}
          </button>
        </form>
      </div>
    </main>
  );
}