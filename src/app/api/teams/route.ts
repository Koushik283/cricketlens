
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT Team_ID, Team_Name, Team_Code, Country
       FROM TEAM
       ORDER BY Team_ID`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("MySQL connection error:", error);

    return NextResponse.json(
      { error: "Failed to fetch teams from MySQL" },
      { status: 500 }
    );
  }
}
