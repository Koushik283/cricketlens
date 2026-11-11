
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const access = await requireAdmin();

  if (!access.authorized) {
    return NextResponse.json(
      { error: access.message },
      { status: access.status }
    );
  }

  try {
    const body = await request.json();

    const {
      match_date,
      series_name,
      venue_id,
      team1_id,
      team2_id,
    } = body;

    if (
      !match_date ||
      !series_name ||
      !Number.isInteger(Number(venue_id)) ||
      !Number.isInteger(Number(team1_id)) ||
      !Number.isInteger(Number(team2_id)) ||
      Number(team1_id) === Number(team2_id)
    ) {
      return NextResponse.json(
        { error: "Please provide valid match details." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO CRICKET_MATCH
       (Match_Date, Series_Name, Venue_ID, Team1_ID, Team2_ID, Status)
       VALUES (?, ?, ?, ?, ?, 'Scheduled')`,
      [
        match_date,
        series_name,
        Number(venue_id),
        Number(team1_id),
        Number(team2_id),
      ]
    );

    return NextResponse.json(
      {
        message: "Match added successfully.",
        matchId: (result as { insertId: number }).insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add match error:", error);

    return NextResponse.json(
      { error: "Could not add match. Check the supplied IDs and date." },
      { status: 500 }
    );
  }
}
