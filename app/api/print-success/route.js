import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "printed_labels.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
  }
}

export async function POST(req) {
  try {
    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    ensureFile();

    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const items = JSON.parse(raw);

    // OPTIONAL: avoid duplicates by QRCODE (if exists)
    if (payload.QRCODE) {
      const exists = items.find(
        (i) => i.QRCODE === payload.QRCODE
      );
      if (exists) {
        return NextResponse.json({
          success: true,
          message: "Already recorded"
        });
      }
    }

    const record = {
      ...payload,
      printed_at: new Date().toISOString()
    };

    items.push(record);

    fs.writeFileSync(
      FILE_PATH,
      JSON.stringify(items, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: "Printed label saved"
    });

  } catch (err) {
    console.error("PRINT SAVE ERROR:", err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
