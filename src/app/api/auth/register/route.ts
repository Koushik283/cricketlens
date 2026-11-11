
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || password.length < 8) {
      return NextResponse.json(
        { error: "Enter a name, valid email and password of at least 8 characters." },
        { status: 400 }
      );
    }

    const [existing] = await pool.execute(
      "SELECT User_ID FROM APP_USER WHERE Email = ?",
      [email]
    );

    if ((existing as unknown[]).length > 0) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.execute(
      `INSERT INTO APP_USER (Name, Email, Password_Hash, Role)
       VALUES (?, ?, ?, 'Viewer')`,
      [name, email, passwordHash]
    );

    return NextResponse.json(
      { message: "Registration successful. You can now log in." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Registration failed." },
      { status: 500 }
    );
  }
}
