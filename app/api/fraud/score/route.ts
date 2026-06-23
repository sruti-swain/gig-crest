import { NextRequest, NextResponse } from "next/server";
import { calculateFraudScore } from "@/lib/fraud-scorer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fraud = calculateFraudScore(body);
    return NextResponse.json({ success: true, fraud });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}