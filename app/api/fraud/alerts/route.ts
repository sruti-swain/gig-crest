import { NextRequest, NextResponse } from "next/server";
import { readData } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const alerts = await readData("fraud_alerts.json");
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");

    let filtered = alerts;
    if (status) filtered = filtered.filter((a: any) => a.status === status);
    if (severity) filtered = filtered.filter((a: any) => a.severity === severity);

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}