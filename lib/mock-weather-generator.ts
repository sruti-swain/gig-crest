export type SimulatedEventType =
  | 'heavy_rain'
  | 'flood'
  | 'extreme_heat'
  | 'pollution'
  | 'storm'
  | 'strike'
  | 'curfew';

export type SeverityTier = 'T1' | 'T2' | 'T3' | 'T4';

export interface SimulatedWeather {
  zoneId: string;
  temperature: number;
  rainfall: number;
  aqi: number;
  windSpeed: number;
  visibility: number;
  weatherCondition: string;
  source: 'simulation';
}

export function generateSimulatedWeather(
  zoneId: string,
  eventType: SimulatedEventType,
  severityTier: SeverityTier
): SimulatedWeather {
  const tierMap = {
    T1: 1,
    T2: 2,
    T3: 3,
    T4: 4,
  };

  const level = tierMap[severityTier];

  const base = {
    zoneId,
    temperature: 30,
    rainfall: 0,
    aqi: 120,
    windSpeed: 10,
    visibility: 5,
    weatherCondition: 'Normal',
    source: 'simulation' as const,
  };

  switch (eventType) {
    case 'heavy_rain':
      return {
        ...base,
        rainfall: [15, 35, 65, 110][level - 1],
        temperature: [29, 28, 26, 24][level - 1],
        aqi: [110, 105, 120, 130][level - 1],
        windSpeed: [18, 25, 45, 60][level - 1],
        visibility: [3.5, 1.8, 0.3, 0.1][level - 1],
        weatherCondition: 'Heavy Rain',
      };

    case 'flood':
      return {
        ...base,
        rainfall: [20, 55, 95, 140][level - 1],
        temperature: [28, 27, 25, 24][level - 1],
        aqi: [100, 110, 125, 145][level - 1],
        windSpeed: [20, 30, 50, 70][level - 1],
        visibility: [2.5, 1.2, 0.4, 0.1][level - 1],
        weatherCondition: 'Flood Risk Rainfall',
      };

    case 'extreme_heat':
      return {
        ...base,
        rainfall: 0,
        temperature: [42, 44, 46, 48][level - 1],
        aqi: [180, 220, 250, 300][level - 1],
        windSpeed: [8, 10, 12, 15][level - 1],
        visibility: [5, 4.5, 4.2, 4][level - 1],
        weatherCondition: 'Extreme Heat',
      };

    case 'pollution':
      return {
        ...base,
        rainfall: 0,
        temperature: [24, 22, 21, 20][level - 1],
        aqi: [320, 375, 425, 480][level - 1],
        windSpeed: [8, 5, 4, 3][level - 1],
        visibility: [2, 0.6, 0.3, 0.1][level - 1],
        weatherCondition: 'Severe Pollution',
      };

    case 'storm':
      return {
        ...base,
        rainfall: [5, 15, 30, 50][level - 1],
        temperature: [28, 27, 26, 25][level - 1],
        aqi: [120, 130, 135, 140][level - 1],
        windSpeed: [45, 70, 90, 120][level - 1],
        visibility: [2.5, 1.5, 0.7, 0.2][level - 1],
        weatherCondition: 'Storm',
      };

    case 'strike':
    case 'curfew':
      return {
        ...base,
        weatherCondition: eventType === 'strike' ? 'Strike Scenario' : 'Curfew Scenario',
      };

    default:
      return base;
  }
}