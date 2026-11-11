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
      WITH PlayerWickets AS (
        SELECT
          p.Player_ID,
          p.Player_Name,
          t.Team_Name,
          SUM(s.Wickets_Taken) AS Total_Wickets
        FROM SCORECARD s
        JOIN PLAYER p
          ON s.Player_ID = p.Player_ID
        JOIN TEAM t
          ON p.Team_ID = t.Team_ID
        GROUP BY
          p.Player_ID,
          p.Player_Name,
          t.Team_Name
      )
      SELECT
        Player_ID,
        Player_Name,
        Team_Name,
        Total_Wickets
      FROM PlayerWickets
      ORDER BY Total_Wickets DESC
      LIMIT 5
    `);

    return NextResponse.json({
      message: "Top wicket takers retrieved successfully.",
      players: rows,
    });

  } catch (error) {
    console.error("Top wickets analytics error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve top wicket takers." },
      { status: 500 }
    );
  }
}