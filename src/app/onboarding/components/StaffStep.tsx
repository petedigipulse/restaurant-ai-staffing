"use client";
import { useState } from "react";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  hourlyWage: number;
  guaranteedHours: number;
  stations: string[];
  performanceScore?: number;
  employmentType: 'full-time' | 'part-time' | 'casual';
  phone?: string;
  emergencyContact?: string;
  startDate?: string;
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
  const [showCSVImport, setShowCSVImport] = useState(false);

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
      email: '',
      role: '',
      hourlyWage: 0,
      guaranteedHours: 0,
      stations: [],
      employmentType: 'part-time',
      phone: '',
      emergencyContact: '',
      startDate: new Date().toISOString().split('T')[0],
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

  const handleCSVImport = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(Boolean);
      
      if (lines.length < 2) {
        alert('CSV must have at least a header row and one data row');
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      const csvData: StaffMember[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = cells[index] || '';
        });
        
        // Transform CSV data to match StaffMember interface
        const staffMember: StaffMember = {
          id: `S${String((staff.length + csvData.length + 101)).padStart(3, '0')}`,
          firstName: row['First Name'] || row['firstName'] || '',
          lastName: row['Last Name'] || row['lastName'] || '',
          email: row['Email'] || row['email'] || '',
          role: row['Role'] || row['role'] || '',
          hourlyWage: parseFloat(row['Hourly Wage'] || row['hourlyWage'] || '0'),
          guaranteedHours: parseInt(row['Guaranteed Hours'] || row['guaranteedHours'] || '0'),
          employmentType: (row['Employment Type'] || row['employmentType'] || 'part-time').toLowerCase() as any,
          performanceScore: parseInt(row['Performance Score'] || row['performanceScore'] || '80'),
          stations: (row['Stations'] || row['stations'] || '').split(',').map(s => s.trim()).filter(Boolean),
          availability: {
            monday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
            tuesday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
            wednesday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
            thursday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
            friday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
            saturday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
            sunday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false }
          },
          phone: row['Phone'] || row['phone'] || '',
          emergencyContact: row['Emergency Contact'] || row['emergencyContact'] || '',
          startDate: row['Start Date'] || row['startDate'] || new Date().toISOString().split('T')[0]
        };
        
        csvData.push(staffMember);
      }
      
      // Validate required fields
      const invalidRows = csvData.filter(member => 
        !member.firstName || !member.lastName || !member.role
      );
      
      if (invalidRows.length > 0) {
        alert(`Invalid data in ${invalidRows.length} rows. First Name, Last Name, and Role are required.`);
        return;
      }
      
      // Add imported staff to existing staff
      const updatedStaff = [...staff, ...csvData];
      updateData(updatedStaff);
      
      alert(`Successfully imported ${csvData.length} staff members!`);
      setShowCSVImport(false);
      
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Failed to import CSV. Please check the file format and try again.');
    }
  };

  const downloadTemplate = () => {
    const csvContent = `First Name,Last Name,Email,Role,Hourly Wage,Guaranteed Hours,Employment Type,Performance Score,Stations,Phone,Emergency Contact,Start Date
Emily,Chen,emily.chen@restaurant.com,FOH Manager,32.00,30,full-time,95,"Front of House, Management","+1 (555) 123-4567","John Chen","2024-01-15"
Mai,Kanako,mai.kanako@restaurant.com,Barista,26.00,15,part-time,98,"Barista, Till","+1 (555) 987-6543","Sarah Johnson","2024-02-01"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCSVImport(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Import CSV
            </button>
            <button
              onClick={addStaffMember}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Staff Member
            </button>
          </div>
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
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={member.email || ''}
                      onChange={(e) => updateStaffMember(member.id, { email: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="email@example.com"
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
                </div>

                {/* Additional Info */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={member.phone || ''}
                      onChange={(e) => updateStaffMember(member.id, { phone: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={member.emergencyContact || ''}
                      onChange={(e) => updateStaffMember(member.id, { emergencyContact: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Emergency contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={member.startDate || ''}
                      onChange={(e) => updateStaffMember(member.id, { startDate: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
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
                  email: 'emily@restaurant.com',
                  role: 'FOH Manager',
                  hourlyWage: 32,
                  guaranteedHours: 30,
                  stations: ['Front of House', 'Management'],
                  performanceScore: 92,
                  employmentType: 'full-time',
                  phone: '+1 (555) 123-4567',
                  emergencyContact: 'John Smith',
                  startDate: new Date().toISOString().split('T')[0],
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
                  email: 'mai@restaurant.com',
                  role: 'Barista',
                  hourlyWage: 26,
                  guaranteedHours: 15,
                  stations: ['Barista', 'Till'],
                  performanceScore: 98,
                  employmentType: 'part-time',
                  phone: '+1 (555) 987-6543',
                  emergencyContact: 'Sarah Johnson',
                  startDate: new Date().toISOString().split('T')[0],
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

      {/* CSV Import Modal */}
      {showCSVImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Import Staff from CSV</h2>
              <button
                onClick={() => setShowCSVImport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Download Template */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Download our CSV template to get started
                </p>
                <button
                  onClick={downloadTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Template
                </button>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Upload your CSV file
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your CSV file here or click to browse
                </p>
                
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleCSVImport(file);
                    }
                  }}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Choose File
                </label>
              </div>

              {/* CSV Format Instructions */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Required fields:</strong> First Name, Last Name, Role</p>
                  <p><strong>Optional fields:</strong> Email, Hourly Wage, Guaranteed Hours, Employment Type, Performance Score, Stations, Phone, Emergency Contact, Start Date</p>
                  <p><strong>Employment Type:</strong> full-time, part-time, or casual</p>
                  <p><strong>Stations:</strong> Comma-separated list (e.g., "Kitchen, Front of House")</p>
                  <p><strong>Date format:</strong> YYYY-MM-DD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
