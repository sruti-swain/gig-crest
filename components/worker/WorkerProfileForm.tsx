// components/worker/WorkerProfileForm.tsx
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, User } from 'lucide-react';
import { Worker } from '@/types';

interface WorkerProfileFormProps {
  worker: Worker;
  zones: any[];
  onUpdate: () => void;
}

export const WorkerProfileForm: React.FC<WorkerProfileFormProps> = ({ 
  worker, 
  zones,
  onUpdate 
}) => {
  const [formData, setFormData] = useState({
    avgDailyEarning: worker.avgDailyEarning,
    hoursPerDay: worker.hoursPerDay,
    daysPerWeek: worker.daysPerWeek,
    upiId: worker.upiId,
    primaryZoneId: worker.primaryZoneId
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const response = await fetch(`/api/workers/${worker.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✓ Profile updated successfully!');
        onUpdate();
      } else {
        alert('Failed to update profile: ' + data.error);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {worker.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
            <p className="text-sm text-gray-500">{worker.phone}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Non-editable fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500">Full Name</Label>
              <Input 
                value={worker.name} 
                disabled 
                className="bg-gray-100 text-gray-500 cursor-not-allowed mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Phone Number</Label>
              <Input 
                value={worker.phone} 
                disabled 
                className="bg-gray-100 text-gray-500 cursor-not-allowed mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500">City</Label>
              <Input 
                value={worker.city} 
                disabled 
                className="bg-gray-100 text-gray-500 cursor-not-allowed mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Platform</Label>
              <Input 
                value={worker.deliveryPlatform}
                disabled 
                className="bg-gray-100 text-gray-500 cursor-not-allowed mt-1 capitalize"
              />
            </div>
          </div>

          {/* Editable fields */}
          <div className="pt-4 border-t">
            <p className="text-xs font-semibold text-gray-700 mb-3">Editable Information</p>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="zone" className="text-sm font-medium">Primary Zone</Label>
                <Select 
                  value={formData.primaryZoneId} 
                  onValueChange={(value) => handleChange('primaryZoneId', value)}
                >
                  <SelectTrigger id="zone" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.filter(z => z.city === worker.city).map(zone => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="earnings" className="text-sm font-medium">Average Daily Earning (₹)</Label>
                <Input
                  id="earnings"
                  type="number"
                  min="200"
                  max="2000"
                  value={formData.avgDailyEarning}
                  onChange={(e) => handleChange('avgDailyEarning', Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="hours" className="text-sm font-medium">Hours/Day</Label>
                  <Input
  id="hours"
  type="number"
  min="2"
  max="16"
  value={formData.hoursPerDay}   // ✅ FIXED
  onChange={(e) => handleChange('hoursPerDay', Number(e.target.value))} // ✅ FIXED
  className="mt-1"
/>
                </div>
                <div>
                  <Label htmlFor="days" className="text-sm font-medium">Days/Week</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    max="7"
                    value={formData.daysPerWeek}
                    onChange={(e) => handleChange('daysPerWeek', Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="upi" className="text-sm font-medium">UPI ID</Label>
                <Input
                  id="upi"
                  type="text"
                  placeholder="yourname@upi"
                  value={formData.upiId}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Button 
        type="submit"
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-bold"
      >
        {saving ? (
          <>
            <Loader2 size={18} className="animate-spin mr-2" />
            Saving Changes...
          </>
        ) : (
          <>
            <Save size={18} className="mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </form>
  );
};