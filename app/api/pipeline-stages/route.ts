import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" }, // sort by order
    });

    return NextResponse.json(stages);
  } catch (error) {
    console.error("Error fetching pipeline stages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pipeline stages" },
      { status: 500 }
    );
  }
}
