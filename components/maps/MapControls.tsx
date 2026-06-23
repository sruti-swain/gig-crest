// components/maps/MapControls.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface MapControlsProps {
  onCitySelect: (city: string, coords: [number, number], zoom: number) => void;
  onEventFilter?: (eventType: string) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ 
  onCitySelect, 
  onEventFilter 
}) => {
  const cities = [
    { name: 'India', coords: [20.5937, 78.9629] as [number, number], zoom: 5 },
    { name: 'Mumbai', coords: [19.0760, 72.8777] as [number, number], zoom: 12 },
    { name: 'Delhi', coords: [28.6139, 77.2090] as [number, number], zoom: 12 },
    { name: 'Bangalore', coords: [12.9716, 77.5946] as [number, number], zoom: 12 }
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {cities.map(city => (
          <Button
            key={city.name}
            onClick={() => onCitySelect(city.name, city.coords, city.zoom)}
            size="sm"
            variant="secondary"
            className="bg-white shadow-md hover:bg-gray-100"
          >
            <MapPin size={14} className="mr-1" />
            {city.name}
          </Button>
        ))}
      </div>

      {onEventFilter && (
        <Select onValueChange={onEventFilter} defaultValue="all">
          <SelectTrigger className="w-48 bg-white shadow-md">
            <SelectValue placeholder="Filter by event..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="heavy_rain">Rain</SelectItem>
            <SelectItem value="extreme_heat">Heat</SelectItem>
            <SelectItem value="pollution">AQI</SelectItem>
            <SelectItem value="flood">Flood</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};