// app/api/premium/calculate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readData } from "@/lib/db";
import { calculatePremium } from "@/lib/premium-calculator";
import type { Worker, Zone } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workerId, zoneId } = body;

    // Validate required fields
    if (!workerId || !zoneId) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: workerId, zoneId' 
      }, { status: 400 });
    }

    // Fetch worker and zone data asynchronously
    const workers = await readData<Worker>('workers.json');
    const zones = await readData<Zone>('zones.json');

    const worker = workers.find(w => w.id === workerId);
    if (!worker) {
      return NextResponse.json({ 
        success: false,
        error: 'Worker not found' 
      }, { status: 404 });
    }

    const zone = zones.find(z => z.id === zoneId);
    if (!zone) {
      return NextResponse.json({ 
        success: false,
        error: 'Zone not found' 
      }, { status: 404 });
    }

    // calculatePremium is still synchronous - no await needed
    const premium = calculatePremium(worker, zone);
    
    return NextResponse.json({ 
      success: true, 
      data: premium 
    });
    
  } catch (error: any) {
    console.error('Premium calculation error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to calculate premium' 
    }, { status: 500 });
  }
}