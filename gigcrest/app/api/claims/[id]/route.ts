// app/api/claims/[id]/route.ts
// GET /api/claims/:id — Get single claim details

import { NextRequest, NextResponse } from 'next/server';
import { findById } from '@/lib/db';
import { Claim } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const claim = findById<Claim>('claims.json', id);

    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { claim },
    });
  } catch (error) {
    console.error('GET /api/claims/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claim' },
      { status: 500 }
    );
  }
}