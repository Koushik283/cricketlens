
import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [venues] = await pool.query(`
      SELECT Venue_ID, Venue_Name, City, Country
      FROM VENUE
      ORDER BY Venue_Name
    `);

    return NextResponse.json(venues);
  } catch (error) {
    console.error("Venues API error:", error);

    return NextResponse.json(
      { error: "Failed to load venues." },
      { status: 500 }
    );
  }
}
