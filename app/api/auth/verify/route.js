import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

/* =======================
   CORS CONFIG
======================= */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Electron / browser
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
   GET (Verify Token)
======================= */
export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) throw new Error("No auth header");

    const token = auth.replace("Bearer ", "");
    const data = verifyToken(token);

    return NextResponse.json(
      { valid: true, user_id: data.user_id },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { valid: false },
      { status: 401, headers: corsHeaders }
    );
  }
}
