import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(_: NextRequest, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return new Response("Invalid id", { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return new Response("Not found", { status: 404 });
    return Response.json(user);
  } catch (e) {
    console.error(e);
    return new Response("Failed to fetch user", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return new Response("Invalid id", { status: 400 });
  try {
    const body = await req.json();
    const { email, username, name } = body;
    const user = await prisma.user.update({
      where: { id },
      data: { email, username, name },
    });
    return Response.json(user);
  } catch (e: any) {
    console.error(e);
    const msg =
      e?.code === "P2002"
        ? "Unique constraint violation"
        : e?.message || "Failed to update user";
    return new Response(msg, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return new Response("Invalid id", { status: 400 });
  try {
    await prisma.user.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return new Response("Failed to delete user", { status: 500 });
  }
}
