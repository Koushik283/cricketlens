
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CricketLensMongo");

    const feedback = await db
      .collection("match_feedback")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Feedback GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const matchId = Number(body.match_id);
    const rating = Number(body.rating);
    const userName = String(body.user_name || "").trim();
    const comment = String(body.comment || "").trim();

    if (
      !Number.isInteger(matchId) ||
      matchId < 1 ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      !userName ||
      !comment ||
      comment.length > 500
    ) {
      return NextResponse.json(
        { error: "Please provide valid feedback details." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CricketLensMongo");

    const result = await db.collection("match_feedback").insertOne({
      match_id: matchId,
      user_name: userName,
      rating,
      comment,
      tags: ["ODI"],
      created_at: new Date(),
    });

    return NextResponse.json(
      { message: "Feedback saved successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback POST error:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
