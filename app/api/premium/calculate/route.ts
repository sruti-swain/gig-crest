import { NextRequest, NextResponse } from "next/server";
import { calculatePremium } from "@/lib/premium-calculator";
import { readData } from "@/lib/db";
import type { Worker, Zone } from "@/types"; // ✅ THIS FIXES ALL THE ERRORS

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workerId, zoneId } = body;

    const workers = await readData<Worker>("workers.json");
    const zones = await readData<Zone>("zones.json");

    const worker = workers.find((w) => w.id === workerId);
    const zone = zones.find((z) => z.id === zoneId);

    if (!worker) {
      return NextResponse.json(
        { success: false, error: "Worker not found" },
        { status: 404 }
      );
    }

    if (!zone) {
      return NextResponse.json(
        { success: false, error: "Zone not found" },
        { status: 404 }
      );
    }

    // ✅ Corrected call (no errors now because Worker and Zone are imported)
    const premium = calculatePremium(worker, zone);

    return NextResponse.json({
      success: true,
      data: { premium }
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}