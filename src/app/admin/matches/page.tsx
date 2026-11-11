
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Team = {
  Team_ID: number;
  Team_Name: string;
};

type Venue = {
  Venue_ID: number;
  Venue_Name: string;
  City: string;
  Country: string;
};

export default function AdminMatchesPage() {
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    match_date: "",
    series_name: "",
    venue_id: "",
    team1_id: "",
    team2_id: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const authResponse = await fetch("/api/auth/me");

        if (!authResponse.ok) {
          router.replace("/login");
          return;
        }

        const authData = await authResponse.json();

        if (authData.user.role !== "Admin") {
          router.replace("/");
          return;
        }

        setIsAdmin(true);

        const [teamResponse, venueResponse] = await Promise.all([
          fetch("/api/teams"),
          fetch("/api/venues"),
        ]);

        if (!teamResponse.ok || !venueResponse.ok) {
          throw new Error("Failed to load teams or venues.");
        }

        const teamData = await teamResponse.json();
        const venueData = await venueResponse.json();

        setTeams(teamData);
        setVenues(venueData);
      } catch (error) {
        console.error(error);
        setMessage("Unable to load form data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (form.team1_id === form.team2_id) {
      setMessage("Please select two different teams.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add match.");
      }

      setMessage(`Match added successfully! Match ID: ${result.matchId}`);

      setForm({
        match_date: "",
        series_name: "",
        venue_id: "",
        team1_id: "",
        team2_id: "",
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading...
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <a
            href="/"
            className="text-sm text-emerald-400 hover:underline"
          >
            ← Back to Dashboard
          </a>

          <h1 className="mt-5 text-3xl font-bold text-emerald-400">
            Add New Match
          </h1>

          <p className="mt-2 text-slate-400">
            Admin panel - Schedule a new ODI cricket match.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Match Date
            </label>

            <input
              type="date"
              name="match_date"
              value={form.match_date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Series Name
            </label>

            <input
              type="text"
              name="series_name"
              value={form.series_name}
              onChange={handleChange}
              placeholder="Enter series name"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Venue
            </label>

            <select
              name="venue_id"
              value={form.venue_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            >
              <option value="">Select Venue</option>

              {venues.map((venue) => (
                <option key={venue.Venue_ID} value={venue.Venue_ID}>
                  {venue.Venue_Name} - {venue.City}, {venue.Country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Team 1
            </label>

            <select
              name="team1_id"
              value={form.team1_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            >
              <option value="">Select Team 1</option>

              {teams.map((team) => (
                <option key={team.Team_ID} value={team.Team_ID}>
                  {team.Team_Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Team 2
            </label>

            <select
              name="team2_id"
              value={form.team2_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            >
              <option value="">Select Team 2</option>

              {teams.map((team) => (
                <option key={team.Team_ID} value={team.Team_ID}>
                  {team.Team_Name}
                </option>
              ))}
            </select>
          </div>

          {message && (
            <p className="rounded-lg bg-slate-800 p-3 text-sm text-emerald-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-500 p-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {submitting ? "Adding Match..." : "Add Match"}
          </button>
        </form>
      </div>
    </main>
  );
}
