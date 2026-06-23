export type SeverityTier = 'T1' | 'T2' | 'T3' | 'T4';

export interface WeatherInput {
  zoneId: string;
  temperature: number;
  rainfall: number;
  aqi: number;
  windSpeed: number;
  visibility?: number;
  weatherCondition?: string;
}

export interface DetectedDisruption {
  eventType: string;
  severityTier: SeverityTier;
  severityFactor: number;
  measurements: {
    temperature?: number;
    rainfall?: number;
    aqi?: number;
    windSpeed?: number;
  };
}

function getSeverityTier(
  value: number,
  ranges: { T1: [number, number]; T2: [number, number]; T3: [number, number]; T4: [number, number | null] }
): SeverityTier | null {
  if (value >= ranges.T1[0] && value <= ranges.T1[1]) return 'T1';
  if (value >= ranges.T2[0] && value <= ranges.T2[1]) return 'T2';
  if (value >= ranges.T3[0] && value <= ranges.T3[1]) return 'T3';
  if (value >= ranges.T4[0]) return 'T4';
  return null;
}

function tierToFactor(tier: SeverityTier): number {
  return {
    T1: 0.3,
    T2: 0.6,
    T3: 0.85,
    T4: 1.0,
  }[tier];
}

export function detectDisruptions(weatherData: WeatherInput): DetectedDisruption[] {
  const disruptions: DetectedDisruption[] = [];

  const rainTier = getSeverityTier(weatherData.rainfall, {
    T1: [10, 20],
    T2: [20, 50],
    T3: [50, 100],
    T4: [100, null],
  });

  if (rainTier) {
    disruptions.push({
      eventType: weatherData.rainfall > 80 ? 'flood' : 'heavy_rain',
      severityTier: rainTier,
      severityFactor: tierToFactor(rainTier),
      measurements: { rainfall: weatherData.rainfall },
    });
  }

  const tempTier = getSeverityTier(weatherData.temperature, {
    T1: [41, 43],
    T2: [43, 45],
    T3: [45, 47],
    T4: [47, null],
  });

  if (tempTier) {
    disruptions.push({
      eventType: 'extreme_heat',
      severityTier: tempTier,
      severityFactor: tierToFactor(tempTier),
      measurements: { temperature: weatherData.temperature },
    });
  }

  const aqiTier = getSeverityTier(weatherData.aqi, {
    T1: [301, 350],
    T2: [351, 400],
    T3: [401, 450],
    T4: [451, null],
  });

  if (aqiTier) {
    disruptions.push({
      eventType: 'pollution',
      severityTier: aqiTier,
      severityFactor: tierToFactor(aqiTier),
      measurements: { aqi: weatherData.aqi },
    });
  }

  const windTier = getSeverityTier(weatherData.windSpeed, {
    T1: [40, 60],
    T2: [60, 80],
    T3: [80, 100],
    T4: [100, null],
  });

  if (windTier) {
    disruptions.push({
      eventType: 'storm',
      severityTier: windTier,
      severityFactor: tierToFactor(windTier),
      measurements: { windSpeed: weatherData.windSpeed },
    });
  }

  return disruptions;
}