"use client";
import { useState, useEffect } from "react";
import { DatabaseService } from "@/lib/services/database";
import { StaffMember } from "@/lib/supabase";
import WeatherForecast from "./components/WeatherForecast";
import ScheduleHistory from "./components/ScheduleHistory";
import { useSession } from "next-auth/react";
import AIOptimizationReport from './components/AIOptimizationReport';
import AIProgressTracker from './components/AIProgressTracker';
import { Button } from "@/components/ui/button";

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
  const { data: session } = useSession();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [unassignedStaff, setUnassignedStaff] = useState<StaffMember[]>([]);
  const [draggedStaff, setDraggedStaff] = useState<StaffMember | null>(null);
  const [conflictAlert, setConflictAlert] = useState<string | null>(null);
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

  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [showScheduleHistory, setShowScheduleHistory] = useState(false);
  const [aiOptimizationReport, setAiOptimizationReport] = useState<any>(null);
  const [showAIProgress, setShowAIProgress] = useState(false);

  // Load staff data from database
  useEffect(() => {
    const loadStaffData = async () => {
      try {
        // Get organization ID for the current authenticated user
        const currentOrgId = await DatabaseService.getCurrentUserOrganizationId();
        if (!currentOrgId) {
          console.error('No organization ID found for current user');
          setIsLoading(false);
          return;
        }
        
        setOrganizationId(currentOrgId);
        
        // Load staff members
        const staff = await DatabaseService.getStaffMembers(currentOrgId);
        setStaffMembers(staff || []);
        
        // Set unassigned staff (all staff start as unassigned)
        setUnassignedStaff(staff || []);
        
        // Load existing schedule data
        await loadExistingSchedule(currentOrgId);
        
        // Set loading to false after data is loaded
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading staff data:', error);
        setIsLoading(false);
      }
    };

    loadStaffData();
  }, []);

  // Load existing schedule from database
  const loadExistingSchedule = async (orgId: string) => {
    try {
      // Calculate current week start (Monday)
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
      const weekStartString = weekStart.toISOString().split('T')[0];

      console.log('🔄 Loading existing schedule for week:', weekStartString);
      
      const response = await fetch(`/api/schedule?organizationId=${orgId}`);
      if (response.ok) {
        const existingSchedule = await response.json();
        console.log('📅 Existing schedule data:', existingSchedule);
        
        if (existingSchedule && existingSchedule.shifts) {
          console.log('🔍 Found shifts data:', existingSchedule.shifts);
          
          // Use the transformed data directly from the API
          const transformedSchedule = schedule.map(day => {
            const dbDay = existingSchedule.shifts[day.day]; // Use exact day name (Mon, Tue, etc.)
            console.log(`🔍 Processing day ${day.day}:`, dbDay);
            
            if (dbDay) {
              return {
                ...day,
                lunch: {
                  ...day.lunch,
                  stations: day.lunch.stations.map(station => {
                    const dbStation = dbDay.lunch?.stations?.[station.name]; // Use exact station name
                    console.log(`🔍 Station ${station.name}:`, dbStation);
                    
                    if (dbStation?.assignedStaff && Array.isArray(dbStation.assignedStaff)) {
                      console.log(`✅ Found ${dbStation.assignedStaff.length} assigned staff for ${station.name}:`, dbStation.assignedStaff);
                      
                      // Map database staff assignments to our staff data
                      const assignedStaff = dbStation.assignedStaff.map((dbStaff: any) => {
                        // First try to find by UUID ID
                        let staffMember = staffMembers.find(s => s.id === dbStaff.id);
                        
                        // If not found by UUID, try to find by name (AI uses names as IDs)
                        if (!staffMember && dbStaff.name) {
                          staffMember = staffMembers.find(s => 
                            `${s.first_name} ${s.last_name}`.trim() === dbStaff.name.trim() ||
                            s.first_name === dbStaff.name ||
                            s.last_name === dbStaff.name
                          );
                        }
                        
                        if (staffMember) {
                          console.log(`✅ Found matching staff member:`, staffMember);
                          return staffMember;
                        } else {
                          console.log(`⚠️ Staff member not found in staffMembers, creating fallback:`, dbStaff);
                          return {
                            id: dbStaff.id,
                            first_name: dbStaff.first_name || dbStaff.name || 'Unknown',
                            last_name: dbStaff.last_name || '',
                            role: dbStaff.role || 'Staff',
                            performance_score: 80,
                            availability: { monday: { available: true }, tuesday: { available: true }, wednesday: { available: true }, thursday: { available: true }, friday: { available: true } },
                            stations: [station.name],
                            hourly_wage: dbStaff.hourly_wage || 25,
                            organization_id: orgId,
                            email: '',
                            guaranteed_hours: 0,
                            employment_type: 'part-time' as const,
                            contact_info: {},
                            start_date: new Date().toISOString(),
                            status: 'active' as const,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                          };
                        }
                      });
                      
                      console.log(`🎯 Final assigned staff for ${station.name}:`, assignedStaff);
                      
                      return {
                        ...station,
                        assignedStaff,
                        color: (assignedStaff.length >= station.requiredCapacity ? 'green' : 'yellow') as 'green' | 'yellow' | 'red'
                      };
                    } else {
                      console.log(`❌ No assigned staff found for station ${station.name}`);
                    }
                    return station;
                  })
                },
                dinner: {
                  ...day.dinner,
                  stations: day.dinner.stations.map(station => {
                    const dbStation = dbDay.dinner?.stations?.[station.name]; // Use exact station name
                    console.log(`🔍 Dinner station ${station.name}:`, dbStation);
                    
                    if (dbStation?.assignedStaff && Array.isArray(dbStation.assignedStaff)) {
                      console.log(`✅ Found ${dbStation.assignedStaff.length} assigned staff for dinner ${station.name}:`, dbStation.assignedStaff);
                      
                      const assignedStaff = dbStation.assignedStaff.map((dbStaff: any) => {
                        // First try to find by UUID ID
                        let staffMember = staffMembers.find(s => s.id === dbStaff.id);
                        
                        // If not found by UUID, try to find by name (AI uses names as IDs)
                        if (!staffMember && dbStaff.name) {
                          staffMember = staffMembers.find(s => 
                            `${s.first_name} ${s.last_name}`.trim() === dbStaff.name.trim() ||
                            s.first_name === dbStaff.name ||
                            s.last_name === dbStaff.name
                          );
                        }
                        
                        if (staffMember) {
                          console.log(`✅ Found matching staff member for dinner:`, staffMember);
                          return staffMember;
                        } else {
                          console.log(`⚠️ Dinner staff member not found in staffMembers, creating fallback:`, dbStaff);
                          return {
                            id: dbStaff.id,
                            first_name: dbStaff.first_name || dbStaff.name || 'Unknown',
                            last_name: dbStaff.last_name || '',
                            role: dbStaff.role || 'Staff',
                            performance_score: 80,
                            availability: { monday: { available: true }, tuesday: { available: true }, wednesday: { available: true }, thursday: { available: true }, friday: { available: true } },
                            stations: [station.name],
                            hourly_wage: dbStaff.hourly_wage || 25,
                            organization_id: orgId,
                            email: '',
                            guaranteed_hours: 0,
                            employment_type: 'part-time' as const,
                            contact_info: {},
                            start_date: new Date().toISOString(),
                            status: 'active' as const,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                          };
                        }
                      });
                      
                      console.log(`🎯 Final assigned staff for dinner ${station.name}:`, assignedStaff);
                      
                      return {
                        ...station,
                        assignedStaff,
                        color: (assignedStaff.length >= station.requiredCapacity ? 'green' : 'yellow') as 'green' | 'yellow' | 'red'
                      };
                    } else {
                      console.log(`❌ No assigned staff found for dinner station ${station.name}`);
                    }
                    return station;
                  })
                }
              };
            } else {
              console.log(`❌ No data found for day ${day.day}`);
            }
            return day;
          });
          
          console.log('✅ Final transformed schedule:', transformedSchedule);
          setSchedule(transformedSchedule);
          
          // Update station colors after loading
          setTimeout(() => {
            updateStationColors();
          }, 100);
        } else {
          console.log('❌ No shifts data found in schedule response');
        }
      } else {
        console.error('❌ Failed to fetch schedule:', response.status);
      }
    } catch (error) {
      console.error('Error loading existing schedule:', error);
    }
  };

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
      const conflictMessages = conflicts.map((c: any) => `${c.type}: ${c.reason}`).join(', ');
      setConflictAlert(`${draggedStaff.first_name} ${draggedStaff.last_name} has conflicts on ${day}: ${conflictMessages}`);
      setTimeout(() => setConflictAlert(null), 8000);
      return;
    }

    // Check if staff is qualified for this station
    if (!draggedStaff.stations.includes(targetStation.name)) {
      setConflictAlert(`${draggedStaff.first_name} ${draggedStaff.last_name} is not qualified for ${targetStation.name}`);
      setTimeout(() => setConflictAlert(null), 8000);
      return;
    }

    // Check if staff is available on this day
    if (!draggedStaff.availability && typeof draggedStaff.availability === 'object') {
      const availableDays = Object.keys(draggedStaff.availability).filter(dayKey =>
        draggedStaff.availability[dayKey] && draggedStaff.availability[dayKey].available
      );
      if (!availableDays.includes(day.toLowerCase())) {
        setConflictAlert(`${draggedStaff.first_name} ${draggedStaff.last_name} is not available on ${day}`);
        setTimeout(() => setConflictAlert(null), 8000);
        return;
      }
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
    // Since the database StaffMember type doesn't have conflicts, return empty array
    return [];
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

  const updateStationColors = () => {
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
  };

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
    if (!organizationId) {
      setConflictAlert('Organization ID not found. Please refresh the page.');
      return;
    }

    setIsGeneratingAI(true);
    setShowAIProgress(true); // Show progress tracker
    
    try {
      // Calculate current week start (Monday)
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
      const weekStartString = weekStart.toISOString().split('T')[0];

      const response = await fetch('/api/ai/schedule/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          weekStart: weekStartString,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.schedule) {
          // Store the AI optimization report
          setAiOptimizationReport({
            reasoning: result.reasoning || 'AI analysis completed successfully.',
            expectedEfficiency: result.metrics?.expectedEfficiency || 85,
            costSavings: result.metrics?.costSavings || 0,
            totalLaborCost: result.metrics?.totalLaborCost || 0,
            totalHours: result.metrics?.totalHours || 0,
            recommendations: result.recommendations || [],
            nextSteps: result.nextSteps || [],
            aiCost: result.aiCost || 0
          });

          // Update the schedule with AI-generated assignments
          const aiSchedule = result.schedule;
          const updatedSchedule = schedule.map(day => {
            const aiDay = aiSchedule[day.day.toLowerCase()];
            if (aiDay) {
              return {
                ...day,
                lunch: {
                  ...day.lunch,
                  stations: day.lunch.stations.map(station => {
                    const aiStation = aiDay.lunch?.stations?.[station.name.toLowerCase()];
                    if (aiStation?.assignedStaff) {
                      const assignedStaff = aiStation.assignedStaff.map((aiStaff: any) => {
                        const staffMember = staffMembers.find(s => s.id === aiStaff.id);
                        return staffMember || {
                          id: aiStaff.id,
                          first_name: aiStaff.first_name,
                          last_name: aiStaff.last_name,
                          role: aiStaff.role,
                          performance_score: 80,
                          availability: { monday: { available: true }, tuesday: { available: true }, wednesday: { available: true }, thursday: { available: true }, friday: { available: true } },
                          stations: [station.name],
                          hourly_wage: 25,
                          conflicts: []
                        };
                      });
                      
                      return {
                        ...station,
                        assignedStaff,
                        color: (assignedStaff.length >= station.requiredCapacity ? 'green' : 'yellow') as 'green' | 'yellow' | 'red'
                      };
                    }
                    return station;
                  })
                },
                dinner: {
                  ...day.dinner,
                  stations: day.dinner.stations.map(station => {
                    const aiStation = aiDay.dinner?.stations?.[station.name.toLowerCase()];
                    if (aiStation?.assignedStaff) {
                      const assignedStaff = aiStation.assignedStaff.map((aiStaff: any) => {
                        const staffMember = staffMembers.find(s => s.id === aiStaff.id);
                        return staffMember || {
                          id: aiStaff.id,
                          first_name: aiStaff.first_name,
                          last_name: aiStaff.last_name,
                          role: aiStaff.role,
                          performance_score: 80,
                          availability: { monday: { available: true }, tuesday: { available: true }, wednesday: { available: true }, thursday: { available: true }, friday: { available: true } },
                          stations: [station.name],
                          hourly_wage: 25,
                          conflicts: []
                        };
                      });
                      
                      return {
                        ...station,
                        assignedStaff,
                        color: (assignedStaff.length >= station.requiredCapacity ? 'green' : 'yellow') as 'green' | 'yellow' | 'red'
                      };
                    }
                    return station;
                  })
                }
              };
            }
            return day;
          });

          setSchedule(updatedSchedule);
          setConflictAlert(`🎉 AI Schedule Generated! ${result.reasoning ? 'Reasoning: ' + result.reasoning.substring(0, 100) + '...' : ''} Expected Efficiency: ${result.metrics?.expectedEfficiency}%, Cost Savings: $${result.metrics?.costSavings}`);
          
          // Reload schedule data from database to show the new AI-generated assignments
          if (organizationId) {
            await loadExistingSchedule(organizationId);
          }
        } else {
          setConflictAlert('AI generated schedule but no schedule data was returned. Please try again.');
        }
      } else {
        const error = await response.json();
        setConflictAlert(`AI schedule generation failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating AI schedule:', error);
      setConflictAlert('Failed to generate AI schedule. Please try again.');
    } finally {
      setIsGeneratingAI(false);
      setShowAIProgress(false); // Hide progress tracker
      setTimeout(() => setConflictAlert(null), 10000);
    }
  };

  const autoAssignStaff = async () => {
    try {
      // Fetch weather data to inform staffing decisions
      const weatherResponse = await fetch('/api/weather');
      let weatherData = null;
      
      if (weatherResponse.ok) {
        weatherData = await weatherResponse.json();
      }
      
      const availableStaff = [...staffMembers];
      
      // Enhanced logic to assign staff based on weather conditions
      schedule.forEach(day => {
        (['lunch', 'dinner'] as const).forEach((shiftType) => {
          const shift = day[shiftType];
          shift.stations.forEach((station: Station) => {
            // Find available staff for this station
            const qualifiedStaff = availableStaff.filter(staff => 
              staff.stations.includes(station.name) &&
              staff.availability && typeof staff.availability === 'object' &&
              Object.keys(staff.availability).filter(dayKey => 
                staff.availability[dayKey] && staff.availability[dayKey].available
              ).includes(day.day.toLowerCase())
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
                  qualifiedStaff.sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0));
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
      const availableStaff = [...staffMembers];
      
      schedule.forEach(day => {
        (['lunch', 'dinner'] as const).forEach((shiftType) => {
          const shift = day[shiftType];
          shift.stations.forEach((station: Station) => {
            const qualifiedStaff = availableStaff.filter(staff => 
              staff.stations.includes(station.name) &&
              staff.availability && typeof staff.availability === 'object' &&
              Object.keys(staff.availability).filter(dayKey => 
                staff.availability[dayKey] && staff.availability[dayKey].available
              ).includes(day.day.toLowerCase())
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

  const saveSchedule = async () => {
    if (!organizationId) {
      setConflictAlert('Please complete onboarding to set up your organization first');
      setTimeout(() => setConflictAlert(null), 8000);
      return;
    }

    try {
      // Get current week start date (Monday)
      const today = new Date();
      const monday = new Date(today);
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      monday.setDate(today.getDate() - daysToMonday);
      const weekStart = monday.toISOString().split('T')[0];

      // Transform schedule data for API
      const staffAssignments = schedule.reduce((acc, day) => {
        acc[day.day] = {
          lunch: {
            name: 'Lunch',
            time: '11:00-15:00',
            stations: day.lunch.stations.reduce((stationAcc, station) => {
              stationAcc[station.name] = {
                requiredCapacity: station.requiredCapacity,
                assignedStaff: station.assignedStaff.map(staff => ({
                  id: staff.id,
                  first_name: staff.first_name,
                  last_name: staff.last_name,
                  role: staff.role,
                  hourly_wage: staff.hourly_wage
                }))
              };
              return stationAcc;
            }, {} as any)
          },
          dinner: {
            name: 'Dinner',
            time: '17:00-22:00',
            stations: day.dinner.stations.reduce((stationAcc, station) => {
              stationAcc[station.name] = {
                requiredCapacity: station.requiredCapacity,
                assignedStaff: station.assignedStaff.map(staff => ({
                  id: staff.id,
                  first_name: staff.first_name,
                  last_name: staff.last_name,
                  role: staff.role,
                  hourly_wage: staff.hourly_wage
                }))
              };
              return stationAcc;
            }, {} as any)
          }
        };
        return acc;
      }, {} as any);

      console.log('Sending staffAssignments:', JSON.stringify(staffAssignments, null, 2));
      
      const response = await fetch('/api/schedule/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          weekStart: weekStart,
          staffAssignments
        })
      });

      if (response.ok) {
        const result = await response.json();
        setConflictAlert(`Schedule saved successfully! Total cost: $${result.totalLaborCost.toFixed(2)}, Total hours: ${result.totalHours}`);
        setTimeout(() => setConflictAlert(null), 8000);
      } else {
        const error = await response.json();
        setConflictAlert(`Failed to save schedule: ${error.error}`);
        setTimeout(() => setConflictAlert(null), 8000);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      setConflictAlert('Failed to save schedule. Please try again.');
      setTimeout(() => setConflictAlert(null), 8000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">AI Staffing Optimization</h1>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Live</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={saveSchedule}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Schedule
              </button>
              
              <Button
                onClick={generateAISchedule}
                disabled={isGeneratingAI || !organizationId}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isGeneratingAI ? 'Generating...' : 'Generate AI Schedule'}
              </Button>
              
              {/* View AI Report Button */}
              {aiOptimizationReport && (
                <Button
                  onClick={() => setAiOptimizationReport(null)}
                  variant="outline"
                  className="px-6 py-3 rounded-lg font-semibold border-purple-600 text-purple-600 hover:bg-purple-50 transition-all duration-200"
                >
                  View AI Report
                </Button>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-1 pb-4">
            {[
              { name: 'Overview', href: '/dashboard' },
              { name: 'Scheduling', href: '/dashboard/schedule' },
              { name: 'Analytics', href: '/dashboard/analytics' },
              { name: 'Staff', href: '/dashboard/staff' }
            ].map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab.name === 'Scheduling'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Conflict Alert */}
      {conflictAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`border px-4 py-3 rounded-lg ${
            conflictAlert.includes('successfully') 
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
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
                                        <span className="text-sm font-medium text-gray-900">{staff.first_name} {staff.last_name}</span>
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
                                        <span className="text-sm font-medium text-gray-900">{staff.first_name} {staff.last_name}</span>
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
                <p className="text-sm text-gray-500 mt-1">{staffMembers.length} staff members available</p>
              </div>
              
              <div className="p-6">
                {staffMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>All staff assigned!</p>
                    <p className="text-sm">Drag staff from stations to reassign</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {staffMembers.map((staff) => (
                      <div
                        key={staff.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, staff)}
                        className="p-4 border rounded-lg hover:bg-gray-100 cursor-move transition-colors bg-gray-50"
                      >
                        <div className="mb-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">{staff.first_name} {staff.last_name}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{staff.role}</p>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div>Perf {staff.performance_score || 0}%</div>
                          <div>Avail {staff.availability && typeof staff.availability === 'object' 
                            ? Object.keys(staff.availability).filter(day => 
                                staff.availability[day as keyof typeof staff.availability] && 
                                (staff.availability[day as keyof typeof staff.availability] as any)?.available
                              ).join(', ')
                            : 'Not specified'}</div>
                          <div>Stations: {staff.stations.join(', ')}</div>
                          <div>Wage: ${staff.hourly_wage}/hr</div>
                          
                          {/* Conflicts removed since database StaffMember type doesn't have conflicts */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Schedule History */}
        {organizationId && (
          <div className="mt-8">
            <ScheduleHistory organizationId={organizationId} />
          </div>
        )}

        {/* AI Progress Tracker */}
        <AIProgressTracker
          isVisible={showAIProgress}
          onComplete={() => setShowAIProgress(false)}
        />

        {/* AI Optimization Report */}
        <AIOptimizationReport
          report={aiOptimizationReport}
          onClose={() => setAiOptimizationReport(null)}
        />
      </div>
    </div>
  );
}
