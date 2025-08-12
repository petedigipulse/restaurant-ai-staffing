"use client";
import { useState } from "react";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  hourlyWage: number;
  guaranteedHours: number;
  stations: string[];
  performanceScore?: number;
  employmentType: 'full-time' | 'part-time' | 'casual';
  availability: {
    monday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    tuesday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    wednesday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    thursday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    friday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    saturday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    sunday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
  };
}

interface Props {
  data: StaffMember[];
  updateData: (data: StaffMember[]) => void;
}

export default function StaffStep({ data, updateData }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Ensure data.staff is always an array
  const staff = Array.isArray(data) ? data : [];

  const roles = [
    'FOH Manager',
    'Kitchen Manager',
    'Sous Chef',
    'Chef de Partie',
    'Commis Chef',
    'Line Cook',
    'Prep Cook',
    'Kitchen Porter',
    'Server',
    'Host',
    'Bartender',
    'Barista',
    'Cashier',
    'Runner',
    'Busser',
    'Other'
  ];

  const stationOptions = [
    'Kitchen',
    'Front of House',
    'Bar',
    'Barista',
    'Till',
    'Server',
    'Host',
    'Kitchen Porter',
    'Larder',
    'Grill',
    'Hot',
    'Prep',
    'Dishwashing',
    'Expo',
    'Management'
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

  const addStaffMember = () => {
    const newStaff: StaffMember = {
      id: `S${String((staff.length) + 101).padStart(3, '0')}`,
      firstName: '',
      lastName: '',
      role: '',
      hourlyWage: 0,
      guaranteedHours: 0,
      stations: [],
      employmentType: 'part-time',
      availability: {
        monday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
        tuesday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
        wednesday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
        thursday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
        friday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
        saturday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
        sunday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false }
      }
    };
    const updatedStaff = [...staff, newStaff];
    updateData(updatedStaff);
    setEditingId(newStaff.id);
    setShowAddForm(false);
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    const updatedStaff = staff.map(member => 
      member.id === id ? { ...member, ...updates } : member
    );
    updateData(updatedStaff);
  };

  const deleteStaffMember = (id: string) => {
    const updatedStaff = staff.filter(member => member.id !== id);
    updateData(updatedStaff);
  };

  const toggleStation = (staffId: string, station: string) => {
    const member = staff.find(s => s.id === staffId);
    if (!member) return;

    const updatedStations = member.stations.includes(station)
      ? member.stations.filter(s => s !== station)
      : [...member.stations, station];

    updateStaffMember(staffId, { stations: updatedStations });
  };

  const updateAvailability = (staffId: string, day: string, field: string, value: any) => {
    const member = staff.find(s => s.id === staffId);
    if (!member) return;

    const updatedAvailability = {
      ...member.availability,
      [day]: { ...member.availability[day as keyof typeof member.availability], [field]: value }
    };

    updateStaffMember(staffId, { availability: updatedAvailability });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Set up your team</h1>
        <p className="text-muted-foreground">
          Add your staff members with their roles, pay rates, and availability
        </p>
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Staff Members ({staff.length})</h2>
          <button
            onClick={addStaffMember}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Staff Member
          </button>
        </div>

        {staff.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No staff members added yet</p>
            <button
              onClick={addStaffMember}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Add Your First Staff Member
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="border rounded-lg p-4 space-y-4">
                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      value={member.firstName}
                      onChange={(e) => updateStaffMember(member.id, { firstName: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      value={member.lastName}
                      onChange={(e) => updateStaffMember(member.id, { lastName: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={member.role}
                      onChange={(e) => updateStaffMember(member.id, { role: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">Select role</option>
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Employment Type</label>
                    <select
                      value={member.employmentType}
                      onChange={(e) => updateStaffMember(member.id, { employmentType: e.target.value as any })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="casual">Casual</option>
                    </select>
                  </div>
                </div>

                {/* Pay & Hours */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hourly Wage ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={member.hourlyWage}
                      onChange={(e) => updateStaffMember(member.id, { hourlyWage: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Guaranteed Hours</label>
                    <input
                      type="number"
                      value={member.guaranteedHours}
                      onChange={(e) => updateStaffMember(member.id, { guaranteedHours: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Performance Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={member.performanceScore || ''}
                      onChange={(e) => updateStaffMember(member.id, { performanceScore: parseInt(e.target.value) || undefined })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="0-100"
                    />
                  </div>
                </div>

                {/* Stations */}
                <div>
                  <label className="block text-sm font-medium mb-2">Work Stations</label>
                  <div className="flex flex-wrap gap-2">
                    {stationOptions.map(station => (
                      <button
                        key={station}
                        onClick={() => toggleStation(member.id, station)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          member.stations.includes(station)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-muted hover:bg-muted/80'
                        }`}
                      >
                        {station}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium mb-2">Weekly Availability</label>
                  <div className="grid gap-3 md:grid-cols-7">
                    {days.map(({ key, label }) => {
                      const day = member.availability[key as keyof typeof member.availability];
                      return (
                        <div key={key} className="space-y-2">
                          <div className="text-center text-sm font-medium">{label}</div>
                          
                          <label className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={day.available}
                              onChange={(e) => updateAvailability(member.id, key, 'available', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                          </label>

                          {day.available && (
                            <>
                              <input
                                type="time"
                                value={day.startTime || ''}
                                onChange={(e) => updateAvailability(member.id, key, 'startTime', e.target.value)}
                                className="w-full p-1 text-xs border rounded"
                              />
                              <input
                                type="time"
                                value={day.endTime || ''}
                                onChange={(e) => updateAvailability(member.id, key, 'endTime', e.target.value)}
                                className="w-full p-1 text-xs border rounded"
                              />
                              <label className="flex items-center justify-center text-xs">
                                <input
                                  type="checkbox"
                                  checked={day.preferred}
                                  onChange={(e) => updateAvailability(member.id, key, 'preferred', e.target.checked)}
                                  className="rounded border-gray-300"
                                />
                                <span className="ml-1">Pref</span>
                              </label>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => deleteStaffMember(member.id)}
                    className="px-3 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Templates */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Add Templates</h2>
        <p className="text-sm text-muted-foreground">
          Add common restaurant staff roles quickly
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const templateStaff: StaffMember[] = [
                {
                  id: 'S101',
                  firstName: 'Emily',
                  lastName: '',
                  role: 'FOH Manager',
                  hourlyWage: 32,
                  guaranteedHours: 30,
                  stations: ['Front of House', 'Management'],
                  performanceScore: 92,
                  employmentType: 'full-time',
                  availability: {
                    monday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
                    tuesday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
                    wednesday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
                    thursday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
                    friday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
                    saturday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
                    sunday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false }
                  }
                },
                {
                  id: 'S102',
                  firstName: 'Mai',
                  lastName: '',
                  role: 'Barista',
                  hourlyWage: 26,
                  guaranteedHours: 15,
                  stations: ['Barista', 'Till'],
                  performanceScore: 98,
                  employmentType: 'part-time',
                  availability: {
                    monday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
                    tuesday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
                    wednesday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
                    thursday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
                    friday: { available: true, startTime: '16:00', endTime: '22:00', preferred: true },
                    saturday: { available: true, startTime: '08:00', endTime: '16:00', preferred: true },
                    sunday: { available: true, startTime: '10:00', endTime: '15:00', preferred: true }
                  }
                }
              ];
               updateData(templateStaff);
            }}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Add Sample Staff
          </button>
        </div>
      </div>
    </div>
  );
}
