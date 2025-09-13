// app/api/deals/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  // Only updating stageId here
  const updatedDeal = await prisma.deal.update({
    where: { id },
    data: {
      stageId: body.stageId,
    },
  });

  return NextResponse.json(updatedDeal);
}
