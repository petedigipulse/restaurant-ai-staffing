"use client";
import { useState, useEffect } from "react";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  hourlyWage: number;
  guaranteedHours: number;
  stations: string[];
  employmentType: 'full-time' | 'part-time' | 'casual';
  performanceScore: number;
  availability: {
    [key: string]: {
      available: boolean;
      startTime: string;
      endTime: string;
      preferred: boolean;
    };
  };
  contactInfo: {
    email: string;
    phone: string;
    emergencyContact: string;
  };
  startDate: string;
  status: 'active' | 'inactive' | 'on-leave';
}

interface Props {
  staff: StaffMember;
  onClose: () => void;
  onSave: (updatedStaff: StaffMember) => void;
}

const availableStations = [
  "Host", "Server", "Cashier", "Busser", "Barista", "Bartender",
  "Hot Line", "Prep", "Expo", "Dishwasher", "Manager", "Supervisor"
];

const roles = [
  "FOH Manager", "Server", "Host", "Busser", "Barista", "Bartender",
  "Head Chef", "Sous Chef", "Line Cook", "Prep Cook", "Dishwasher",
  "Manager", "Supervisor", "Cashier"
];

export default function EditStaffModal({ staff, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<StaffMember>(staff);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(staff);
  }, [staff]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
    
    if (errors[`contactInfo.${field}`]) {
      setErrors(prev => ({ ...prev, [`contactInfo.${field}`]: '' }));
    }
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleStationToggle = (station: string) => {
    setFormData(prev => ({
      ...prev,
      stations: prev.stations.includes(station)
        ? prev.stations.filter(s => s !== station)
        : [...prev.stations, station]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    if (formData.hourlyWage <= 0) {
      newErrors.hourlyWage = 'Hourly wage must be greater than 0';
    }
    if (formData.guaranteedHours < 0) {
      newErrors.guaranteedHours = 'Guaranteed hours cannot be negative';
    }
    if (formData.stations.length === 0) {
      newErrors.stations = 'At least one station is required';
    }
    if (!formData.contactInfo.email.trim()) {
      newErrors['contactInfo.email'] = 'Email is required';
    }
    if (!formData.contactInfo.phone.trim()) {
      newErrors['contactInfo.phone'] = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const getDayLabel = (day: string) => {
    const dayLabels: { [key: string]: string } = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return dayLabels[day] || day;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Edit Staff Member</h2>
            <p className="text-muted-foreground">
              Update information for {staff.firstName} {staff.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.lastName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.role ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select a role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hourly Wage *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.hourlyWage}
                    onChange={(e) => handleInputChange('hourlyWage', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.hourlyWage ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.hourlyWage && (
                    <p className="text-red-500 text-sm mt-1">{errors.hourlyWage}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Guaranteed Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.guaranteedHours}
                    onChange={(e) => handleInputChange('guaranteedHours', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.guaranteedHours ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.guaranteedHours && (
                    <p className="text-red-500 text-sm mt-1">{errors.guaranteedHours}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Performance Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.performanceScore}
                    onChange={(e) => handleInputChange('performanceScore', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Stations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stations & Skills *</h3>
              <div className="grid gap-2 md:grid-cols-3">
                {availableStations.map(station => (
                  <label key={station} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.stations.includes(station)}
                      onChange={() => handleStationToggle(station)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{station}</span>
                  </label>
                ))}
              </div>
              {errors.stations && (
                <p className="text-red-500 text-sm mt-2">{errors.stations}</p>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors['contactInfo.email'] ? 'border-red-500' : ''
                    }`}
                  />
                  {errors['contactInfo.email'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['contactInfo.email']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors['contactInfo.phone'] ? 'border-red-500' : ''
                    }`}
                  />
                  {errors['contactInfo.phone'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['contactInfo.phone']}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.contactInfo.emergencyContact}
                    onChange={(e) => handleContactChange('emergencyContact', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Name and relationship (e.g., David Chen - Spouse)"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Weekly Availability</h3>
              <div className="space-y-4">
                {Object.entries(formData.availability).map(([day, schedule]) => (
                  <div key={day} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{getDayLabel(day)}</h4>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={schedule.available}
                          onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Available</span>
                      </label>
                    </div>
                    
                    {schedule.available && (
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Start Time</label>
                          <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">End Time</label>
                          <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        
                        <div className="flex items-end">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={schedule.preferred}
                              onChange={(e) => handleAvailabilityChange(day, 'preferred', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">Preferred</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
