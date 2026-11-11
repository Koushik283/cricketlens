
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(user: {
  id: number;
  name: string;
  email: string;
  role: string;
}) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cricketlens_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false as const,
      status: 401,
      message: "Please log in first.",
    };
  }

  if (user.role !== "Admin") {
    return {
      authorized: false as const,
      status: 403,
      message: "Admin access required.",
    };
  }

  return {
    authorized: true as const,
    user,
  };
}