import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(contact);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.contact.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const updated = await prisma.contact.update({
    where: { id: params.id },
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
