
import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/auth";

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.message },
        { status: auth.status }
      );
    }

    const [playerStats] = await pool.query(
      "SELECT * FROM PLAYER_CAREER_STATS LIMIT 10"
    );

    const [matchResults] = await pool.query(
      "SELECT * FROM MATCH_RESULTS LIMIT 10"
    );

    const [inningsSummary] = await pool.query(
      "SELECT * FROM INNINGS_SUMMARY LIMIT 10"
    );

    return NextResponse.json({
      playerStats,
      matchResults,
      inningsSummary,
    });
  } catch (error) {
    console.error("Database reports error:", error);

    return NextResponse.json(
      { error: "Failed to fetch database reports." },
      { status: 500 }
    );
  }
}
