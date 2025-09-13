// app/api/leads/[id]/convert/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leadId = params.id;

  // find the lead
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // check if this lead was already converted
  const existingContact = await prisma.contact.findFirst({
    where: { email: lead.email }, // or { leadId: leadId } if you store leadId in Contact
  });

  if (existingContact) {
    return NextResponse.json(
      { error: "Lead already converted to contact" },
      { status: 400 }
    );
  }

  // create a contact from lead data
  const contact = await prisma.contact.create({
    data: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      userId: lead.userId,
      leadId: lead.id, // if your Contact model has this relation
    },
  });

  // Instead of deleting the lead, mark it as converted
  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "converted" },
  });

  return NextResponse.json({ message: "Lead converted", contact });
}
