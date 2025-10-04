import { db } from "@/db";
import { trucks } from "@/db/auth-schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const truck = db
      .insert(trucks)
      .values({
        userId: body.userId,
        truckNumber: body.truckNumber,
        kmFinal: body.kmFinal,
        kmInicial: body.kmInicial,
      })
      .returning();

    const result = await truck;
    return NextResponse.json({ message: "trucks logged", trucks: result });
  } catch (error) {
    return NextResponse.json({ message: "Error to save trucks" });
  }
}
