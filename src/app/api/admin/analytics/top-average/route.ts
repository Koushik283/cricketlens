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
      WITH PlayerAverages AS (
        SELECT
          p.Player_ID,
          p.Player_Name,
          t.Team_Name,
          SUM(s.Runs_Scored) AS Total_Runs,
          SUM(s.Is_Out) AS Times_Out,
          ROUND(
            SUM(s.Runs_Scored) / NULLIF(SUM(s.Is_Out), 0),
            2
          ) AS Batting_Average
        FROM SCORECARD s
        JOIN PLAYER p
          ON s.Player_ID = p.Player_ID
        JOIN TEAM t
          ON p.Team_ID = t.Team_ID
        GROUP BY
          p.Player_ID,
          p.Player_Name,
          t.Team_Name
        HAVING SUM(s.Is_Out) > 0
      )
      SELECT *
      FROM PlayerAverages
      ORDER BY Batting_Average DESC
      LIMIT 5
    `);

    return NextResponse.json({
      message: "Top batting averages retrieved successfully.",
      players: rows,
    });

  } catch (error) {
    console.error("Batting average analytics error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve batting averages." },
      { status: 500 }
    );
  }
}