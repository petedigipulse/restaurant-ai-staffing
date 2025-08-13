'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScheduleDetailsModalProps {
  schedule: {
    id: string;
    week_start_date: string;
    shifts: any;
    total_labor_cost: number;
    total_hours: number;
    ai_generated: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  onClose: () => void;
}

export default function ScheduleDetailsModal({ schedule, onClose }: ScheduleDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'costs' | 'ai-insights'>('overview');

  if (!schedule) return null;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate week start and end
  const weekStart = new Date(schedule.week_start_date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Get day names for display
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule Details</h2>
            <p className="text-gray-600">
              Week of {formatDate(schedule.week_start_date)} - {formatDate(weekEnd.toISOString())}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'assignments', label: 'Staff Assignments', icon: '👥' },
            { id: 'costs', label: 'Cost Analysis', icon: '💰' },
            { id: 'ai-insights', label: 'AI Insights', icon: '🤖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Labor Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      ${schedule.total_labor_cost.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {schedule.total_hours}h
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generation Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {schedule.ai_generated ? (
                        <>
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">AI</span>
                          </div>
                          <span className="text-lg font-semibold text-purple-600">AI Generated</span>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">M</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-600">Manual</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Schedule ID:</span>
                    <span className="font-mono text-sm">{schedule.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{formatDate(schedule.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span>{formatDate(schedule.updated_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Week Start:</span>
                    <span>{formatDate(schedule.week_start_date)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Staff Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              {dayNames.map((dayName) => {
                const dayKey = dayName.toLowerCase().substring(0, 3);
                const dayData = schedule.shifts[dayKey];
                
                if (!dayData) return null;

                return (
                  <Card key={dayName}>
                    <CardHeader>
                      <CardTitle className="text-xl">{dayName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lunch Shift */}
                        {dayData.lunch && (
                          <div>
                            <h4 className="font-semibold text-lg mb-3 text-orange-600">
                              🍽️ Lunch (11:00-15:00)
                            </h4>
                            <div className="space-y-3">
                              {Object.entries(dayData.lunch.stations || {}).map(([stationName, stationData]: [string, any]) => (
                                <div key={stationName} className="border rounded-lg p-3">
                                  <div className="font-medium text-gray-800 mb-2">
                                    {stationName} ({stationData.assignedStaff?.length || 0} staff)
                                  </div>
                                  {stationData.assignedStaff && stationData.assignedStaff.length > 0 ? (
                                    <div className="space-y-1">
                                      {stationData.assignedStaff.map((staff: any, index: number) => (
                                        <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                          • {staff.name || `${staff.first_name} ${staff.last_name}`} - {staff.role}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-400 italic">No staff assigned</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Dinner Shift */}
                        {dayData.dinner && (
                          <div>
                            <h4 className="font-semibold text-lg mb-3 text-purple-600">
                              🌙 Dinner (17:00-22:00)
                            </h4>
                            <div className="space-y-3">
                              {Object.entries(dayData.dinner.stations || {}).map(([stationName, stationData]: [string, any]) => (
                                <div key={stationName} className="border rounded-lg p-3">
                                  <div className="font-medium text-gray-800 mb-2">
                                    {stationName} ({stationData.assignedStaff?.length || 0} staff)
                                  </div>
                                  {stationData.assignedStaff && stationData.assignedStaff.length > 0 ? (
                                    <div className="space-y-1">
                                      {stationData.assignedStaff.map((staff: any, index: number) => (
                                        <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                          • {staff.name || `${staff.first_name} ${staff.last_name}`} - {staff.role}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-400 italic">No staff assigned</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Cost Analysis Tab */}
          {activeTab === 'costs' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-lg font-medium">Total Labor Cost</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${schedule.total_labor_cost.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Total Hours</div>
                        <div className="text-xl font-semibold">{schedule.total_hours}h</div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Average Hourly Cost</div>
                        <div className="text-xl font-semibold">
                          ${schedule.total_hours > 0 ? (schedule.total_labor_cost / schedule.total_hours).toFixed(2) : '0.00'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Insights Tab */}
          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              {schedule.ai_generated ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>🤖</span>
                      <span>AI Optimization Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Optimization Summary</h4>
                        <p className="text-blue-700">
                          This schedule was generated using advanced AI algorithms that analyzed staff availability, 
                          performance metrics, weather conditions, and historical data to create an optimal staffing plan.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">AI Processing Time</div>
                          <div className="text-lg font-semibold">~45 seconds</div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Optimization Factors</div>
                          <div className="text-lg font-semibold">Staff + Weather + History</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Manual Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      This schedule was created manually. Consider using AI optimization for better efficiency and cost savings.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <Button onClick={onClose}>
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
}
