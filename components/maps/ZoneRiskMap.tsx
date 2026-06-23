'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ── Hardcoded 20 zones from PDF (Person 5 generates these) ──────────────
const ZONES = [
  // Mumbai
  { id: 'zone_001', name: 'Andheri East', city: 'Mumbai', lat: 19.1136, lng: 72.8697, risk: 'orange', activeEvent: true, workers: 45, policies: 38, event: 'Heavy Rain (T3)', claims: 23, payout: 5200 },
  { id: 'zone_002', name: 'Bandra West', city: 'Mumbai', lat: 19.0596, lng: 72.8295, risk: 'green', activeEvent: false, workers: 32, policies: 28, event: null, claims: 0, payout: 0 },
  { id: 'zone_003', name: 'Powai', city: 'Mumbai', lat: 19.1197, lng: 72.9051, risk: 'yellow', activeEvent: false, workers: 28, policies: 22, event: null, claims: 0, payout: 0 },
  { id: 'zone_004', name: 'Kurla', city: 'Mumbai', lat: 19.0726, lng: 72.8847, risk: 'red', activeEvent: true, workers: 51, policies: 44, event: 'Flood (T4)', claims: 9, payout: 4800 },
  { id: 'zone_005', name: 'Dadar', city: 'Mumbai', lat: 19.0178, lng: 72.8478, risk: 'green', activeEvent: false, workers: 39, policies: 31, event: null, claims: 0, payout: 0 },
  { id: 'zone_006', name: 'Malad West', city: 'Mumbai', lat: 19.1874, lng: 72.8481, risk: 'yellow', activeEvent: false, workers: 25, policies: 20, event: null, claims: 0, payout: 0 },
  // Delhi
  { id: 'zone_007', name: 'Connaught Place', city: 'Delhi', lat: 28.6315, lng: 77.2167, risk: 'green', activeEvent: false, workers: 30, policies: 25, event: null, claims: 0, payout: 0 },
  { id: 'zone_008', name: 'Rohini', city: 'Delhi', lat: 28.7041, lng: 77.1025, risk: 'orange', activeEvent: true, workers: 42, policies: 36, event: 'AQI Pollution (T2)', claims: 15, payout: 2100 },
  { id: 'zone_009', name: 'Dwarka', city: 'Delhi', lat: 28.5921, lng: 77.0460, risk: 'yellow', activeEvent: false, workers: 33, policies: 27, event: null, claims: 0, payout: 0 },
  { id: 'zone_010', name: 'Lajpat Nagar', city: 'Delhi', lat: 28.5700, lng: 77.2373, risk: 'green', activeEvent: false, workers: 27, policies: 22, event: null, claims: 0, payout: 0 },
  { id: 'zone_011', name: 'Saket', city: 'Delhi', lat: 28.5244, lng: 77.2066, risk: 'green', activeEvent: false, workers: 19, policies: 15, event: null, claims: 0, payout: 0 },
  { id: 'zone_012', name: 'Karol Bagh', city: 'Delhi', lat: 28.6514, lng: 77.1907, risk: 'yellow', activeEvent: false, workers: 36, policies: 29, event: null, claims: 0, payout: 0 },
  // Bangalore
  { id: 'zone_013', name: 'Koramangala', city: 'Bangalore', lat: 12.9352, lng: 77.6245, risk: 'green', activeEvent: false, workers: 55, policies: 47, event: null, claims: 0, payout: 0 },
  { id: 'zone_014', name: 'Indiranagar', city: 'Bangalore', lat: 12.9784, lng: 77.6408, risk: 'yellow', activeEvent: false, workers: 41, policies: 35, event: null, claims: 0, payout: 0 },
  { id: 'zone_015', name: 'Bellandur', city: 'Bangalore', lat: 12.9257, lng: 77.6760, risk: 'red', activeEvent: true, workers: 38, policies: 31, event: 'Flood (T4)', claims: 9, payout: 4800 },
  { id: 'zone_016', name: 'Whitefield', city: 'Bangalore', lat: 12.9698, lng: 77.7499, risk: 'green', activeEvent: false, workers: 29, policies: 24, event: null, claims: 0, payout: 0 },
  { id: 'zone_017', name: 'HSR Layout', city: 'Bangalore', lat: 12.9121, lng: 77.6446, risk: 'yellow', activeEvent: false, workers: 34, policies: 28, event: null, claims: 0, payout: 0 },
  { id: 'zone_018', name: 'Marathahalli', city: 'Bangalore', lat: 12.9592, lng: 77.6974, risk: 'green', activeEvent: false, workers: 22, policies: 18, event: null, claims: 0, payout: 0 },
  { id: 'zone_019', name: 'Electronic City', city: 'Bangalore', lat: 12.8399, lng: 77.6770, risk: 'orange', activeEvent: true, workers: 47, policies: 39, event: 'Extreme Heat (T3)', claims: 12, payout: 3100 },
  { id: 'zone_020', name: 'JP Nagar', city: 'Bangalore', lat: 12.9074, lng: 77.5939, risk: 'green', activeEvent: false, workers: 18, policies: 14, event: null, claims: 0, payout: 0 },
];

const riskColor: Record<string, string> = {
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
};

const riskLabel: Record<string, string> = {
  green: '🟢 Safe',
  yellow: '🟡 Watch',
  orange: '🟠 Moderate',
  red: '🔴 Severe',
};

// City zoom presets from PDF
const CITY_PRESETS = [
  { label: 'All India', lat: 20.5937, lng: 78.9629, zoom: 5 },
  { label: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 12 },
  { label: 'Delhi', lat: 28.6139, lng: 77.2090, zoom: 12 },
  { label: 'Bangalore', lat: 12.9716, lng: 77.5946, zoom: 12 },
];

// Helper component to fly to city
function FlyTo({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.5 });
  }, [lat, lng, zoom, map]);
  return null;
}

export default function ZoneRiskMap() {
  const [selectedCity, setSelectedCity] = useState(CITY_PRESETS[0]);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filtered = filterRisk === 'all'
    ? ZONES
    : ZONES.filter(z => z.risk === filterRisk);

  return (
    <div className="relative w-full h-full">
      {/* MAP CONTROLS — top right */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-lg p-3 flex gap-2 flex-wrap">
          {CITY_PRESETS.map((city) => (
            <button
              key={city.label}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCity.label === city.label
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER CONTROLS — top left */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="bg-white rounded-xl shadow-lg p-3 flex gap-2 flex-wrap">
          {['all', 'green', 'yellow', 'orange', 'red'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterRisk === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'All Zones' : riskLabel[r]}
            </button>
          ))}
        </div>
      </div>

      {/* THE MAP */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo lat={selectedCity.lat} lng={selectedCity.lng} zoom={selectedCity.zoom} />

        {filtered.map((zone) => (
          <CircleMarker
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.activeEvent ? 18 : 12}
            pathOptions={{
              color: riskColor[zone.risk],
              fillColor: riskColor[zone.risk],
              fillOpacity: 0.6,
              weight: zone.activeEvent ? 3 : 1,
            }}
          >
            <Popup>
              <div className="min-w-[200px] text-sm">
                <div className="font-bold text-slate-800 text-base mb-1">
                  {zone.name}
                </div>
                <div className="text-slate-500 text-xs mb-2">{zone.city}</div>

                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs font-semibold">Risk:</span>
                  <span className="text-xs">{riskLabel[zone.risk]}</span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                  <div>
                    <span className="text-slate-400">Active Workers:</span>
                    <span className="font-semibold ml-1">{zone.workers}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Policies:</span>
                    <span className="font-semibold ml-1">{zone.policies}</span>
                  </div>
                </div>

                {zone.activeEvent && zone.event ? (
                  <div className="bg-red-50 border border-red-200 rounded p-2 text-xs">
                    <p className="font-bold text-red-700">⚠ ACTIVE EVENT</p>
                    <p className="text-red-600">{zone.event}</p>
                    <p className="text-slate-600 mt-1">
                      Claims: {zone.claims} | Payouts: ₹{zone.payout.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-700 font-semibold">
                    ✓ No Active Events
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* LEGEND — bottom left */}
      <div className="absolute bottom-6 left-4 z-[1000] bg-white rounded-xl shadow-lg p-3">
        <p className="text-xs font-bold text-slate-700 mb-2">LEGEND</p>
        <div className="space-y-1">
          {Object.entries(riskLabel).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2 text-xs text-slate-600">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: riskColor[key] }}
              />
              {label}
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 pt-1 border-t">
            <span className="w-3 h-3 rounded-full inline-block border-2 border-red-500 animate-pulse" />
            Active Event (pulsing)
          </div>
        </div>
      </div>
    </div>
  );
}