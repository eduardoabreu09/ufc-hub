import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(users);
  } catch (e) {
    console.error(e);
    return new Response("Failed to fetch users", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, name } = body;
    if (!email || !username) {
      return new Response("email and username are required", { status: 400 });
    }
    const user = await prisma.user.create({ data: { email, username, name } });
    return Response.json(user, { status: 201 });
  } catch (e: any) {
    console.error(e);
    const msg =
      e?.code === "P2002"
        ? "Unique constraint violation"
        : e?.message || "Failed to create user";
    return new Response(msg, { status: 400 });
  }
}
