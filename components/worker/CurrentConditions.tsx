"use client";

import React from "react";
import { CloudRain, Sun, Wind, AlertTriangle, CheckCircle2, Cloud } from "lucide-react";

interface CurrentWeather {
  temperature?: number;
  rainfall?: number;
  aqi?: number;
  weatherCondition?: string;
  windSpeed?: number;
}

interface CurrentConditionsProps {
  weather?: CurrentWeather | null;
}

const getSafetyStatus = (weather?: CurrentWeather | null) => {
  if (!weather) {
    return {
      label: "No Data",
      color: "#64748b",
      bg: "#f1f5f9",
      icon: AlertTriangle,
      message: "Weather data not available right now."
    };
  }

  const rainfall = weather.rainfall ?? 0;
  const temperature = weather.temperature ?? 0;
  const aqi = weather.aqi ?? 0;

  if (rainfall >= 50 || temperature >= 45 || aqi >= 350) {
    return {
      label: "High Risk",
      color: "#dc2626",
      bg: "#fee2e2",
      icon: AlertTriangle,
      message: "Severe weather conditions detected. Coverage may apply."
    };
  }

  if (rainfall >= 20 || temperature >= 40 || aqi >= 200) {
    return {
      label: "Caution",
      color: "#d97706",
      bg: "#fef3c7",
      icon: AlertTriangle,
      message: "Conditions may affect delivery work. Stay alert."
    };
  }

  return {
    label: "Safe",
    color: "#16a34a",
    bg: "#dcfce7",
    icon: CheckCircle2,
    message: "Conditions look manageable for work."
  };
};

const CurrentConditions: React.FC<CurrentConditionsProps> = ({ weather }) => {
  const status = getSafetyStatus(weather);
  const StatusIcon = status.icon;

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        marginBottom: "20px"
      }}
    >
      <h3
        style={{
          fontSize: "1.1rem",
          marginBottom: "16px",
          color: "#1a1a1a",
          fontWeight: 700
        }}
      >
        🌤️ Current Conditions
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "16px"
        }}
      >
        <div
          style={{
            padding: "14px",
            borderRadius: "12px",
            background: "#f8fafc",
            textAlign: "center"
          }}
        >
          <Sun size={20} color="#f59e0b" style={{ marginBottom: "6px" }} />
          <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Temp</div>
          <div style={{ fontWeight: 700, color: "#1a1a1a" }}>
            {weather?.temperature ?? "--"}°C
          </div>
        </div>

        <div
          style={{
            padding: "14px",
            borderRadius: "12px",
            background: "#f8fafc",
            textAlign: "center"
          }}
        >
          <CloudRain size={20} color="#2563eb" style={{ marginBottom: "6px" }} />
          <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Rain</div>
          <div style={{ fontWeight: 700, color: "#1a1a1a" }}>
            {weather?.rainfall ?? "--"} mm
          </div>
        </div>

        <div
          style={{
            padding: "14px",
            borderRadius: "12px",
            background: "#f8fafc",
            textAlign: "center"
          }}
        >
          <Cloud size={20} color="#7c3aed" style={{ marginBottom: "6px" }} />
          <div style={{ fontSize: "0.78rem", color: "#64748b" }}>AQI</div>
          <div style={{ fontWeight: 700, color: "#1a1a1a" }}>
            {weather?.aqi ?? "--"}
          </div>
        </div>

        <div
          style={{
            padding: "14px",
            borderRadius: "12px",
            background: "#f8fafc",
            textAlign: "center"
          }}
        >
          <Wind size={20} color="#0f766e" style={{ marginBottom: "6px" }} />
          <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Wind</div>
          <div style={{ fontWeight: 700, color: "#1a1a1a" }}>
            {weather?.windSpeed ?? "--"} km/h
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px",
          borderRadius: "12px",
          background: status.bg
        }}
      >
        <StatusIcon size={18} color={status.color} />
        <div>
          <div
            style={{
              fontWeight: 700,
              color: status.color,
              fontSize: "0.95rem"
            }}
          >
            {status.label}
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#475569",
              marginTop: "2px"
            }}
          >
            {status.message}
          </div>
        </div>
      </div>

      {weather?.weatherCondition && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "0.85rem",
            color: "#64748b"
          }}
        >
          Current weather: <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{weather.weatherCondition}</span>
        </div>
      )}
    </div>
  );
};

export default CurrentConditions;