// app/api/claims/[id]/deny/route.ts
// PUT /api/claims/:id/deny — Deny a claim with reason

import { NextRequest, NextResponse } from 'next/server';
import { findById, updateById } from '@/lib/db';
import { Claim } from '@/types';

export async function PUT(
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

    // Can only deny claims that are pending or under_review
    if (!['pending', 'under_review'].includes(claim.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot deny claim with status: ${claim.status}`,
        },
        { status: 400 }
      );
    }

    // Get denial reason from body
    let reviewNote = 'Denied by admin';
    try {
      const body = await request.json();
      if (body.reviewNote) reviewNote = body.reviewNote;
    } catch {
      // Body is optional
    }

    const now = new Date().toISOString();

    const updatedClaim = updateById<Claim>('claims.json', id, {
      status: 'denied',
      approvedPayout: 0,
      actualPayout: 0,
      reviewNote,
      reviewedBy: 'admin',
      reviewedAt: now,
      updatedAt: now,
    } as Partial<Claim>);

    return NextResponse.json({
      success: true,
      data: { claim: updatedClaim },
      message: 'Claim denied',
    });
  } catch (error) {
    console.error('PUT /api/claims/[id]/deny error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to deny claim' },
      { status: 500 }
    );
  }
}