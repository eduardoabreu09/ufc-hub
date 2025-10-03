import { NextRequest, NextResponse } from "next/server";
import { getGroupMessages } from "@/features/groups/queries/get-group-messages";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const groupId = parseInt(id);

    const messages = await getGroupMessages(groupId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
