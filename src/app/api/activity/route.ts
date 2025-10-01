import { db } from "@/db";
import { activityOperation } from "@/db/auth-schema";
import { eq } from "drizzle-orm";
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

export async function PUT (request: Request) {
  const body = await request.json();

  try {
    const activity = db
      .update(activityOperation)
      .set({
        data: body.data,
      })
      .where(eq(activityOperation.id, body.id))
      .returning();

    const result = await activity;
    return NextResponse.json({ message: "Activity updated", activity: result });
  } catch (error) {
      return NextResponse.json({ message: "Error to update activity" });
  }
}