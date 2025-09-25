import { db } from "@/db";
import { activityOperation } from "@/db/auth-schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const activity = db
      .insert(activityOperation)
      .values({
        userId: body.userId,
        turn: body.turn,
        type: body.type,
        data: body.data,
      })
      .returning();

    const result = await activity;
    return NextResponse.json({ message: "Activity logged", activity: result });
  } catch (error) {
      return NextResponse.json({ message: "Error to save activity" });
  }

}
