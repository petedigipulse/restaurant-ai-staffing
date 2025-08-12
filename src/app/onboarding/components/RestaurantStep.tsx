"use client";
import { useState } from "react";

interface OperatingHours {
  open: string;
  close: string;
  closed: boolean;
}

interface RestaurantData {
  name: string;
  type: string;
  timezone: string;
  operatingHours: {
    monday: OperatingHours;
    tuesday: OperatingHours;
    wednesday: OperatingHours;
    thursday: OperatingHours;
    friday: OperatingHours;
    saturday: OperatingHours;
    sunday: OperatingHours;
  };
}

interface Props {
  data: RestaurantData;
  updateData: (data: Partial<RestaurantData>) => void;
}

export default function RestaurantStep({ data, updateData }: Props) {
  const [localData, setLocalData] = useState(data);

  const handleChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const handleHoursChange = (day: string, field: string, value: any) => {
    const newHours = { ...localData.operatingHours, [day]: { ...localData.operatingHours[day as keyof typeof localData.operatingHours], [field]: value } };
    const newData = { ...localData, operatingHours: newHours };
    setLocalData(newData);
    updateData(newData);
  };

  const restaurantTypes = [
    'Fine Dining',
    'Casual Dining', 
    'Fast Casual',
    'Fast Food',
    'Food Truck',
    'Cafe',
    'Bar & Grill',
    'Pizzeria',
    'Asian Fusion',
    'Mexican',
    'Italian',
    'Other'
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago', 
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'America/Anchorage',
    'Pacific/Honolulu'
  ];

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Tell us about your restaurant</h1>
        <p className="text-muted-foreground">
          This information helps our AI understand your business and create better schedules
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Restaurant Name</label>
              <input
                type="text"
                value={localData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Bella Vista Italian"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Restaurant Type</label>
              <select
                value={localData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select restaurant type</option>
                {restaurantTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={localData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select timezone</option>
              {timezones.map(tz => (
                <option key={tz} value={tz}>
                  {tz.replace('America/', '').replace('Pacific/', '').replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Operating Hours</h2>
          <p className="text-sm text-muted-foreground">
            Set your restaurant&apos;s operating hours for each day of the week
          </p>

          <div className="space-y-3">
            {days.map(({ key, label }) => {
              const hours = localData.operatingHours[key as keyof typeof localData.operatingHours];
              return (
                <div key={key} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-24">
                    <span className="font-medium">{label}</span>
                  </div>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => handleHoursChange(key, 'closed', !e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Open</span>
                  </label>

                  {!hours.closed && (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Open:</span>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleHoursChange(key, 'open', e.target.value)}
                          className="p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Close:</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleHoursChange(key, 'close', e.target.value)}
                          className="p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Templates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Templates</h2>
          <p className="text-sm text-muted-foreground">
            Apply common operating hour patterns
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const template = {
                  monday: { open: '09:00', close: '22:00', closed: false },
                  tuesday: { open: '09:00', close: '22:00', closed: false },
                  wednesday: { open: '09:00', close: '22:00', closed: false },
                  thursday: { open: '09:00', close: '22:00', closed: false },
                  friday: { open: '09:00', close: '23:00', closed: false },
                  saturday: { open: '09:00', close: '23:00', closed: false },
                  sunday: { open: '10:00', close: '21:00', closed: false }
                };
                setLocalData(prev => ({ ...prev, operatingHours: template }));
                updateData({ operatingHours: template });
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Standard Restaurant
            </button>

            <button
              onClick={() => {
                const template = {
                  monday: { open: '07:00', close: '21:00', closed: false },
                  tuesday: { open: '07:00', close: '21:00', closed: false },
                  wednesday: { open: '07:00', close: '21:00', closed: false },
                  thursday: { open: '07:00', close: '21:00', closed: false },
                  friday: { open: '07:00', close: '22:00', closed: false },
                  saturday: { open: '08:00', close: '22:00', closed: false },
                  sunday: { open: '08:00', close: '20:00', closed: false }
                };
                setLocalData(prev => ({ ...prev, operatingHours: template }));
                updateData({ operatingHours: template });
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Cafe/Breakfast
            </button>

            <button
              onClick={() => {
                const template = {
                  monday: { open: '11:00', close: '22:00', closed: false },
                  tuesday: { open: '11:00', close: '22:00', closed: false },
                  wednesday: { open: '11:00', close: '22:00', closed: false },
                  thursday: { open: '11:00', close: '22:00', closed: false },
                  friday: { open: '11:00', close: '23:00', closed: false },
                  saturday: { open: '11:00', close: '23:00', closed: false },
                  sunday: { open: '12:00', close: '21:00', closed: false }
                };
                setLocalData(prev => ({ ...prev, operatingHours: template }));
                updateData({ operatingHours: template });
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Lunch/Dinner Focus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
