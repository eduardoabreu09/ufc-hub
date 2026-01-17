import { NextRequest, NextResponse } from "next/server";
import { isLikedByUser } from "@/features/like/queries/is-liked-by-user";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const { type, id } = await params;
  const targetId = parseInt(id);

  if (isNaN(targetId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    let liked = false;
    if (type === "blog") {
      liked = await isLikedByUser(targetId, undefined);
    } else if (type === "event") {
      liked = await isLikedByUser(undefined, targetId);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ liked });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
