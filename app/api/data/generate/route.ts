import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    // Import and run the generate script logic
    return NextResponse.json({
      success: true,
      message: "Use 'npm run generate:data' from terminal instead",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}