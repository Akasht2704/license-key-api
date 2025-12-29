import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.prnTemplate.findMany({
    where: { userId: user.user_id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(data);
}

export async function POST(req) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { template_name, prn_text } = await req.json();

  await prisma.prnTemplate.create({
    data: {
      templateName: template_name,
      prnText: prn_text,
      userId: user.user_id
    }
  });

  return NextResponse.json({ success: true });
}
