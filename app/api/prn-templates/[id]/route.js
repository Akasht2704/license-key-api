import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { template_name, prn_text } = await req.json();

  await prisma.prnTemplate.update({
    where: { id: Number(params.id), userId: user.user_id },
    data: { templateName: template_name, prnText: prn_text }
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req, { params }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.prnTemplate.delete({
    where: { id: Number(params.id), userId: user.user_id }
  });

  return NextResponse.json({ success: true });
}
