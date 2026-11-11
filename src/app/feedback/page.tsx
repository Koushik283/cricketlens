
"use client";

import { useEffect, useState } from "react";

type Feedback = {
  _id: string;
  match_id: number;
  user_name: string;
  rating: number;
  comment: string;
};

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [matchId, setMatchId] = useState("1");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadFeedback() {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not load feedback.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_id: matchId,
          user_name: userName,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage("Feedback saved successfully!");
      setUserName("");
      setComment("");
      await loadFeedback();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080d18] p-8 text-white">
      <h1 className="mb-2 text-3xl font-bold">Match Feedback</h1>
      <p className="mb-8 text-gray-400">
        Share your thoughts about international matches.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mb-10 max-w-xl space-y-4 rounded-xl border border-gray-800 bg-[#111827] p-6"
      >
        <div>
          <label className="mb-2 block text-sm">Your name</label>
          <input
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">Match ID</label>
          <input
            required
            type="number"
            min="1"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} / 5
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm">Comment</label>
          <textarea
            required
            maxLength={500}
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#080d18] p-3"
            placeholder="Write your feedback..."
          />
        </div>

        <button
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Submit Feedback"}
        </button>

        {message && <p className="text-sm text-blue-400">{message}</p>}
      </form>

      <h2 className="mb-4 text-xl font-semibold">Recent Feedback</h2>

      {loading ? (
        <p className="text-gray-400">Loading feedback...</p>
      ) : feedback.length === 0 ? (
        <p className="text-gray-400">No feedback available yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {feedback.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-gray-800 bg-[#111827] p-5"
            >
              <div className="mb-2 flex justify-between">
                <h3 className="font-semibold">{item.user_name}</h3>
                <span className="text-yellow-400">
                  {"★".repeat(item.rating)}
                </span>
              </div>
              <p className="mb-2 text-sm text-blue-400">
                Match #{item.match_id}
              </p>
              <p className="text-gray-300">{item.comment}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
