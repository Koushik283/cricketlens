import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  // Verify Admin access
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
      Player_Name,
      Role,
      Batting_Style,
      Bowling_Style,
      Team_ID,
    } = body;

    // Validate required fields
    if (
      !Player_Name?.trim() ||
      !Role ||
      !Batting_Style ||
      !Bowling_Style ||
      !Number.isInteger(Number(Team_ID))
    ) {
      return NextResponse.json(
        { error: "Please provide all player details." },
        { status: 400 }
      );
    }

    // Check whether the selected team exists
    const [teams]: any = await pool.query(
      "SELECT Team_ID FROM TEAM WHERE Team_ID = ?",
      [Number(Team_ID)]
    );

    if (teams.length === 0) {
      return NextResponse.json(
        { error: "Selected team does not exist." },
        { status: 400 }
      );
    }

    // Check for duplicate player in the same team
const [existingPlayers]: any = await pool.query(
  `SELECT Player_ID
   FROM PLAYER
   WHERE LOWER(Player_Name) = LOWER(?)
   AND Team_ID = ?`,
  [Player_Name.trim(), Number(Team_ID)]
);

if (existingPlayers.length > 0) {
  return NextResponse.json(
    { error: "This player already exists in the selected team." },
    { status: 409 }
  );
}
    

    // Insert the new player
    await pool.query(
      `INSERT INTO PLAYER
       (Player_Name, Role, Batting_Style, Bowling_Style, Team_ID)
       VALUES (?, ?, ?, ?, ?)`,
      [
        Player_Name.trim(),
        Role,
        Batting_Style,
        Bowling_Style,
        Number(Team_ID),
      ]
    );

    return NextResponse.json(
      { message: "Player added successfully!" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add player error:", error);

    return NextResponse.json(
      { error: "Failed to add player." },
      { status: 500 }
    );
  }
}