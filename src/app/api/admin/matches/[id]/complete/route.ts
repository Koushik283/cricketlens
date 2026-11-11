
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/auth";

type PlayerScore = {
  playerId: number;
  runsScored: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  isOut: boolean | number;
  dismissalType: string | null;
  ballsBowled: number;
  runsConceded: number;
  wicketsTaken: number;
  maidens: number;
};

type InningsData = {
  battingTeamId: number;
  bowlingTeamId: number;
  totalRuns: number;
  wicketsLost: number;
  ballsBowled: number;
  extras: number;
  scorecard: PlayerScore[];
};

function isValidNonNegativeInteger(value: unknown): boolean {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    Number.isInteger(Number(value)) &&
    Number(value) >= 0
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status }
    );
  }

  let connection;

  try {
    const { id } = await params;
    const matchId = Number(id);
    const body = await request.json();

    const innings: InningsData[] = body.innings;
    const winnerId = Number(body.winnerId);

    if (
      !Number.isInteger(matchId) ||
      matchId <= 0 ||
      !Array.isArray(innings) ||
      innings.length !== 2 ||
      !Number.isInteger(winnerId) ||
      winnerId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid match, winner or innings data." },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Lock the match so it cannot be completed twice simultaneously.
    const [matches]: any = await connection.query(
      `SELECT Match_ID, Team1_ID, Team2_ID, Status
       FROM CRICKET_MATCH
       WHERE Match_ID = ?
       FOR UPDATE`,
      [matchId]
    );

    if (matches.length === 0) {
      throw new Error("Match not found.");
    }

    const match = matches[0];

    if (match.Status !== "Scheduled") {
      throw new Error("Only scheduled matches can be completed.");
    }

    const team1Id = Number(match.Team1_ID);
    const team2Id = Number(match.Team2_ID);

    const teamIds = [team1Id, team2Id];

    if (!teamIds.includes(winnerId)) {
      throw new Error("Winner must be one of the two playing teams.");
    }

    // Each team must bat exactly once, against the other team.
    for (let i = 0; i < 2; i++) {
      const item = innings[i];

      const battingTeamId = Number(item.battingTeamId);
      const bowlingTeamId = Number(item.bowlingTeamId);

      if (
        !teamIds.includes(battingTeamId) ||
        !teamIds.includes(bowlingTeamId) ||
        battingTeamId === bowlingTeamId
      ) {
        throw new Error("Invalid batting or bowling team.");
      }

      if (
        i === 1 &&
        Number(item.battingTeamId) === Number(innings[0].battingTeamId)
      ) {
        throw new Error("Both teams must bat exactly once.");
      }

      const inningsValues = [
        item.totalRuns,
        item.wicketsLost,
        item.ballsBowled,
        item.extras,
      ];

      if (
        inningsValues.some(
          (value) => !isValidNonNegativeInteger(value)
        ) ||
        Number(item.wicketsLost) > 10 ||
        Number(item.totalRuns) < Number(item.extras)
      ) {
        throw new Error("Invalid innings score.");
      }

      if (!Array.isArray(item.scorecard) || item.scorecard.length === 0) {
        throw new Error("Player scorecard data is required for both innings.");
      }

      // Validate the individual player statistics.
      const playerIds = item.scorecard.map(
        (player) => Number(player.playerId)
      );

      if (
        playerIds.some(
          (playerId) =>
            !Number.isInteger(playerId) || playerId <= 0
        ) ||
        new Set(playerIds).size !== playerIds.length
      ) {
        throw new Error("Invalid or duplicate player in scorecard.");
      }

      for (const player of item.scorecard) {
        const stats = [
          player.runsScored,
          player.ballsFaced,
          player.fours,
          player.sixes,
          player.ballsBowled,
          player.runsConceded,
          player.wicketsTaken,
          player.maidens,
        ];

        if (
          stats.some(
            (value) => !isValidNonNegativeInteger(value)
          )
        ) {
          throw new Error("Invalid player statistics.");
        }

        if (
          Number(player.fours) + Number(player.sixes) >
          Number(player.runsScored)
        ) {
          throw new Error(
            "A player's boundary runs cannot exceed their total runs."
          );
        }

        if (
          player.isOut !== true &&
          player.isOut !== false &&
          player.isOut !== 0 &&
          player.isOut !== 1
        ) {
          throw new Error("Invalid player dismissal status.");
        }
      }

      // Verify that every submitted player belongs to one of the
      // two teams participating in this match.
      const placeholders = playerIds.map(() => "?").join(",");

      const [validPlayers]: any = await connection.query(
        `SELECT Player_ID, Team_ID
         FROM PLAYER
         WHERE Player_ID IN (${placeholders})`,
        playerIds
      );

      if (validPlayers.length !== playerIds.length) {
        throw new Error("One or more players do not exist.");
      }

      const validPlayerMap = new Map(
        validPlayers.map((player: any) => [
          Number(player.Player_ID),
          Number(player.Team_ID),
        ])
      );

      for (const playerId of playerIds) {
        const playerTeamId = validPlayerMap.get(playerId);

        if (!teamIds.includes(playerTeamId as number)) {
          throw new Error(
            "A scorecard contains a player from another team."
          );
        }
      }

      // Insert the innings and retrieve its generated ID.
      const [inningsResult]: any = await connection.query(
        `INSERT INTO INNINGS
        (
          Match_ID,
          Innings_Number,
          Batting_Team_ID,
          Bowling_Team_ID,
          Total_Runs,
          Wickets_Lost,
          Balls_Bowled,
          Extras
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          matchId,
          i + 1,
          battingTeamId,
          bowlingTeamId,
          Number(item.totalRuns),
          Number(item.wicketsLost),
          Number(item.ballsBowled),
          Number(item.extras),
        ]
      );

      const inningsId = inningsResult.insertId;

      // Insert each player's batting and bowling statistics.
      for (const player of item.scorecard) {
        await connection.query(
          `INSERT INTO SCORECARD
          (
            Innings_ID,
            Player_ID,
            Runs_Scored,
            Balls_Faced,
            Fours,
            Sixes,
            Is_Out,
            Dismissal_Type,
            Balls_Bowled,
            Runs_Conceded,
            Wickets_Taken,
            Maidens
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            inningsId,
            Number(player.playerId),
            Number(player.runsScored),
            Number(player.ballsFaced),
            Number(player.fours),
            Number(player.sixes),
            player.isOut ? 1 : 0,
            player.isOut ? player.dismissalType || null : null,
            Number(player.ballsBowled),
            Number(player.runsConceded),
            Number(player.wicketsTaken),
            Number(player.maidens),
          ]
        );
      }
    }

    // Update the match only after both innings and scorecards are saved.
    await connection.query(
      `UPDATE CRICKET_MATCH
       SET Winner_ID = ?, Status = 'Completed'
       WHERE Match_ID = ?`,
      [winnerId, matchId]
    );

    await connection.commit();

    return NextResponse.json({
      message: "Match completed and player scorecards saved successfully.",
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Match completion error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to complete match.",
      },
      { status: 400 }
    );
  } finally {
    connection?.release();
  }
}
