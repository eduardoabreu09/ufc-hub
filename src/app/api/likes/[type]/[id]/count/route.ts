import { NextRequest, NextResponse } from "next/server";
import { getPostLikes } from "@/features/like/queries/get-post-likes";
import { getEventLikes } from "@/features/like/queries/get-event-likes";

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
    let count = 0;
    if (type === "blog") {
      count = await getPostLikes(targetId);
    } else if (type === "event") {
      count = await getEventLikes(targetId);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
