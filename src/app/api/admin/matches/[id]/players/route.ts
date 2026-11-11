
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireAdmin();

  if (!access.authorized) {
    return NextResponse.json(
      { error: access.message },
      { status: access.status }
    );
  }

  try {
    const { id } = await params;
    const matchId = Number(id);

    if (!Number.isInteger(matchId) || matchId <= 0) {
      return NextResponse.json(
        { error: "Invalid match ID." },
        { status: 400 }
      );
    }

    const [matches]: any = await pool.query(
      `SELECT Team1_ID, Team2_ID
       FROM CRICKET_MATCH
       WHERE Match_ID = ?`,
      [matchId]
    );

    if (matches.length === 0) {
      return NextResponse.json(
        { error: "Match not found." },
        { status: 404 }
      );
    }

    const [players] = await pool.query(
      `SELECT
         Player_ID,
         Player_Name,
         Role,
         Team_ID
       FROM PLAYER
       WHERE Team_ID IN (?, ?)
       ORDER BY Team_ID, Player_Name`,
      [matches[0].Team1_ID, matches[0].Team2_ID]
    );

    return NextResponse.json(players);
  } catch (error) {
    console.error("Match players API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch match players." },
      { status: 500 }
    );
  }
}
