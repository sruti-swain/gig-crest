import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // ✅ FIXED
) {
  try {
    const { id } = await context.params; // ✅ MUST await

    const { resolution } = await req.json();
    
    const alerts = await readData<any>("fraud_alerts.json");

    const index = alerts.findIndex((a: any) => a.id === id); // ✅ use id

    if (index === -1) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    const updatedAlert = {
      ...alerts[index],
      status: "resolved",
      resolution,
      resolvedAt: new Date().toISOString(),
    };
    
    alerts[index] = updatedAlert;

    await writeData("fraud_alerts.json", alerts);
    
    return NextResponse.json({ success: true, data: updatedAlert });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}