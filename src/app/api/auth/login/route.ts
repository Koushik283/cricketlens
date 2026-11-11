
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `SELECT User_ID, Name, Email, Password_Hash, Role
       FROM APP_USER WHERE Email = ?`,
      [email]
    );

    const users = rows as {
      User_ID: number;
      Name: string;
      Email: string;
      Password_Hash: string;
      Role: string;
    }[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(
      password,
      user.Password_Hash
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user.User_ID,
      name: user.Name,
      email: user.Email,
      role: user.Role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.User_ID,
        name: user.Name,
        email: user.Email,
        role: user.Role,
      },
    });

    response.cookies.set("cricketlens_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}
