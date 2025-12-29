import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

/* =======================
   CORS CONFIG
======================= */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Electron / browser ke liye
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/* =======================
   OPTIONS (Preflight)
======================= */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/* =======================
   POST (Login API)
======================= */
export async function POST(req) {
  try {
    const { license_key } = await req.json();

    console.log("license_key--->", license_key);

    if (!/^\d{16}$/.test(license_key)) {
      return NextResponse.json(
        { success: false, message: "Invalid key" },
        { status: 400, headers: corsHeaders }
      );
    }

    const keys = await prisma.licenseKey.findMany({
      where: { isActive: true },
    });

    for (const k of keys) {
      const match = await bcrypt.compare(license_key, k.keyHash);

      if (match) {
        if (k.token) {
          return NextResponse.json(
            { success: true, token: k.token, user_id: k.id },
            { headers: corsHeaders }
          );
        }

        const token = signToken({ user_id: k.id });

        await prisma.licenseKey.update({
          where: { id: k.id },
          data: { token },
        });

        return NextResponse.json(
          { success: true, token, user_id: k.id },
          { headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Invalid license key" },
      { status: 401, headers: corsHeaders }
    );

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
