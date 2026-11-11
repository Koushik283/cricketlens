
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.message },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const playerId = Number(body.playerId);
    const functionName = body.functionName;

    if (!Number.isInteger(playerId) || playerId <= 0) {
      return NextResponse.json(
        { error: "Enter a valid Player ID." },
        { status: 400 }
      );
    }

    const allowedFunctions: Record<string, string> = {
      GetBattingAverage: "SELECT GetBattingAverage(?) AS Result",
      GetStrikeRate: "SELECT GetStrikeRate(?) AS Result",
      GetBowlingEconomy: "SELECT GetBowlingEconomy(?) AS Result",
    };

    const sql = allowedFunctions[functionName];

    if (!sql) {
      return NextResponse.json(
        { error: "Invalid stored function." },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(sql, [playerId]);

    return NextResponse.json({
      functionName,
      playerId,
      result: rows[0]?.Result ?? null,
    });
  } catch (error) {
    console.error("Stored function error:", error);

    return NextResponse.json(
      { error: "Failed to execute stored function." },
      { status: 500 }
    );
  }
}
