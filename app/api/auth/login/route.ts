// app/api/auth/login/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { readData } from "@/lib/db";
import { generateToken, verifyOtp } from "@/lib/auth";
import type { Worker, LoginRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    // Admin demo login
    if (phone === "admin" && otp === "1234") {
      const token = await generateToken({
        workerId: "admin_001",
        phone: "admin",
        role: "admin",
      });

      return NextResponse.json({
        success: true,
        data: {
          user: { id: "admin_001", name: "Admin", phone: "admin", role: "admin" },
          token,
        },
        message: "Admin login successful",
      });
    }

    // OTP check
    if (!verifyOtp(otp)) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP. Use 1234 for demo." },
        { status: 401 }
      );
    }

    const workers = await readData<Worker>("workers.json");
    const worker = workers.find((w) => w.phone === phone);

    if (!worker) {
      return NextResponse.json(
        { success: false, error: "No account found with this phone number" },
        { status: 404 }
      );
    }

    // Only block if explicitly deactivated
    if (worker.isActive === false) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated. Contact support." },
        { status: 403 }
      );
    }

    const token = await generateToken({
      workerId: worker.id,
      phone: worker.phone,
      role: "worker",
    });

    return NextResponse.json({
      success: true,
      data: { worker, token },
      message: "Login successful",
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}