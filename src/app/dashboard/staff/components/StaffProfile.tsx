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
  onEdit: (staff: StaffMember) => void;
}

export default function StaffProfile({ staff, onClose, onEdit }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'availability' | 'performance' | 'documents'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'part-time': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'casual': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'availability', label: 'Availability' },
    { id: 'performance', label: 'Performance' },
    { id: 'documents', label: 'Documents' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{staff.firstName} {staff.lastName}</h2>
            <p className="text-muted-foreground">{staff.role}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(staff.status)}`}>
              {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEmploymentTypeColor(staff.employmentType)}`}>
              {staff.employmentType.charAt(0).toUpperCase() + staff.employmentType.slice(1)}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-1 p-6 pt-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employee ID:</span>
                      <span className="font-medium">{staff.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{new Date(staff.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hourly Wage:</span>
                      <span className="font-medium">${staff.hourlyWage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guaranteed Hours:</span>
                      <span className="font-medium">{staff.guaranteedHours}h/week</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Performance Score:</span>
                      <span className={`font-medium ${getPerformanceColor(staff.performanceScore)}`}>
                        {staff.performanceScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${staff.performanceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stations */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Stations & Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {staff.stations.map((station, index) => (
                    <span key={index} className="px-3 py-1 bg-muted rounded-lg text-sm">
                      {station}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <div className="font-medium">{staff.contactInfo.email}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <div className="font-medium">{staff.contactInfo.phone}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Emergency Contact:</span>
                    <div className="font-medium">{staff.contactInfo.emergencyContact}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Weekly Availability</h3>
              <div className="grid gap-4">
                {Object.entries(staff.availability).map(([day, schedule]) => (
                  <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 font-medium">{getDayLabel(day)}</div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${schedule.available ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={schedule.available ? 'text-green-600' : 'text-gray-500'}>
                          {schedule.available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                    
                    {schedule.available && (
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2 font-medium">
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </span>
                        </div>
                        {schedule.preferred && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Preferred
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Performance History</h3>
              
              {/* Performance Metrics */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{staff.performanceScore}</div>
                  <div className="text-sm text-muted-foreground">Current Score</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">94</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">+3</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>

              {/* Recent Feedback */}
              <div>
                <h4 className="font-medium mb-3">Recent Feedback</h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Excellent customer service skills</span>
                      <span className="text-sm text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consistently receives positive feedback from customers. Great team player.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Improved efficiency in station</span>
                      <span className="text-sm text-muted-foreground">1 month ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Showed significant improvement in prep station efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Documents & Records</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Required Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Employment Contract</span>
                      <span className="text-green-600 text-sm">✓ Complete</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tax Forms</span>
                      <span className="text-green-600 text-sm">✓ Complete</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Safety Training</span>
                      <span className="text-green-600 text-sm">✓ Complete</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Food Handler Certificate</span>
                      <span className="text-yellow-600 text-sm">⚠ Expires Soon</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Performance Reviews</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Q4 2023 Review</span>
                      <span className="text-blue-600 text-sm">View</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Q3 2023 Review</span>
                      <span className="text-blue-600 text-sm">View</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Q2 2023 Review</span>
                      <span className="text-blue-600 text-sm">View</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-muted/30">
          <button
            onClick={() => onEdit(staff)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Edit Staff Member
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
