import { NextResponse } from 'next/server';
import { runAutoTrigger } from '@/lib/auto-trigger-pipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await runAutoTrigger(
      body.zoneId,
      body.eventType,
      body.severityTier
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to run auto-trigger pipeline' },
      { status: 500 }
    );
  }
}