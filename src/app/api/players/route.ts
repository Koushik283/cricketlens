
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.Player_ID,
        p.Player_Name,
        p.Role,
        p.Batting_Style,
        p.Bowling_Style,
        p.Team_ID,
        t.Team_Name,
        t.Team_Code
      FROM PLAYER p
      JOIN TEAM t ON p.Team_ID = t.Team_ID
      ORDER BY p.Player_ID
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Players API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
