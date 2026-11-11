
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Player = {
  Player_ID: number;
  Player_Name: string;
  Team_Name: string;
};

type FunctionName =
  | "GetBattingAverage"
  | "GetStrikeRate"
  | "GetBowlingEconomy";

const functions = [
  {
    name: "GetBattingAverage",
    label: "Batting Average",
    description: "Calculate the selected player's batting average.",
  },
  {
    name: "GetStrikeRate",
    label: "Strike Rate",
    description: "Calculate the selected player's batting strike rate.",
  },
  {
    name: "GetBowlingEconomy",
    label: "Bowling Economy",
    description: "Calculate the selected player's bowling economy.",
  },
] as const;

export default function StoredFunctionsPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [playerId, setPlayerId] = useState("");
  const [functionName, setFunctionName] =
    useState<FunctionName>("GetBattingAverage");

  const [result, setResult] = useState<number | string | null>(null);
  const [executed, setExecuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initialize() {
      try {
        const authResponse = await fetch("/api/auth/me");

        if (!authResponse.ok) {
          router.replace("/login");
          return;
        }

        const authData = await authResponse.json();

        if (authData.user?.role !== "Admin") {
          router.replace("/");
          return;
        }

        const response = await fetch("/api/players");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load players.");
        }

        setPlayers(Array.isArray(data) ? data : data.players || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load players."
        );
      }
    }

    initialize();
  }, [router]);

  async function executeFunction() {
    if (!playerId) {
      setError("Please select a player.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setExecuted(false);

    try {
      const response = await fetch("/api/admin/stored-functions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          functionName,
          playerId: Number(playerId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Function execution failed.");
      }

      setResult(data.result);
      setExecuted(true);
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

  const selectedFunction = functions.find(
    (item) => item.name === functionName
  )!;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            CricketLens Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Stored Functions
          </h1>

          <p className="mt-2 text-gray-600">
            Execute MySQL stored functions to calculate player statistics.
          </p>
        </div>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <label className="mb-2 block font-semibold text-gray-800">
            Select Player
          </label>

          <select
            value={playerId}
            onChange={(e) => {
              setPlayerId(e.target.value);
              setResult(null);
              setExecuted(false);
              setError("");
            }}
            className="mb-5 w-full rounded-lg border p-3 text-gray-800"
          >
            <option value="">Choose a player</option>

            {players.map((player) => (
              <option
                key={player.Player_ID}
                value={player.Player_ID}
              >
                {player.Player_Name} - {player.Team_Name}
              </option>
            ))}
          </select>

          <label className="mb-2 block font-semibold text-gray-800">
            Select Stored Function
          </label>

          <select
            value={functionName}
            onChange={(e) => {
              setFunctionName(e.target.value as FunctionName);
              setResult(null);
              setExecuted(false);
              setError("");
            }}
            className="mb-4 w-full rounded-lg border p-3 text-gray-800"
          >
            {functions.map((item) => (
              <option key={item.name} value={item.name}>
                {item.label}
              </option>
            ))}
          </select>

          <p className="mb-6 text-sm text-gray-600">
            {selectedFunction.description}
          </p>

          <button
            onClick={executeFunction}
            disabled={loading || !playerId}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Execute Function"}
          </button>
        </section>

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {executed && (
          <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Function Result
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {selectedFunction.label}
            </p>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {result === null ? "N/A" : String(result)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Player:{" "}
              {players.find(
                (player) => player.Player_ID === Number(playerId)
              )?.Player_Name}
            </p>
          </section>
        )}

        <button
          onClick={() => router.push("/admin/stored-procedures")}
          className="mt-6 rounded-lg bg-gray-700 px-5 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Back to Stored Procedures
        </button>
      </div>
    </main>
  );
}
