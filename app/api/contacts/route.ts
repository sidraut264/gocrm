import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const contacts = await prisma.contact.findMany({
    include: {
      deals: true, // 👈 this ensures deals are fetched
    },
  });
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const body = await req.json();
  
  // Create the data object conditionally
  const data: any = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    notes: body.notes,
  };
  
  // Only add status if it exists in the request body
  if (body.status !== undefined) {
    data.status = body.status;
  }
  
  const contact = await prisma.contact.create({
    data: data,
  });
  
  return NextResponse.json(contact);
}