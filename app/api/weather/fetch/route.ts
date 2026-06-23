import { NextResponse } from 'next/server';
import { appendData, readData } from '@/lib/db';
import { fetchWeatherForAllZones } from '@/lib/weather-service';

export async function POST() {
  try {
    const zones = await readData<any>('zones.json');
    const weatherList = await fetchWeatherForAllZones(zones);

    for (const weather of weatherList) {
      appendData('weather.json', weather);
    }

    return NextResponse.json({
      success: true,
      data: {
        count: weatherList.length,
        weather: weatherList,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}