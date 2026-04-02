// app/api/claims/[id]/approve/route.ts
// PUT /api/claims/:id/approve — Approve a claim and trigger payout

import { NextRequest, NextResponse } from 'next/server';
import { findById, updateById, appendData } from '@/lib/db';
import { generateId, generateTransactionId } from '@/lib/id-generator';
import { Claim, Payment, Worker } from '@/types';

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

    // Can only approve claims that are pending or under_review
    if (!['pending', 'under_review'].includes(claim.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot approve claim with status: ${claim.status}`,
        },
        { status: 400 }
      );
    }

    // Optional: read body for review note or payout adjustment
    let reviewNote = 'Manually approved by admin';
    let approvedPayout = claim.calculatedPayout;

    try {
      const body = await request.json();
      if (body.reviewNote) reviewNote = body.reviewNote;
      if (body.approvedPayout) approvedPayout = body.approvedPayout;
    } catch {
      // Body is optional — ignore parse errors
    }

    const now = new Date().toISOString();

    // Update claim to approved
    const updatedClaim = updateById<Claim>('claims.json', id, {
      status: 'approved',
      approvedPayout,
      reviewNote,
      reviewedBy: 'admin',
      reviewedAt: now,
      updatedAt: now,
    } as Partial<Claim>);

    // Get worker details for payment
    const worker = findById<Worker>('workers.json', claim.workerId);

    // Create a mock payment — auto-process to "paid"
    const payment: Payment = {
      id: generateId('payment'),
      claimId: id,
      workerId: claim.workerId,
      workerName: claim.workerName,
      workerPhone: worker?.phone || 'unknown',
      amount: approvedPayout,
      method: 'upi',
      upiId: `${claim.workerName.split(' ')[0].toLowerCase()}@paytm`,
      transactionId: generateTransactionId(),
      status: 'completed',
      initiatedAt: now,
      completedAt: now,
    };

    appendData('payments.json', payment);

    // Update claim to paid
    updateById<Claim>('claims.json', id, {
      status: 'paid',
      actualPayout: approvedPayout,
      paymentId: payment.transactionId,
      paidAt: now,
      updatedAt: now,
    } as Partial<Claim>);

    // Update worker's total claims and payouts
    if (worker) {
      updateById<Worker>('workers.json', worker.id, {
        totalPayouts: worker.totalPayouts + approvedPayout,
        updatedAt: now,
      } as Partial<Worker>);
    }

    return NextResponse.json({
      success: true,
      data: {
        claim: updatedClaim,
        payment,
      },
      message: `Claim approved. ₹${approvedPayout} paid via UPI.`,
    });
  } catch (error) {
    console.error('PUT /api/claims/[id]/approve error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve claim' },
      { status: 500 }
    );
  }
}