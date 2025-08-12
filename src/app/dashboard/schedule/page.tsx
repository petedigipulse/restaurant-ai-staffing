"use client";
import { useState, useCallback } from "react";
import WeatherForecast from "./components/WeatherForecast";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  performance: number;
  availability: string[];
  stations: string[];
  conflicts: Array<{
    type: 'day-off' | 'requested-leave' | 'training' | 'injury' | 'other';
    day: string;
    reason: string;
    startDate?: string;
    endDate?: string;
  }>;
  image?: string;
}

interface Shift {
  id: string;
  name: string;
  time: string;
  stations: Station[];
}

interface Station {
  id: string;
  name: string;
  requiredCapacity: number;
  assignedStaff: StaffMember[];
  color: 'green' | 'yellow' | 'red';
}

interface ScheduleDay {
  day: string;
  lunch: Shift;
  dinner: Shift;
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([
    {
      day: 'Mon',
      lunch: {
        id: 'mon-lunch',
        name: 'Lunch',
        time: '11:00-15:00',
        stations: [
          { id: 'mon-lunch-kitchen', name: 'Kitchen', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'mon-lunch-foh', name: 'Front of House', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'mon-lunch-bar', name: 'Bar', requiredCapacity: 1, assignedStaff: [], color: 'yellow' },
          { id: 'mon-lunch-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      },
      dinner: {
        id: 'mon-dinner',
        name: 'Dinner',
        time: '17:00-22:00',
        stations: [
          { id: 'mon-dinner-kitchen', name: 'Kitchen', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'mon-dinner-foh', name: 'Front of House', requiredCapacity: 4, assignedStaff: [], color: 'yellow' },
          { id: 'mon-dinner-bar', name: 'Bar', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'mon-dinner-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      }
    },
    {
      day: 'Tue',
      lunch: {
        id: 'tue-lunch',
        name: 'Lunch',
        time: '11:00-15:00',
        stations: [
          { id: 'tue-lunch-kitchen', name: 'Kitchen', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'tue-lunch-foh', name: 'Front of House', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'tue-lunch-bar', name: 'Bar', requiredCapacity: 1, assignedStaff: [], color: 'yellow' },
          { id: 'tue-lunch-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      },
      dinner: {
        id: 'tue-dinner',
        name: 'Dinner',
        time: '17:00-22:00',
        stations: [
          { id: 'tue-dinner-kitchen', name: 'Kitchen', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'tue-dinner-foh', name: 'Front of House', requiredCapacity: 4, assignedStaff: [], color: 'yellow' },
          { id: 'tue-dinner-bar', name: 'Bar', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'tue-dinner-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      }
    },
    {
      day: 'Wed',
      lunch: {
        id: 'wed-lunch',
        name: 'Lunch',
        time: '11:00-15:00',
        stations: [
          { id: 'wed-lunch-kitchen', name: 'Kitchen', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'wed-lunch-foh', name: 'Front of House', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'wed-lunch-bar', name: 'Bar', requiredCapacity: 1, assignedStaff: [], color: 'yellow' },
          { id: 'wed-lunch-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      },
      dinner: {
        id: 'wed-dinner',
        name: 'Dinner',
        time: '17:00-22:00',
        stations: [
          { id: 'wed-dinner-kitchen', name: 'Kitchen', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'wed-dinner-foh', name: 'Front of House', requiredCapacity: 4, assignedStaff: [], color: 'yellow' },
          { id: 'wed-dinner-bar', name: 'Bar', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'wed-dinner-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      }
    },
    {
      day: 'Thu',
      lunch: {
        id: 'thu-lunch',
        name: 'Lunch',
        time: '11:00-15:00',
        stations: [
          { id: 'thu-lunch-kitchen', name: 'Kitchen', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'thu-lunch-foh', name: 'Front of House', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'thu-lunch-bar', name: 'Bar', requiredCapacity: 1, assignedStaff: [], color: 'yellow' },
          { id: 'thu-lunch-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      },
      dinner: {
        id: 'thu-dinner',
        name: 'Dinner',
        time: '17:00-22:00',
        stations: [
          { id: 'thu-dinner-kitchen', name: 'Kitchen', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'thu-dinner-foh', name: 'Front of House', requiredCapacity: 4, assignedStaff: [], color: 'yellow' },
          { id: 'thu-dinner-bar', name: 'Bar', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'thu-dinner-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      }
    },
    {
      day: 'Fri',
      lunch: {
        id: 'fri-lunch',
        name: 'Lunch',
        time: '11:00-15:00',
        stations: [
          { id: 'fri-lunch-kitchen', name: 'Kitchen', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'fri-lunch-foh', name: 'Front of House', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'fri-lunch-bar', name: 'Bar', requiredCapacity: 1, assignedStaff: [], color: 'yellow' },
          { id: 'fri-lunch-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      },
      dinner: {
        id: 'fri-dinner',
        name: 'Dinner',
        time: '17:00-22:00',
        stations: [
          { id: 'fri-dinner-kitchen', name: 'Kitchen', requiredCapacity: 3, assignedStaff: [], color: 'yellow' },
          { id: 'fri-dinner-foh', name: 'Front of House', requiredCapacity: 4, assignedStaff: [], color: 'yellow' },
          { id: 'fri-dinner-bar', name: 'Bar', requiredCapacity: 2, assignedStaff: [], color: 'yellow' },
          { id: 'fri-dinner-host', name: 'Host', requiredCapacity: 1, assignedStaff: [], color: 'yellow' }
        ]
      }
    }
  ]);

  const [unassignedStaff, setUnassignedStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Liam O\'Connor',
      role: 'Head Chef',
      performance: 98,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      stations: ['Kitchen'],
      conflicts: []
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Server',
      performance: 92,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      stations: ['Front of House'],
      conflicts: []
    },
    {
      id: '3',
      name: 'Ava Thompson',
      role: 'Bartender',
      performance: 95,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      stations: ['Bar'],
      conflicts: [
        {
          type: 'day-off',
          day: 'Wed',
          reason: 'Personal day off',
          startDate: '2024-01-17',
          endDate: '2024-01-17'
        }
      ]
    },
    {
      id: '4',
      name: 'Marcus Rodriguez',
      role: 'Line Cook',
      performance: 88,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      stations: ['Kitchen'],
      conflicts: []
    },
    {
      id: '5',
      name: 'Emily Chen',
      role: 'Sous Chef',
      performance: 93,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      stations: ['Kitchen'],
      conflicts: [
        {
          type: 'requested-leave',
          day: 'Fri',
          reason: 'Family vacation',
          startDate: '2024-01-19',
          endDate: '2024-01-21'
        }
      ]
    },
    {
      id: '6',
      name: 'David Kim',
      role: 'Server',
      performance: 90,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      stations: ['Front of House', 'Host'],
      conflicts: []
    },
    {
      id: '7',
      name: 'Jessica Williams',
      role: 'Bartender',
      performance: 87,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      stations: ['Bar'],
      conflicts: []
    },
    {
      id: '8',
      name: 'Michael Brown',
      role: 'Host',
      performance: 89,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      stations: ['Host'],
      conflicts: []
    }
  ]);

  const [conflictAlert, setConflictAlert] = useState<string | null>(null);
  const [draggedStaff, setDraggedStaff] = useState<StaffMember | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  const handleDragStart = (e: React.DragEvent, staff: StaffMember) => {
    setDraggedStaff(staff);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStation: Station, day: string, shiftType: 'lunch' | 'dinner') => {
    e.preventDefault();
    
    if (!draggedStaff) return;

    // Check for conflicts first
    const conflicts = checkStaffConflicts(draggedStaff, day);
    if (conflicts.length > 0) {
      const conflictMessages = conflicts.map(c => `${c.type}: ${c.reason}`).join(', ');
      setConflictAlert(`${draggedStaff.name} has conflicts on ${day}: ${conflictMessages}`);
      setTimeout(() => setConflictAlert(null), 8000);
      return;
    }

    // Check if staff is qualified for this station
    if (!draggedStaff.stations.includes(targetStation.name)) {
      setConflictAlert(`${draggedStaff.name} is not qualified for ${targetStation.name}`);
      setTimeout(() => setConflictAlert(null), 8000);
      return;
    }

    // Check if staff is available on this day
    if (!draggedStaff.availability.includes(day)) {
      setConflictAlert(`${draggedStaff.name} is not available on ${day}`);
      setTimeout(() => setConflictAlert(null), 8000);
      return;
    }

    // Check if station is at capacity
    if (targetStation.assignedStaff.length >= targetStation.requiredCapacity) {
      setConflictAlert(`${targetStation.name} is at capacity`);
      setTimeout(() => setConflictAlert(null), 8000);
      return;
    }

    // Add staff to station
    const updatedSchedule = schedule.map(scheduleDay => {
      if (scheduleDay.day === day) {
        const shift = shiftType === 'lunch' ? scheduleDay.lunch : scheduleDay.dinner;
        const updatedShift = {
          ...shift,
          stations: shift.stations.map(station => {
            if (station.id === targetStation.id) {
              return {
                ...station,
                assignedStaff: [...station.assignedStaff, draggedStaff]
              };
            }
            return station;
          })
        };

        return {
          ...scheduleDay,
          [shiftType]: updatedShift
        };
      }
      return scheduleDay;
    });

    setSchedule(updatedSchedule);

    // Remove staff from unassigned list
    setUnassignedStaff(prev => prev.filter(staff => staff.id !== draggedStaff.id));

    // Update station colors
    updateStationColors();

    setDraggedStaff(null);
  };

  const checkStaffConflicts = (staff: StaffMember, day: string) => {
    return staff.conflicts.filter(conflict => {
      // Check if the conflict applies to this specific day
      if (conflict.day === day) return true;
      
      // Check if it's a date range conflict (simplified for demo)
      if (conflict.startDate && conflict.endDate) {
        // In a real app, you'd convert 'day' to a specific date and compare
        // For demo purposes, we'll primarily use the day-based conflicts
        return false; 
      }
      
      return false;
    });
  };

  const removeStaffFromStation = (staffId: string, stationId: string, day: string, shiftType: 'lunch' | 'dinner') => {
    const updatedSchedule = schedule.map(scheduleDay => {
      if (scheduleDay.day === day) {
        const shift = shiftType === 'lunch' ? scheduleDay.lunch : scheduleDay.dinner;
        const updatedShift = {
          ...shift,
          stations: shift.stations.map(station => {
            if (station.id === stationId) {
              return {
                ...station,
                assignedStaff: station.assignedStaff.filter(staff => staff.id !== staffId)
              };
            }
            return station;
          })
        };

        return {
          ...scheduleDay,
          [shiftType]: updatedShift
        };
      }
      return scheduleDay;
    });

    setSchedule(updatedSchedule);

    // Add staff back to unassigned list
    const staffToAdd = schedule
      .find(d => d.day === day)?.[shiftType === 'lunch' ? 'lunch' : 'dinner']
      ?.stations.find(s => s.id === stationId)
      ?.assignedStaff.find(s => s.id === staffId);

    if (staffToAdd) {
      setUnassignedStaff(prev => [...prev, staffToAdd]);
    }

    // Update station colors
    updateStationColors();
  };

  const updateStationColors = useCallback(() => {
    setSchedule(prevSchedule => 
      prevSchedule.map(day => ({
        ...day,
        lunch: {
          ...day.lunch,
          stations: day.lunch.stations.map(station => ({
            ...station,
            color: station.assignedStaff.length >= station.requiredCapacity ? 'green' : 
                   station.assignedStaff.length >= station.requiredCapacity * 0.7 ? 'yellow' : 'red'
          }))
        },
        dinner: {
          ...day.dinner,
          stations: day.dinner.stations.map(station => ({
            ...station,
            color: station.assignedStaff.length >= station.requiredCapacity ? 'green' : 
                   station.assignedStaff.length >= station.requiredCapacity * 0.7 ? 'yellow' : 'red'
          }))
        }
      }))
    );
  }, []);

  const getStationColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-50 border-green-200';
      case 'yellow': return 'bg-yellow-50 border-yellow-200';
      case 'red': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getCapacityColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateAISchedule = async () => {
    setIsGeneratingAI(true);
    setAiProgress(0);

    // Simulate AI processing
    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGeneratingAI(false);
          autoAssignStaff();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const autoAssignStaff = async () => {
    try {
      // Fetch weather data to inform staffing decisions
      const weatherResponse = await fetch('/api/weather');
      let weatherData = null;
      
      if (weatherResponse.ok) {
        weatherData = await weatherResponse.json();
      }
      
      const availableStaff = [...unassignedStaff];
      
      // Enhanced logic to assign staff based on weather conditions
      schedule.forEach(day => {
        (['lunch', 'dinner'] as const).forEach((shiftType) => {
          const shift = day[shiftType];
          shift.stations.forEach((station: Station) => {
            // Find available staff for this station
            const qualifiedStaff = availableStaff.filter(staff => 
              staff.stations.includes(station.name) &&
              staff.availability.includes(day.day) &&
              staff.conflicts.filter(c => c.day === day.day).length === 0
            );
            
            // Apply weather-based staffing adjustments
            if (weatherData) {
              const dayWeather = weatherData.forecast.find((w: any) => w.day === day.day);
              if (dayWeather) {
                let capacityMultiplier = 1.0;
                
                // Adjust capacity based on weather impact
                switch (dayWeather.staffingImpact) {
                  case 'high':
                    capacityMultiplier = 0.7; // Reduce by 30%
                    break;
                  case 'medium':
                    capacityMultiplier = 0.85; // Reduce by 15%
                    break;
                  case 'low':
                    capacityMultiplier = 1.0; // Normal capacity
                    break;
                }
                
                // Adjust required capacity based on weather
                const adjustedCapacity = Math.max(1, Math.round(station.requiredCapacity * capacityMultiplier));
                
                // Prioritize high-performance staff during challenging weather
                if (dayWeather.staffingImpact !== 'low') {
                  qualifiedStaff.sort((a, b) => b.performance - a.performance);
                }
                
                // Assign staff up to adjusted capacity
                const staffToAssign = qualifiedStaff.slice(0, adjustedCapacity);
                
                staffToAssign.forEach(staff => {
                  station.assignedStaff.push(staff);
                  // Remove from available staff
                  const index = availableStaff.findIndex(s => s.id === staff.id);
                  if (index > -1) availableStaff.splice(index, 1);
                });
                
                return; // Skip the default assignment below
              }
            }
            
            // Default assignment if no weather data
            const staffToAssign = qualifiedStaff.slice(0, station.requiredCapacity);
            
            staffToAssign.forEach(staff => {
              station.assignedStaff.push(staff);
              // Remove from available staff
              const index = availableStaff.findIndex(s => s.id === staff.id);
              if (index > -1) availableStaff.splice(index, 1);
            });
          });
        });
      });
      
      // Update unassigned staff
      setUnassignedStaff(availableStaff);
      
      // Update station colors
      updateStationColors();
      
    } catch (error) {
      console.error('Error in auto-assignment:', error);
      // Fallback to basic assignment
      const availableStaff = [...unassignedStaff];
      
      schedule.forEach(day => {
        (['lunch', 'dinner'] as const).forEach((shiftType) => {
          const shift = day[shiftType];
          shift.stations.forEach((station: Station) => {
            const qualifiedStaff = availableStaff.filter(staff => 
              staff.stations.includes(station.name) &&
              staff.availability.includes(day.day) &&
              staff.conflicts.filter(c => c.day === day.day).length === 0
            );
            
            const staffToAssign = qualifiedStaff.slice(0, station.requiredCapacity);
            
            staffToAssign.forEach(staff => {
              station.assignedStaff.push(staff);
              const index = availableStaff.findIndex(s => s.id === staff.id);
              if (index > -1) availableStaff.splice(index, 1);
            });
          });
        });
      });
      
      setUnassignedStaff(availableStaff);
      updateStationColors();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">AI Staffing Optimization</h1>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Demo</span>
            </div>
            
            <button 
              onClick={generateAISchedule}
              disabled={isGeneratingAI}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGeneratingAI ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating... {aiProgress}%</span>
                </>
              ) : (
                <span>Generate AI Schedule</span>
              )}
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-1 pb-4">
            {['Overview', 'Scheduling', 'Analytics', 'Staff'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === 'Scheduling'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conflict Alert */}
      {conflictAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {conflictAlert}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Weekly Schedule */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
                <p className="text-sm text-gray-500 mt-1">Drag staff cards into shifts/stations.</p>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 w-20">Day</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Lunch (11:00-15:00)</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Dinner (17:00-22:00)</th>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <th className="py-2 px-4"></th>
                        <th className="py-2 px-4">
                          <div className="flex justify-center space-x-4">
                            {schedule.map((day) => (
                              <div key={day.day} className="text-center">
                                <div className="text-lg" title="Weather forecast will appear here">🌤️</div>
                                <div className="text-xs text-gray-500">{day.day}</div>
                              </div>
                            ))}
                          </div>
                        </th>
                        <th className="py-2 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((day) => (
                        <tr key={day.day} className="border-b">
                          <td className="py-4 px-4 font-medium text-gray-900">{day.day}</td>
                          
                          {/* Lunch Shift */}
                          <td className="py-4 px-4">
                            <div className="grid grid-cols-2 gap-4">
                              {day.lunch.stations.map((station) => (
                                <div
                                  key={station.id}
                                  className={`p-3 border rounded-lg ${getStationColor(station.color)}`}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDrop(e, station, day.day, 'lunch')}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900">{station.name}</h4>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCapacityColor(station.color)}`}>
                                      {station.assignedStaff.length}/{station.requiredCapacity}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    {station.assignedStaff.map((staff) => (
                                      <div
                                        key={`${station.id}-${staff.id}-lunch`}
                                        className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                                        onClick={() => removeStaffFromStation(staff.id, station.id, day.day, 'lunch')}
                                        title="Click to remove"
                                      >
                                        <span className="text-sm font-medium text-gray-900">{staff.name}</span>
                                        <span className="text-xs text-gray-500">{staff.role}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          
                          {/* Dinner Shift */}
                          <td className="py-4 px-4">
                            <div className="grid grid-cols-2 gap-4">
                              {day.dinner.stations.map((station) => (
                                <div
                                  key={station.id}
                                  className={`p-3 border rounded-lg ${getStationColor(station.color)}`}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDrop(e, station, day.day, 'dinner')}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900">{station.name}</h4>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCapacityColor(station.color)}`}>
                                      {station.assignedStaff.length}/{station.requiredCapacity}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    {station.assignedStaff.map((staff) => (
                                      <div
                                        key={`${station.id}-${staff.id}-dinner`}
                                        className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                                        onClick={() => removeStaffFromStation(staff.id, station.id, day.day, 'dinner')}
                                        title="Click to remove"
                                      >
                                        <span className="text-sm font-medium text-gray-900">{staff.name}</span>
                                        <span className="text-xs text-gray-500">{staff.role}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Weather and Staff */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weather Forecast */}
            <div>
              <WeatherForecast />
            </div>

            {/* Unassigned Staff */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Unassigned Staff</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {unassignedStaff.map((staff) => (
                    <div
                      key={staff.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, staff)}
                      className={`p-4 border rounded-lg hover:bg-gray-100 cursor-move transition-colors ${
                        staff.conflicts.length > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="mb-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{staff.name}</h3>
                          {staff.conflicts.length > 0 && (
                            <span className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-1">
                              Conflicts
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div>Perf {staff.performance}%</div>
                        <div>Avail {staff.availability.join(', ')}</div>
                        <div>Stations: {staff.stations.join(', ')}</div>
                        
                        {staff.conflicts.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-red-200">
                            <div className="text-red-600 font-medium">Conflicts:</div>
                            {staff.conflicts.map((conflict, index) => (
                              <div key={index} className="text-red-500">
                                {conflict.type}: {conflict.reason} ({conflict.day})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
