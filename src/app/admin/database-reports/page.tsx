
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ReportRow = Record<string, string | number | boolean | null>;

type Reports = {
  playerStats: ReportRow[];
  matchResults: ReportRow[];
  inningsSummary: ReportRow[];
};

export default function DatabaseReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Reports>({
    playerStats: [],
    matchResults: [],
    inningsSummary: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const authResponse = await fetch("/api/auth/me");
        if (!authResponse.ok) {
          router.replace("/login");
          return;
        }

        const data = await authResponse.json();

        if (data.user?.role !== "Admin") {
            router.replace("/");
            return;
        }

        const response = await fetch("/api/admin/database-reports");
const reportData = await response.json();

if (!response.ok) {
  throw new Error(reportData.error || "Could not load reports.");
}

setReports(reportData);

        setReports(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [router]);

    function ReportTable({
  title,
  rows = [],
}: {
  title: string;
  rows?: ReportRow[];
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const columns =
    safeRows.length > 0 ? Object.keys(safeRows[0]) : [];

    return (
      <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>

        {rows.length === 0 ? (
          <p className="text-gray-500">No records available.</p>
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
                        {row[column] === null ? "—" : String(row[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  if (loading) {
    return <main className="p-8">Loading database reports...</main>;
  }

  if (error) {
    return <main className="p-8 text-red-600">{error}</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            CricketLens Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Database Reports
          </h1>
          <p className="mt-2 text-gray-600">
            Reports generated using MySQL database views.
          </p>
        </div>

        <ReportTable
          title="Player Career Statistics"
          rows={reports.playerStats}
        />

        <ReportTable
          title="Match Results"
          rows={reports.matchResults}
        />

        <ReportTable
          title="Innings Summary"
          rows={reports.inningsSummary}
        />

        <button
          onClick={() => router.push("/admin/analytics")}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to SQL Analytics
        </button>
      </div>
    </main>
  );
}
