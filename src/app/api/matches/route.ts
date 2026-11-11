
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        m.Match_ID,
        m.Match_Date,
        m.Series_Name,
        m.Team1_ID,
        m.Team2_ID,
        m.Status,
        t1.Team_Name AS Team1,
        t1.Team_Code AS Team1_Code,
        t2.Team_Name AS Team2,
        t2.Team_Code AS Team2_Code,
        w.Team_Name AS Winner,
        v.Venue_Name,
        v.City
      FROM CRICKET_MATCH m
      JOIN TEAM t1 ON m.Team1_ID = t1.Team_ID
      JOIN TEAM t2 ON m.Team2_ID = t2.Team_ID
      LEFT JOIN TEAM w ON m.Winner_ID = w.Team_ID
      JOIN VENUE v ON m.Venue_ID = v.Venue_ID
      ORDER BY m.Match_Date DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Matches API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
