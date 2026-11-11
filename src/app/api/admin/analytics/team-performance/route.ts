import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const access = await requireAdmin();

  if (!access.authorized) {
    return NextResponse.json(
      { error: access.message },
      { status: access.status }
    );
  }

  try {
    const [rows] = await pool.query(`
      WITH TeamMatches AS (
        SELECT
          t.Team_ID,
          t.Team_Name,

          COUNT(DISTINCT m.Match_ID) AS Matches_Played,

          COUNT(DISTINCT CASE
            WHEN m.Winner_ID = t.Team_ID THEN m.Match_ID
          END) AS Matches_Won

        FROM TEAM t
        LEFT JOIN CRICKET_MATCH m
          ON (
            m.Team1_ID = t.Team_ID
            OR m.Team2_ID = t.Team_ID
          )
          AND m.Status = 'Completed'

        GROUP BY t.Team_ID, t.Team_Name
      ),

      TeamRuns AS (
        SELECT
          batting.Team_ID,
          SUM(i.Total_Runs) AS Total_Runs
        FROM INNINGS i
        JOIN CRICKET_MATCH m
          ON i.Match_ID = m.Match_ID
        JOIN TEAM batting
          ON (
            (i.Innings_Number = 1 AND batting.Team_ID = m.Team1_ID)
            OR
            (i.Innings_Number = 2 AND batting.Team_ID = m.Team2_ID)
          )
        WHERE m.Status = 'Completed'
        GROUP BY batting.Team_ID
      )

      SELECT
        tm.Team_ID,
        tm.Team_Name,
        tm.Matches_Played,
        tm.Matches_Won,
        COALESCE(tr.Total_Runs, 0) AS Total_Runs,
        ROUND(
          tm.Matches_Won * 100.0 /
          NULLIF(tm.Matches_Played, 0),
          2
        ) AS Win_Percentage

      FROM TeamMatches tm
      LEFT JOIN TeamRuns tr
        ON tm.Team_ID = tr.Team_ID

      ORDER BY Win_Percentage DESC, Total_Runs DESC
    `);

    return NextResponse.json({
      message: "Team performance retrieved successfully.",
      teams: rows,
    });

  } catch (error) {
    console.error("Team performance error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve team performance." },
      { status: 500 }
    );
  }
}