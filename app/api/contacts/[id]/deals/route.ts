import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  context: { params: { id: string } } // single context argument
) {
  const { params } = context; // get id from params

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, value, stageId, closeDate } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        value: parseFloat(value),
        stageId,
        closeDate: closeDate ? new Date(closeDate) : null,
        contactId: params.id,
        userId: user.id,
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
