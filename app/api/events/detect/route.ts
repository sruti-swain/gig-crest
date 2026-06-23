import { NextResponse } from 'next/server';
import { detectDisruptions } from '@/lib/disruption-detector';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const disruptions = detectDisruptions(body);

    return NextResponse.json({
      success: true,
      data: { disruptions },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to detect disruptions' },
      { status: 500 }
    );
  }
}