import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const contact = await prisma.contact.findUnique({
    where: { id },
  });
  return NextResponse.json(contact);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.contact.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  // Create update data object conditionally
  const updateData: any = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    notes: body.notes,
  };

  // Only add status if it exists in the body
  if (body.status !== undefined) {
    updateData.status = body.status;
  }

  const updated = await prisma.contact.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}