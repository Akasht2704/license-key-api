import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.prnTemplate.updateMany({
    where: { userId: user.user_id },
    data: { isDefault: false }
  });

  await prisma.prnTemplate.update({
    where: { id: Number(params.id) },
    data: { isDefault: true }
  });

  return NextResponse.json({ success: true });
}
