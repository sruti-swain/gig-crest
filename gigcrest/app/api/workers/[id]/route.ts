// app/api/workers/[id]/route.ts
// GET  /api/workers/:id — Get single worker details
// PUT  /api/workers/:id — Update worker profile

import { NextRequest, NextResponse } from 'next/server';
import { findById, updateById } from '@/lib/db';
import { Worker } from '@/types';

// GET — Single worker by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15: params is a Promise, must await it
    const { id } = await params;
    const worker = findById<Worker>('workers.json', id);

    if (!worker) {
      return NextResponse.json(
        { success: false, error: 'Worker not found' },
        { status: 404 }
      );
    }

    // Don't expose password hash
    const {  ...safeWorker } = worker;

    return NextResponse.json({
      success: true,
      data: { worker: safeWorker },
    });
  } catch (error) {
    console.error('GET /api/workers/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch worker' },
      { status: 500 }
    );
  }
}

// PUT — Update worker profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Prevent updating sensitive fields directly
    const {   allowedUpdates } = body;

    const updated = updateById<Worker>('workers.json', id, {
      ...allowedUpdates,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Worker not found' },
        { status: 404 }
      );
    }

    const {  ...safeWorker } = updated;

    return NextResponse.json({
      success: true,
      data: { worker: safeWorker },
      message: 'Worker updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/workers/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update worker' },
      { status: 500 }
    );
  }
}