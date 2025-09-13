import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to get the actual values
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const body = await req.json();

    // Only updating stageId here
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        stageId: body.stageId,
      },
    });

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json(
      { error: "Failed to update deal" }, 
      { status: 500 }
    );
  }
}