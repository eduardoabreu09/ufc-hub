import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/features/session/queries/get-current-user";

export async function GET(request: NextRequest) {
  try {
    const userResult = await getCurrentUser();

    if (userResult.isFailure) {
      return NextResponse.json({});
    }

    return NextResponse.json(userResult.getValue());
  } catch (error) {
    console.error("Error validating user", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
