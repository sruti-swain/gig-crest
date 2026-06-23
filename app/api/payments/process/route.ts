// app/api/payments/process/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { findById, updateById, appendData } from "@/lib/db";
import { generateId, generateTransactionId } from "@/lib/id-generator";
import type { Claim, Payment, Worker, PaymentMethod } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, method = "upi", upiId } = body as {
      claimId?: string;
      method?: PaymentMethod;
      upiId?: string;
    };

    if (!claimId) {
      return NextResponse.json(
        { success: false, error: "claimId is required" },
        { status: 400 }
      );
    }

    const claim = await findById<Claim>("claims.json", claimId);
    if (!claim) {
      return NextResponse.json(
        { success: false, error: "Claim not found" },
        { status: 404 }
      );
    }

    if (claim.status !== "approved") {
      return NextResponse.json(
        {
          success: false,
          error: `Can only process payment for approved claims. Current status: ${claim.status}`,
        },
        { status: 400 }
      );
    }

    const worker = await findById<Worker>("workers.json", claim.workerId);
    const now = new Date().toISOString();

    const resolvedUpi =
      upiId ||
      (worker?.upiId ??
        `${claim.workerName.split(" ")[0].toLowerCase()}@paytm`);

    const payment: Payment = {
      id: generateId("payment"),
      claimId,
      workerId: claim.workerId,
      workerName: claim.workerName,
      workerPhone: worker?.phone,

      amount: claim.approvedPayout,
      method,
      upiId: resolvedUpi,
      transactionId: generateTransactionId(),

      status: "completed",
      initiatedAt: now,
      completedAt: now,
    };

    appendData("payments.json", payment);

    // Update claim
    updateById<Claim>("claims.json", claimId, {
      status: "paid",
      paymentStatus: "completed",
      actualPayout: claim.approvedPayout,
      paymentMethod: method,
      paymentId: payment.id,
      paidAt: now,
      updatedAt: now,
    });

    // Update worker totals (optional fields)
    if (worker) {
      updateById<Worker>("workers.json", worker.id, {
        totalPayouts: (worker.totalPayouts ?? 0) + claim.approvedPayout,
        updatedAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      data: { payment },
      message: `₹${claim.approvedPayout} sent to ${payment.upiId} via ${method.toUpperCase()}`,
    });
  } catch (error) {
    console.error("POST /api/payments/process error:", error);
    return NextResponse.json(
      { success: false, error: "Payment processing failed" },
      { status: 500 }
    );
  }
}