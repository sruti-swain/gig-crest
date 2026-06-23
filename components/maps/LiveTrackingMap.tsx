'use client';

import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface Worker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  zone: string;
  platform: string;
}

interface Props {
  workers: Worker[];
}

// ✅ Fix marker icons (ONLY once)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ✅ Custom icons
const activeIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const idleIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LiveTrackingMap({ workers }: Props) {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={[19.076, 72.8777]}
        zoom={11}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ✅ FIX: Marker + Circle MUST be siblings */}
        {workers.map((worker) => (
          <div key={worker.id}>
            <Marker
              position={[worker.lat, worker.lng]}
              icon={worker.status === 'active' ? activeIcon : idleIcon}
            >
              <Popup>
                <div>
                  <b>{worker.name}</b>
                  <br />
                  {worker.zone}
                  <br />
                  {worker.platform}
                  <br />
                  {worker.status}
                </div>
              </Popup>
            </Marker>

            {/* ✅ Circle OUTSIDE Marker */}
            {worker.status === 'active' && (
              <Circle
                center={[worker.lat, worker.lng]}
                radius={200}
                pathOptions={{ color: 'green' }}
              />
            )}
          </div>
        ))}
      </MapContainer>
    </div>
  );
}