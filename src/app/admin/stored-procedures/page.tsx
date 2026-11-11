
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProcedureName =
  | "GetPlayerCareerStats"
  | "GetPlayersByTeam"
  | "GetMatchDetails"
  | "GetTopRunScorers";

type ResultRow = Record<string, string | number | boolean | null>;

const procedures = [
  {
    name: "GetPlayerCareerStats",
    description: "Retrieve career statistics for a selected player.",
    parameter: "Player ID",
    needsId: true,
  },
  {
    name: "GetPlayersByTeam",
    description: "Retrieve all players belonging to a selected team.",
    parameter: "Team ID",
    needsId: true,
  },
  {
    name: "GetMatchDetails",
    description: "Retrieve details of a selected match.",
    parameter: "Match ID",
    needsId: true,
  },
  {
    name: "GetTopRunScorers",
    description: "Retrieve the highest run scorers.",
    parameter: "Number of players",
    needsId: false,
  },
] as const;

export default function StoredProceduresPage() {
  const router = useRouter();

  const [selected, setSelected] =
    useState<ProcedureName>("GetTopRunScorers");
  const [parameter, setParameter] = useState("5");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (data.user?.role !== "Admin") {
          router.replace("/");
        }
      } catch {
        router.replace("/login");
      }
    }

    checkAdmin();
  }, [router]);

  const currentProcedure = procedures.find(
    (procedure) => procedure.name === selected
  )!;

  async function executeProcedure() {
    setLoading(true);
    setError("");
    setRows([]);
    setExecuted(false);

    try {
      const response = await fetch("/api/admin/stored-procedures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selected === "GetTopRunScorers"
            ? { procedure: selected, limit: Number(parameter) }
            : { procedure: selected, id: Number(parameter) }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Procedure execution failed.");
      }

      setRows(Array.isArray(data.rows) ? data.rows : []);
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

  const columns =
    rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            CricketLens Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Stored Procedures
          </h1>

          <p className="mt-2 text-gray-600">
            Execute predefined MySQL stored procedures and view their results.
          </p>
        </div>

        <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <label className="mb-2 block font-semibold text-gray-800">
            Select Stored Procedure
          </label>

          <select
            value={selected}
            onChange={(e) => {
              const next = e.target.value as ProcedureName;
              setSelected(next);
              setParameter(next === "GetTopRunScorers" ? "5" : "");
              setRows([]);
              setError("");
              setExecuted(false);
            }}
            className="mb-4 w-full rounded-lg border p-3 text-gray-800"
          >
            {procedures.map((procedure) => (
              <option key={procedure.name} value={procedure.name}>
                {procedure.name}
              </option>
            ))}
          </select>

          <p className="mb-5 text-sm text-gray-600">
            {currentProcedure.description}
          </p>

          <label className="mb-2 block font-semibold text-gray-800">
            {currentProcedure.parameter}
          </label>

          <input
            type="number"
            min="1"
            max={selected === "GetTopRunScorers" ? "100" : undefined}
            value={parameter}
            onChange={(e) => setParameter(e.target.value)}
            placeholder={`Enter ${currentProcedure.parameter}`}
            className="mb-5 w-full rounded-lg border p-3 text-gray-800"
          />

          <button
            onClick={executeProcedure}
            disabled={loading || !parameter || Number(parameter) <= 0}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Executing..." : "Execute Procedure"}
          </button>
        </section>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {executed && (
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Execution Results
            </h2>

            {rows.length === 0 ? (
              <p className="text-gray-500">
                Procedure executed successfully. No records found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="whitespace-nowrap border p-3 font-semibold text-gray-700"
                        >
                          {column.replaceAll("_", " ")}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {columns.map((column) => (
                          <td
                            key={column}
                            className="whitespace-nowrap border p-3 text-gray-700"
                          >
                            {row[column] === null
                              ? "—"
                              : String(row[column])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <button
          onClick={() => router.push("/admin/database-reports")}
          className="mt-6 rounded-lg bg-gray-700 px-5 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Back to Database Reports
        </button>
      </div>
    </main>
  );
}
