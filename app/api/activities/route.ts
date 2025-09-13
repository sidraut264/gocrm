import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all activities for logged-in user
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activities = await prisma.activityLog.findMany({
    where: { userId: session.user.id },
    include: { deal: true, contact: true },
  });

  return NextResponse.json(activities);
}

// CREATE activity log
export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const activity = await prisma.activityLog.create({
    data: {
      type: body.type,
      description: body.description,
      dealId: body.dealId,
      contactId: body.contactId || null,
      userId: session.user.id,
    },
  });

  return NextResponse.json(activity);
}
