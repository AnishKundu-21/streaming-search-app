import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

/* ------------------------------------------------------------------ */
/*  POST /api/signup  →  create a new credentials-based account       */
/* ------------------------------------------------------------------ */
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    /* ── basic validation ── */
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, e-mail and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    /* ── check if the e-mail is already in use ── */
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "E-mail already registered – please sign in" },
        { status: 409 }
      );
    }

    /* ── create the user ── */
    await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password, 10), // bcrypt hash
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Sign-up error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Reject all other HTTP methods                                     */
/* ------------------------------------------------------------------ */
export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export function PUT() {
  return GET();
}
export function DELETE() {
  return GET();
}
export function PATCH() {
  return GET();
}
