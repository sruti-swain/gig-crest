import { generateSimulatedWeather } from '@/lib/mock-weather-generator';

export async function fetchWeatherForZone(lat: number, lng: number, zoneId: string) {
  const openWeatherKey = process.env.OPENWEATHER_API_KEY;
  const aqicnKey = process.env.AQICN_API_KEY;

  try {
    let temperature = 30;
    let rainfall = 0;
    let windSpeed = 10;
    let visibility = 5;
    let weatherCondition = 'Normal';
    let aqi = 120;

    if (openWeatherKey) {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherKey}&units=metric`,
        { cache: 'no-store' }
      );
      if (weatherRes.ok) {
        const weatherJson = await weatherRes.json();
        temperature = weatherJson?.main?.temp ?? temperature;
        rainfall =
          weatherJson?.rain?.['1h'] ??
          weatherJson?.rain?.['3h'] ??
          0;
        windSpeed = weatherJson?.wind?.speed ? weatherJson.wind.speed * 3.6 : windSpeed;
        visibility = weatherJson?.visibility ? weatherJson.visibility / 1000 : visibility;
        weatherCondition = weatherJson?.weather?.[0]?.main ?? weatherCondition;
      }
    }

    if (aqicnKey) {
      const aqiRes = await fetch(
        `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${aqicnKey}`,
        { cache: 'no-store' }
      );
      if (aqiRes.ok) {
        const aqiJson = await aqiRes.json();
        aqi = aqiJson?.data?.aqi ?? aqi;
      }
    }

    return {
      zoneId,
      temperature: Math.round(temperature),
      rainfall: Math.round(rainfall),
      aqi: Math.round(aqi),
      windSpeed: Math.round(windSpeed),
      visibility: Number(visibility.toFixed(1)),
      weatherCondition,
      timestamp: new Date().toISOString(),
      source: 'live',
    };
  } catch (error) {
    const mock = generateSimulatedWeather(zoneId, 'heavy_rain', 'T1');
    return {
      ...mock,
      timestamp: new Date().toISOString(),
      source: 'mock_fallback',
    };
  }
}

export async function fetchWeatherForAllZones(zones: any[]) {
  const results = [];

  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const weather = await fetchWeatherForZone(zone.lat, zone.lng, zone.id);
    results.push(weather);

    if ((i + 1) % 10 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

export function generateMockWeather(zoneId: string, scenario: string = 'normal') {
  const scenarioMap: Record<string, any> = {
    normal: generateSimulatedWeather(zoneId, 'heavy_rain', 'T1'),
    heavy_rain: generateSimulatedWeather(zoneId, 'heavy_rain', 'T3'),
    flood: generateSimulatedWeather(zoneId, 'flood', 'T4'),
    heat_wave: generateSimulatedWeather(zoneId, 'extreme_heat', 'T4'),
    pollution: generateSimulatedWeather(zoneId, 'pollution', 'T3'),
    mixed: generateSimulatedWeather(zoneId, 'storm', 'T2'),
  };

  return {
    ...(scenarioMap[scenario] || scenarioMap.normal),
    timestamp: new Date().toISOString(),
    source: 'mock',
  };
}