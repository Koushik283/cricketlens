
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [stats] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM TEAM) AS totalTeams,
        (SELECT COUNT(*) FROM PLAYER) AS totalPlayers,
        (SELECT COUNT(*) FROM CRICKET_MATCH) AS totalMatches,
        (SELECT COUNT(*) FROM CRICKET_MATCH
         WHERE Status = 'Completed') AS completedMatches
    `);

    const [recentMatches] = await pool.query(`
      SELECT
        m.Match_ID AS id,
        DATE_FORMAT(m.Match_Date, '%d %b %Y') AS matchDate,
        t1.Team_Name AS team1,
        t2.Team_Name AS team2,
        m.Status AS status,
        w.Team_Name AS winner,
        (
          SELECT CONCAT(i.Total_Runs, '/', i.Wickets_Lost)
          FROM INNINGS i
          WHERE i.Match_ID = m.Match_ID
            AND i.Batting_Team_ID = m.Team1_ID
          LIMIT 1
        ) AS score1,
        (
          SELECT CONCAT(i.Total_Runs, '/', i.Wickets_Lost)
          FROM INNINGS i
          WHERE i.Match_ID = m.Match_ID
            AND i.Batting_Team_ID = m.Team2_ID
          LIMIT 1
        ) AS score2
      FROM CRICKET_MATCH m
      JOIN TEAM t1 ON m.Team1_ID = t1.Team_ID
      JOIN TEAM t2 ON m.Team2_ID = t2.Team_ID
      LEFT JOIN TEAM w ON m.Winner_ID = w.Team_ID
      ORDER BY m.Match_Date DESC, m.Match_ID DESC
      LIMIT 3
    `);

    const [topPlayers] = await pool.query(`
      SELECT
        p.Player_Name AS name,
        t.Team_Name AS team,
        SUM(s.Runs_Scored) AS runs
      FROM SCORECARD s
      JOIN PLAYER p ON s.Player_ID = p.Player_ID
      JOIN TEAM t ON p.Team_ID = t.Team_ID
      GROUP BY p.Player_ID, p.Player_Name, t.Team_Name
      ORDER BY runs DESC
      LIMIT 4
    `);

    return NextResponse.json({
      stats: (stats as Record<string, number>[])[0],
      recentMatches,
      topPlayers,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { error: "Failed to load dashboard data." },
      { status: 500 }
    );
  }
}
