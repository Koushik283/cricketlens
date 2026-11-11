
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Match = {
  Match_ID: number;
  Team1_ID: number;
  Team2_ID: number;
  Team1: string;
  Team2: string;
  Match_Date: string;
  Status: string;
};

type Player = {
  Player_ID: number;
  Player_Name: string;
  Role: string;
  Team_ID: number;
};

type InningsScore = {
  totalRuns: string;
  wicketsLost: string;
  ballsBowled: string;
  extras: string;
};

type PlayerStats = {
  playerId: number;
  runsScored: string;
  ballsFaced: string;
  fours: string;
  sixes: string;
  isOut: boolean;
  dismissalType: string;
  ballsBowled: string;
  runsConceded: string;
  wicketsTaken: string;
  maidens: string;
};

const emptyScore = (): InningsScore => ({
  totalRuns: "",
  wicketsLost: "",
  ballsBowled: "",
  extras: "0",
});

function emptyPlayerStats(playerId: number): PlayerStats {
  return {
    playerId,
    runsScored: "0",
    ballsFaced: "0",
    fours: "0",
    sixes: "0",
    isOut: false,
    dismissalType: "",
    ballsBowled: "0",
    runsConceded: "0",
    wicketsTaken: "0",
    maidens: "0",
  };
}

export default function MatchManagementPage() {
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchId, setMatchId] = useState("");

  const [innings, setInnings] = useState([
    emptyScore(),
    emptyScore(),
  ]);

  const [scorecards, setScorecards] = useState<PlayerStats[][]>([
    [],
    [],
  ]);

  const [winnerId, setWinnerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function initialize() {
      try {
        const authResponse = await fetch("/api/auth/me");

        if (!authResponse.ok) {
          router.replace("/login");
          return;
        }

        const authData = await authResponse.json();

        if (authData.user?.role !== "Admin") {
          router.replace("/");
          return;
        }

        const response = await fetch("/api/matches");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load matches.");
        }

        const allMatches: Match[] = Array.isArray(data)
          ? data
          : data.matches || [];

        setMatches(
          allMatches.filter(
            (match) => match.Status === "Scheduled"
          )
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load matches."
        );
      }
    }

    initialize();
  }, [router]);

  const selectedMatch = matches.find(
    (match) => String(match.Match_ID) === matchId
  );

  // Load players whenever the selected match changes.
  useEffect(() => {
    if (!matchId) {
      setPlayers([]);
      setScorecards([[], []]);
      return;
    }

    async function loadPlayers() {
      setPlayersLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/admin/matches/${matchId}/players`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load players.");
        }

        const loadedPlayers: Player[] = data;

        setPlayers(loadedPlayers);

        setScorecards([
          loadedPlayers.map((player) =>
            emptyPlayerStats(player.Player_ID)
          ),
          loadedPlayers.map((player) =>
            emptyPlayerStats(player.Player_ID)
          ),
        ]);
      } catch (err) {
        setPlayers([]);
        setScorecards([[], []]);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load players."
        );
      } finally {
        setPlayersLoading(false);
      }
    }

    loadPlayers();
  }, [matchId]);

  function updateInnings(
    index: number,
    field: keyof InningsScore,
    value: string
  ) {
    setInnings((previous) =>
      previous.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function updatePlayerStats(
    inningsIndex: number,
    playerId: number,
    field: keyof PlayerStats,
    value: string | boolean
  ) {
    setScorecards((previous) =>
      previous.map((inningsPlayers, index) =>
        index === inningsIndex
          ? inningsPlayers.map((player) =>
              player.playerId === playerId
                ? { ...player, [field]: value }
                : player
            )
          : inningsPlayers
      )
    );
  }

  function getTeamPlayers(teamId: number) {
    return players.filter((player) => player.Team_ID === teamId);
  }

  async function completeMatch(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!selectedMatch || !winnerId) {
      setError("Select a match and its winner.");
      return;
    }

    if (players.length === 0) {
      setError("No players were loaded for this match.");
      return;
    }

    const validScores = innings.every((item) =>
      [
        item.totalRuns,
        item.wicketsLost,
        item.ballsBowled,
        item.extras,
      ].every(
        (value) =>
          value !== "" &&
          Number.isInteger(Number(value)) &&
          Number(value) >= 0
      )
    );

    if (
      !validScores ||
      innings.some((item) => Number(item.wicketsLost) > 10)
    ) {
      setError("Enter valid innings scores.");
      return;
    }

    // Validate all player statistics.
    const validPlayerStats = scorecards.every((inningsPlayers) =>
      inningsPlayers.every((player) =>
        [
          player.runsScored,
          player.ballsFaced,
          player.fours,
          player.sixes,
          player.ballsBowled,
          player.runsConceded,
          player.wicketsTaken,
          player.maidens,
        ].every(
          (value) =>
            value !== "" &&
            Number.isInteger(Number(value)) &&
            Number(value) >= 0
        )
      )
    );

    if (!validPlayerStats) {
      setError("Enter valid non-negative player statistics.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/matches/${matchId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            winnerId: Number(winnerId),

            innings: [
              {
                battingTeamId: selectedMatch.Team1_ID,
                bowlingTeamId: selectedMatch.Team2_ID,
                totalRuns: Number(innings[0].totalRuns),
                wicketsLost: Number(innings[0].wicketsLost),
                ballsBowled: Number(innings[0].ballsBowled),
                extras: Number(innings[0].extras),

                scorecard: scorecards[0].map((player) => ({
                  playerId: player.playerId,
                  runsScored: Number(player.runsScored),
                  ballsFaced: Number(player.ballsFaced),
                  fours: Number(player.fours),
                  sixes: Number(player.sixes),
                  isOut: player.isOut ? 1 : 0,
                  dismissalType: player.dismissalType || null,
                  ballsBowled: Number(player.ballsBowled),
                  runsConceded: Number(player.runsConceded),
                  wicketsTaken: Number(player.wicketsTaken),
                  maidens: Number(player.maidens),
                })),
              },
              {
                battingTeamId: selectedMatch.Team2_ID,
                bowlingTeamId: selectedMatch.Team1_ID,
                totalRuns: Number(innings[1].totalRuns),
                wicketsLost: Number(innings[1].wicketsLost),
                ballsBowled: Number(innings[1].ballsBowled),
                extras: Number(innings[1].extras),

                scorecard: scorecards[1].map((player) => ({
                  playerId: player.playerId,
                  runsScored: Number(player.runsScored),
                  ballsFaced: Number(player.ballsFaced),
                  fours: Number(player.fours),
                  sixes: Number(player.sixes),
                  isOut: player.isOut ? 1 : 0,
                  dismissalType: player.dismissalType || null,
                  ballsBowled: Number(player.ballsBowled),
                  runsConceded: Number(player.runsConceded),
                  wicketsTaken: Number(player.wicketsTaken),
                  maidens: Number(player.maidens),
                })),
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not complete match."
        );
      }

      setMessage(data.message || "Match completed successfully.");

      setMatches((previous) =>
        previous.filter(
          (match) => match.Match_ID !== Number(matchId)
        )
      );

      setMatchId("");
      setWinnerId("");
      setInnings([emptyScore(), emptyScore()]);
      setPlayers([]);
      setScorecards([[], []]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function renderPlayerScorecards(
    inningsIndex: number,
    battingTeamId: number,
    bowlingTeamId: number
  ) {
    const battingPlayers = getTeamPlayers(battingTeamId);
    const bowlingPlayers = getTeamPlayers(bowlingTeamId);

    return (
      <div className="mt-6 space-y-6">
        <section>
          <h3 className="mb-3 text-lg font-bold text-gray-900">
            Batting Scorecard
          </h3>

          <div className="space-y-4">
            {battingPlayers.map((player) => {
              const stats = scorecards[inningsIndex].find(
                (item) => item.playerId === player.Player_ID
              );

              if (!stats) return null;

              return (
                <div
                  key={player.Player_ID}
                  className="rounded-lg border bg-gray-50 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {player.Player_Name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {player.Role}
                      </p>
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={stats.isOut}
                        onChange={(e) =>
                          updatePlayerStats(
                            inningsIndex,
                            player.Player_ID,
                            "isOut",
                            e.target.checked
                          )
                        }
                      />
                      Out
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {(
                      [
                        ["runsScored", "Runs"],
                        ["ballsFaced", "Balls Faced"],
                        ["fours", "Fours"],
                        ["sixes", "Sixes"],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field}>
                        <label className="mb-1 block text-xs text-gray-600">
                          {label}
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={stats[field]}
                          onChange={(e) =>
                            updatePlayerStats(
                              inningsIndex,
                              player.Player_ID,
                              field,
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border p-2"
                        />
                      </div>
                    ))}
                  </div>

                  {stats.isOut && (
                    <div className="mt-3">
                      <label className="mb-1 block text-xs text-gray-600">
                        Dismissal Type
                      </label>
                      <select
                        value={stats.dismissalType}
                        onChange={(e) =>
                          updatePlayerStats(
                            inningsIndex,
                            player.Player_ID,
                            "dismissalType",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border p-2"
                      >
                        <option value="">Select dismissal</option>
                        <option value="Bowled">Bowled</option>
                        <option value="Caught">Caught</option>
                        <option value="LBW">LBW</option>
                        <option value="Run Out">Run Out</option>
                        <option value="Stumped">Stumped</option>
                        <option value="Hit Wicket">Hit Wicket</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-bold text-gray-900">
            Bowling Scorecard
          </h3>

          <div className="space-y-4">
            {bowlingPlayers.map((player) => {
              const stats = scorecards[inningsIndex].find(
                (item) => item.playerId === player.Player_ID
              );

              if (!stats) return null;

              return (
                <div
                  key={player.Player_ID}
                  className="rounded-lg border bg-gray-50 p-4"
                >
                  <div className="mb-3">
                    <p className="font-semibold text-gray-900">
                      {player.Player_Name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {player.Role}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {(
                      [
                        ["ballsBowled", "Balls Bowled"],
                        ["runsConceded", "Runs Conceded"],
                        ["wicketsTaken", "Wickets"],
                        ["maidens", "Maidens"],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field}>
                        <label className="mb-1 block text-xs text-gray-600">
                          {label}
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={stats[field]}
                          onChange={(e) =>
                            updatePlayerStats(
                              inningsIndex,
                              player.Player_ID,
                              field,
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border p-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          CricketLens Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Match Management
        </h1>

        <p className="mb-8 mt-2 text-gray-600">
          Enter match results, player scorecards and update scheduled matches to completed.
        </p>

        <form
          onSubmit={completeMatch}
          className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-semibold text-gray-800">
              Select Scheduled Match
            </label>

            <select
              required
              value={matchId}
              onChange={(e) => {
                setMatchId(e.target.value);
                setWinnerId("");
                setInnings([emptyScore(), emptyScore()]);
                setError("");
                setMessage("");
              }}
              className="w-full rounded-lg border p-3"
            >
              <option value="">Choose a match</option>

              {matches.map((match) => (
                <option
                  key={match.Match_ID}
                  value={match.Match_ID}
                >
                  {match.Team1} vs {match.Team2} - Match #
                  {match.Match_ID}
                </option>
              ))}
            </select>

            {matches.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No scheduled matches available.
              </p>
            )}
          </div>

          {selectedMatch && (
            <>
              {playersLoading ? (
                <p className="text-gray-600">Loading players...</p>
              ) : players.length > 0 ? (
                <>
                  {[0, 1].map((index) => {
                    const battingTeamId =
                      index === 0
                        ? selectedMatch.Team1_ID
                        : selectedMatch.Team2_ID;

                    const bowlingTeamId =
                      index === 0
                        ? selectedMatch.Team2_ID
                        : selectedMatch.Team1_ID;

                    const battingTeamName =
                      index === 0
                        ? selectedMatch.Team1
                        : selectedMatch.Team2;

                    const bowlingTeamName =
                      index === 0
                        ? selectedMatch.Team2
                        : selectedMatch.Team1;

                    return (
                      <section
                        key={index}
                        className="rounded-xl border p-5"
                      >
                        <h2 className="mb-4 text-xl font-bold text-gray-900">
                          Innings {index + 1}: {battingTeamName}
                        </h2>

                        <p className="mb-4 text-sm text-gray-500">
                          Bowling team: {bowlingTeamName}
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">
                          {(
                            [
                              ["totalRuns", "Total Runs"],
                              ["wicketsLost", "Wickets Lost"],
                              ["ballsBowled", "Balls Bowled"],
                              ["extras", "Extras"],
                            ] as const
                          ).map(([field, label]) => (
                            <div key={field}>
                              <label className="mb-1 block text-sm text-gray-600">
                                {label}
                              </label>

                              <input
                                type="number"
                                min="0"
                                max={
                                  field === "wicketsLost"
                                    ? "10"
                                    : undefined
                                }
                                required
                                value={innings[index][field]}
                                onChange={(e) =>
                                  updateInnings(
                                    index,
                                    field,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border p-2"
                              />
                            </div>
                          ))}
                        </div>

                        {renderPlayerScorecards(
                          index,
                          battingTeamId,
                          bowlingTeamId
                        )}
                      </section>
                    );
                  })}

                  <div>
                    <label className="mb-2 block font-semibold text-gray-800">
                      Winning Team
                    </label>

                    <select
                      required
                      value={winnerId}
                      onChange={(e) => setWinnerId(e.target.value)}
                      className="w-full rounded-lg border p-3"
                    >
                      <option value="">Select winner</option>

                      <option value={selectedMatch.Team1_ID}>
                        {selectedMatch.Team1}
                      </option>

                      <option value={selectedMatch.Team2_ID}>
                        {selectedMatch.Team2}
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || playersLoading}
                    className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {loading ? "Saving Match..." : "Complete Match"}
                  </button>
                </>
              ) : (
                <p className="text-sm text-red-600">
                  No players found for this match.
                </p>
              )}
            </>
          )}
        </form>

        {error && (
          <p className="mt-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-5 rounded-lg bg-green-100 p-4 text-green-700">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/admin/matches")}
          className="mt-6 rounded-lg bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          Back to Admin Panel
        </button>
      </div>
    </main>
  );
}
