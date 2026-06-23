import { NextResponse } from 'next/server';
import { readData } from '@/lib/db';

export async function GET() {
  try {
    const weather =await readData<any>('weather.json');

    const latestByZone = Object.values(
      weather.reduce((acc: Record<string, any>, item: any) => {
        if (
          !acc[item.zoneId] ||
          new Date(item.timestamp).getTime() > new Date(acc[item.zoneId].timestamp).getTime()
        ) {
          acc[item.zoneId] = item;
        }
        return acc;
      }, {})
    );

    return NextResponse.json({
      success: true,
      data: { weather: latestByZone },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch current weather' },
      { status: 500 }
    );
  }
}