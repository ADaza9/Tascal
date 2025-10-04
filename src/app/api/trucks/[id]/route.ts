import { db } from "@/db";
import { trucks } from "@/db/auth-schema";
import { getCurrentUser } from "@/lib/auth-utils";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(await headers());

    if (!user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar que el camión pertenece al usuario antes de eliminar
    const truck = await db
      .select()
      .from(trucks)
      .where(eq(trucks.id, id))
      .limit(1);

    if (truck.length === 0) {
      return NextResponse.json(
        { message: "Camión no encontrado" },
        { status: 404 }
      );
    }

    if (truck[0].userId !== user.id) {
      return NextResponse.json(
        { message: "No autorizado para eliminar este camión" },
        { status: 403 }
      );
    }

    // Eliminar el camión
    await db.delete(trucks).where(eq(trucks.id, id));

    return NextResponse.json({ message: "Camión eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando camión:", error);
    return NextResponse.json(
      { message: "Error al eliminar el camión" },
      { status: 500 }
    );
  }
}



export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(await headers());

    if (!user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = await params;

    const truck = await db
      .select()
      .from(trucks)
      .where(eq(trucks.id, id))
      .limit(1);

    if (truck.length === 0) {
      return NextResponse.json(
        { message: "Camión no encontrado" },
        { status: 404 }
      );
    }

    if (truck[0].userId !== user.id) {
      return NextResponse.json(
        { message: "No autorizado para editar este camión" },
        { status: 403 }
      );
    }

    const updatedTruck = await db
      .update(trucks)
      .set({
        truckNumber: body.truckNumber,
        kmInicial: body.kmInicial,
        kmFinal: body.kmFinal,
      })
      .where(eq(trucks.id, id))
      .returning();

    return NextResponse.json({
      message: "Camión actualizado exitosamente",
      truck: updatedTruck[0],
    });
  } catch (error) {
    console.error("Error actualizando camión:", error);
    return NextResponse.json(
      { message: "Error al actualizar el camión" },
      { status: 500 }
    );
  }
}
