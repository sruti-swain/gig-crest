// app/api/policies/[id]/route.ts
// GET /api/policies/:id — Get single policy details

import { NextRequest, NextResponse } from 'next/server';
import { findById } from '@/lib/db';
import { Policy } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const policy = findById<Policy>('policies.json', id);

    if (!policy) {
      return NextResponse.json(
        { success: false, error: 'Policy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { policy },
    });
  } catch (error) {
    console.error('GET /api/policies/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch policy' },
      { status: 500 }
    );
  }
}