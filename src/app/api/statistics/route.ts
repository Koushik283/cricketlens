
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [players] = await pool.query(`
      SELECT
        p.Player_ID,
        p.Player_Name,
        t.Team_Name,
        t.Team_Code,

        COALESCE(stats.Runs, 0) AS Runs,
        COALESCE(stats.Wickets, 0) AS Wickets,
        COALESCE(stats.Dismissals, 0) AS Dismissals,
        COALESCE(stats.Balls_Faced, 0) AS Balls_Faced,
        COALESCE(stats.Runs_Conceded, 0) AS Runs_Conceded,
        COALESCE(stats.Balls_Bowled, 0) AS Balls_Bowled,

        COALESCE(stats.Fours, 0) AS Fours,
        COALESCE(stats.Sixes, 0) AS Sixes,
        COALESCE(stats.Maidens, 0) AS Maidens,

        COALESCE(stats.Matches_Played, 0) AS Matches_Played,
        COALESCE(stats.Highest_Score, 0) AS Highest_Score,

        stats.Best_Bowling,

        CASE
          WHEN stats.Dismissals > 0
          THEN ROUND(stats.Runs / stats.Dismissals, 2)
          ELSE NULL
        END AS Batting_Average,

        CASE
          WHEN stats.Balls_Faced > 0
          THEN ROUND(stats.Runs * 100 / stats.Balls_Faced, 2)
          ELSE NULL
        END AS Strike_Rate,

        CASE
          WHEN stats.Balls_Bowled > 0
          THEN ROUND(stats.Runs_Conceded * 6 / stats.Balls_Bowled, 2)
          ELSE NULL
        END AS Economy,

        CASE
          WHEN stats.Wickets > 0
          THEN ROUND(stats.Runs_Conceded / stats.Wickets, 2)
          ELSE NULL
        END AS Bowling_Average

      FROM PLAYER p
      JOIN TEAM t ON p.Team_ID = t.Team_ID

      LEFT JOIN (
        SELECT
          s.Player_ID,

          SUM(s.Runs_Scored) AS Runs,
          SUM(s.Wickets_Taken) AS Wickets,
          SUM(s.Is_Out) AS Dismissals,
          SUM(s.Balls_Faced) AS Balls_Faced,
          SUM(s.Runs_Conceded) AS Runs_Conceded,
          SUM(s.Balls_Bowled) AS Balls_Bowled,

          SUM(s.Fours) AS Fours,
          SUM(s.Sixes) AS Sixes,
          SUM(s.Maidens) AS Maidens,

          COUNT(DISTINCT i.Match_ID) AS Matches_Played,
          MAX(s.Runs_Scored) AS Highest_Score,

          (
            SELECT CONCAT(
              s2.Wickets_Taken,
              '/',
              s2.Runs_Conceded
            )
            FROM SCORECARD s2
            JOIN INNINGS i2
              ON s2.Innings_ID = i2.Innings_ID
            JOIN CRICKET_MATCH m2
              ON i2.Match_ID = m2.Match_ID
            WHERE
              s2.Player_ID = s.Player_ID
              AND m2.Status = 'Completed'
              AND s2.Balls_Bowled > 0
            ORDER BY
              s2.Wickets_Taken DESC,
              s2.Runs_Conceded ASC
            LIMIT 1
          ) AS Best_Bowling

        FROM SCORECARD s
        JOIN INNINGS i
          ON s.Innings_ID = i.Innings_ID
        JOIN CRICKET_MATCH m
          ON i.Match_ID = m.Match_ID

        WHERE m.Status = 'Completed'

        GROUP BY s.Player_ID
      ) stats ON p.Player_ID = stats.Player_ID

      ORDER BY Runs DESC, p.Player_Name ASC
    `);

    const [teams] = await pool.query(`
      SELECT
        t.Team_ID,
        t.Team_Name,
        t.Team_Code,

        COUNT(DISTINCT p.Player_ID) AS Players,

        COUNT(DISTINCT CASE
          WHEN m.Status = 'Completed'
          THEN m.Match_ID
        END) AS Matches_Played,

        COUNT(DISTINCT CASE
          WHEN m.Status = 'Completed'
            AND m.Winner_ID = t.Team_ID
          THEN m.Match_ID
        END) AS Matches_Won

      FROM TEAM t

      LEFT JOIN PLAYER p
        ON t.Team_ID = p.Team_ID

      LEFT JOIN CRICKET_MATCH m
        ON (
          t.Team_ID = m.Team1_ID
          OR t.Team_ID = m.Team2_ID
        )

      GROUP BY
        t.Team_ID,
        t.Team_Name,
        t.Team_Code

      ORDER BY
        Matches_Won DESC,
        t.Team_Name ASC
    `);

    return NextResponse.json({ players, teams });
  } catch (error) {
    console.error("Statistics API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
