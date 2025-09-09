import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const contact = await prisma.contact.findUnique({
    where: { id },
  });
  return NextResponse.json(contact);
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  await prisma.contact.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const body = await req.json();

  const updated = await prisma.contact.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      status: body.status,
      notes: body.notes,
    },
  });

  return NextResponse.json(updated);
}
