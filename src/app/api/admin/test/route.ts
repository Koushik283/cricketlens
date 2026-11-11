
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const access = await requireAdmin();

  if (!access.authorized) {
    return NextResponse.json(
      { error: access.message },
      { status: access.status }
    );
  }

  return NextResponse.json({
    message: "Welcome Admin! You have administrative access.",
    user: access.user,
  });
}
