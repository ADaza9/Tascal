import { db } from "@/db";
import { trucks } from "@/db/auth-schema";
import { getCurrentUser } from "@/lib/auth-utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const truck = db
      .insert(trucks)
      .values({
        userId: body.userId,
        truckNumber:body.truckNumber,
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


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request.headers);

    if (!user) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const truckId = params.id;

    // Verificar que el camión pertenece al usuario antes de eliminar
    const truck = await db
      .select()
      .from(trucks)
      .where(eq(trucks.id, truckId))
      .limit(1);

    if (truck.length === 0) {
      return NextResponse.json(
        { message: 'Camión no encontrado' },
        { status: 404 }
      );
    }

    if (truck[0].userId !== user.id) {
      return NextResponse.json(
        { message: 'No autorizado para eliminar este camión' },
        { status: 403 }
      );
    }

    // Eliminar el camión
    await db.delete(trucks).where(eq(trucks.id, truckId));

    return NextResponse.json({ message: 'Camión eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando camión:', error);
    return NextResponse.json(
      { message: 'Error al eliminar el camión' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request.headers);

    if (!user) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const truckId = params.id;

    // Verificar que el camión pertenece al usuario
    const truck = await db
      .select()
      .from(trucks)
      .where(eq(trucks.id, truckId))
      .limit(1);

    if (truck.length === 0) {
      return NextResponse.json(
        { message: 'Camión no encontrado' },
        { status: 404 }
      );
    }

    if (truck[0].userId !== user.id) {
      return NextResponse.json(
        { message: 'No autorizado para editar este camión' },
        { status: 403 }
      );
    }

    // Actualizar el camión
    const updatedTruck = await db
      .update(trucks)
      .set({
        truckNumber: body.truckNumber,
        kmInicial: body.kmInicial,
        kmFinal: body.kmFinal,
      })
      .where(eq(trucks.id, truckId))
      .returning();

    return NextResponse.json({
      message: 'Camión actualizado exitosamente',
      truck: updatedTruck[0],
    });
  } catch (error) {
    console.error('Error actualizando camión:', error);
    return NextResponse.json(
      { message: 'Error al actualizar el camión' },
      { status: 500 }
    );
  }
}