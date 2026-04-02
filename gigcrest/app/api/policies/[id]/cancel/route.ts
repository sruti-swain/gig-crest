// app/api/policies/[id]/cancel/route.ts
// PUT /api/policies/:id/cancel — Cancel an active policy

import { NextRequest, NextResponse } from 'next/server';
import { findById, updateById } from '@/lib/db';
import { Policy } from '@/types';

export async function PUT(
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

    if (policy.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot cancel policy with status: ${policy.status}`,
        },
        { status: 400 }
      );
    }

    const updated = updateById<Policy>('policies.json', id, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    } as Partial<Policy>);

    return NextResponse.json({
      success: true,
      data: { policy: updated },
      message: 'Policy cancelled successfully',
    });
  } catch (error) {
    console.error('PUT /api/policies/[id]/cancel error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel policy' },
      { status: 500 }
    );
  }
}