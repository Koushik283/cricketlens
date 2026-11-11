
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
    const { procedure, id, limit } = body;

    let sql = "";
    let params: number[] = [];

    switch (procedure) {
      case "GetPlayerCareerStats":
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
          return NextResponse.json(
            { error: "Enter a valid Player ID." },
            { status: 400 }
          );
        }
        sql = "CALL GetPlayerCareerStats(?)";
        params = [Number(id)];
        break;

      case "GetPlayersByTeam":
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
          return NextResponse.json(
            { error: "Enter a valid Team ID." },
            { status: 400 }
          );
        }
        sql = "CALL GetPlayersByTeam(?)";
        params = [Number(id)];
        break;

      case "GetMatchDetails":
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
          return NextResponse.json(
            { error: "Enter a valid Match ID." },
            { status: 400 }
          );
        }
        sql = "CALL GetMatchDetails(?)";
        params = [Number(id)];
        break;

      case "GetTopRunScorers":
        if (
          !Number.isInteger(Number(limit)) ||
          Number(limit) < 1 ||
          Number(limit) > 100
        ) {
          return NextResponse.json(
            { error: "Limit must be between 1 and 100." },
            { status: 400 }
          );
        }
        sql = "CALL GetTopRunScorers(?)";
        params = [Number(limit)];
        break;

      default:
        return NextResponse.json(
          { error: "Invalid stored procedure." },
          { status: 400 }
        );
    }

    const [result]: any = await pool.query(sql, params);

    // Extract the first result set returned by MySQL CALL.
    const rows = Array.isArray(result?.[0])
      ? result[0]
      : result;

    return NextResponse.json({ rows });
  } catch (error) {
    console.error("Stored procedure error:", error);

    return NextResponse.json(
      { error: "Failed to execute stored procedure." },
      { status: 500 }
    );
  }
}
