// app/api/claims/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { readData } from "@/lib/db";
import type { Claim } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const claims =await readData<Claim>("claims.json");

    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId");
    const status = searchParams.get("status");
    const eventId = searchParams.get("eventId");
    const claimType = searchParams.get("claimType");
    const zoneId = searchParams.get("zoneId");
    const date = searchParams.get("date");

    let filtered = claims;

    if (workerId) filtered =filtered.filter((c) => c.workerId === workerId);
    if (status) filtered = filtered.filter((c) => String(c.status) === status);
    if (eventId) filtered = filtered.filter((c) => c.eventId === eventId);

    // These only work if your stored claim objects actually have these fields
    if (claimType)
      filtered = filtered.filter((c: any) => c.claimType === claimType);

    if (zoneId)
      filtered = filtered.filter((c: any) => c.zoneId === zoneId);

    if (date) filtered = filtered.filter((c) => c.claimDate === date);

    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({
      success: true,
      data: {
        claims: filtered,
        total: filtered.length,
      },
    });
  } catch (error) {
    console.error("GET /api/claims error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}