// app/api/auth/register/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { appendData, existsByField } from "@/lib/db";
import { generateId } from "@/lib/id-generator";
import { generateToken } from "@/lib/auth";
import type { Worker, RegisterRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterRequest;

    const {
      name,
      phone,
      city,
      primaryZoneId,
      deliveryPlatform,
      vehicleType,
      upiId,
    } = body;

    if (
      !name ||
      !phone ||
      !city ||
      !primaryZoneId ||
      !deliveryPlatform ||
      !vehicleType ||
      !upiId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: name, phone, city, primaryZoneId, deliveryPlatform, vehicleType, upiId",
        },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Phone must be exactly 10 digits" },
        { status: 400 }
      );
    }

    if (await existsByField<Worker>("workers.json", "phone", phone)) {
      return NextResponse.json(
        { success: false, error: "Phone number already registered" },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const workerId = generateId("worker");

    const newWorker: Worker = {
      id: workerId,
      name,
      phone,
      city,
      primaryZoneId,
      deliveryPlatform,
      vehicleType,

      avgDailyEarning: body.avgDailyEarning ?? 750,
      hoursPerDay: body.hoursPerDay ?? 10,
      daysPerWeek: body.daysPerWeek ?? 6,
      experienceMonths: body.experienceMonths ?? 6,

      upiId,
      createdAt: now,
      isActive: true,
    };

    await appendData("workers.json", newWorker);

    const token = await generateToken({
      workerId,
      phone,
      role: "worker",
    });

    return NextResponse.json(
      {
        success: true,
        data: { worker: newWorker, token },
        message: "Registration successful",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}