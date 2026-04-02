// app/api/payments/process/route.ts
// POST /api/payments/process — Mock UPI payout
// Simulates processing a UPI payment for a claim

import { NextRequest, NextResponse } from 'next/server';
import { findById, updateById, appendData } from '@/lib/db';
import { generateId, generateTransactionId } from '@/lib/id-generator';
import { Claim, Payment, Worker } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, method = 'upi' } = body;

    if (!claimId) {
      return NextResponse.json(
        { success: false, error: 'claimId is required' },
        { status: 400 }
      );
    }

    // Find the claim
    const claim = findById<Claim>('claims.json', claimId);
    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    // Only process approved claims
    if (claim.status !== 'approved') {
      return NextResponse.json(
        {
          success: false,
          error: `Can only process payment for approved claims. Current status: ${claim.status}`,
        },
        { status: 400 }
      );
    }

    // Get worker info
    const worker = findById<Worker>('workers.json', claim.workerId);
    const now = new Date().toISOString();

    // Simulate UPI payment (mock — always succeeds with small delay)
    const payment: Payment = {
      id: generateId('payment'),
      claimId,
      workerId: claim.workerId,
      workerName: claim.workerName,
      workerPhone: worker?.phone || 'unknown',
      amount: claim.approvedPayout,
      method: method as 'upi' | 'wallet',
      upiId: body.upiId || `${claim.workerName.split(' ')[0].toLowerCase()}@paytm`,
      transactionId: generateTransactionId(),
      status: 'completed', // mock — instant success
      initiatedAt: now,
      completedAt: now,
    };

    // Save payment
    appendData('payments.json', payment);

    // Update claim to paid
    updateById<Claim>('claims.json', claimId, {
      status: 'paid',
      actualPayout: claim.approvedPayout,
      paymentMethod: method as 'upi' | 'wallet',
      paymentId: payment.transactionId,
      paidAt: now,
      updatedAt: now,
    } as Partial<Claim>);

    // Update worker totals
    if (worker) {
      updateById<Worker>('workers.json', worker.id, {
        totalPayouts: worker.totalPayouts + claim.approvedPayout,
        updatedAt: now,
      } as Partial<Worker>);
    }

    return NextResponse.json({
      success: true,
      data: { payment },
      message: `₹${claim.approvedPayout} sent to ${payment.upiId} via UPI`,
    });
  } catch (error) {
    console.error('POST /api/payments/process error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}