import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/services/database";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json({ 
        error: "Missing organizationId parameter" 
      }, { status: 400 });
    }

    console.log('🔍 Fetching schedules for organization:', organizationId);

    // First, test if the schedules table exists
    try {
      const { data: tableTest, error: tableError } = await supabase
        .from('schedules')
        .select('count')
        .limit(1);
      
      console.log('🔍 Table test result:', tableTest, 'error:', tableError);
      
      if (tableError) {
        console.error('❌ Schedules table error:', tableError);
        // Return empty schedule structure if table doesn't exist or has issues
        return NextResponse.json({ 
          success: true,
          shifts: {},
          scheduleId: null,
          weekStart: null,
          totalLaborCost: 0,
          totalHours: 0,
          error: "Schedules table not accessible"
        });
      }
      
      // Also test a simple count query
      const { count, error: countError } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true });
      
      console.log('🔍 Schedule count:', count, 'error:', countError);
      
    } catch (tableTestError) {
      console.error('❌ Table test failed:', tableTestError);
      return NextResponse.json({ 
        success: true,
        shifts: {},
        scheduleId: null,
        weekStart: null,
        totalLaborCost: 0,
        totalHours: 0,
        error: "Database connection issue"
      });
    }

    // Get the most recent schedule for this organization
    let schedules;
    try {
      schedules = await DatabaseService.getSchedules(organizationId);
      console.log('📅 Raw schedules response:', schedules);
    } catch (error) {
      console.error('❌ Error calling getSchedules:', error);
      // Return empty schedule structure if database call fails
      return NextResponse.json({ 
        success: true,
        shifts: {},
        scheduleId: null,
        weekStart: null,
        totalLaborCost: 0,
        totalHours: 0,
        error: "Failed to fetch schedules from database"
      });
    }
    
    // Ensure schedules is always an array
    if (!Array.isArray(schedules)) {
      console.warn('⚠️ getSchedules returned non-array:', schedules);
      schedules = [];
    }
    
    if (schedules && schedules.length > 0) {
      // Return the most recent schedule with the shifts structure
      const latestSchedule = schedules[0];
      console.log('✅ Found latest schedule:', latestSchedule.id);
      
      // Transform the database schedule format to match frontend expectations
      const transformedShifts: any = {};
      
      if (latestSchedule.shifts) {
        // Map database day names to frontend day names
        const dayMapping: { [key: string]: string } = {
          'monday': 'Mon',
          'tuesday': 'Tue', 
          'wednesday': 'Wed',
          'thursday': 'Thu',
          'friday': 'Fri',
          'saturday': 'Sat',
          'sunday': 'Sun'
        };
        
        // Map database station names to frontend station names
        const stationMapping: { [key: string]: string } = {
          'kitchen': 'Kitchen',
          'front_of_house': 'Front of House',
          'bar': 'Bar',
          'host': 'Host'
        };
        
        Object.entries(latestSchedule.shifts).forEach(([dbDay, dbDayData]: [string, any]) => {
          const frontendDay = dayMapping[dbDay.toLowerCase()];
          if (frontendDay && dbDayData) {
            transformedShifts[frontendDay] = {
              lunch: {
                name: 'Lunch',
                time: '11:00-15:00',
                stations: {}
              },
              dinner: {
                name: 'Dinner', 
                time: '17:00-22:00',
                stations: {}
              }
            };
            
            // Transform lunch stations
            if (dbDayData.lunch?.stations) {
              Object.entries(dbDayData.lunch.stations).forEach(([dbStation, dbStationData]: [string, any]) => {
                const frontendStation = stationMapping[dbStation.toLowerCase()] || dbStation;
                if (frontendStation) {
                  (transformedShifts[frontendDay] as any).lunch.stations[frontendStation] = {
                    name: frontendStation,
                    requiredCapacity: 2, // Default capacity
                    assignedStaff: dbStationData.assignedStaff || [],
                    color: 'yellow'
                  };
                }
              });
            }
            
            // Transform dinner stations
            if (dbDayData.dinner?.stations) {
              Object.entries(dbDayData.dinner.stations).forEach(([dbStation, dbStationData]: [string, any]) => {
                const frontendStation = stationMapping[dbStation.toLowerCase()] || dbStation;
                if (frontendStation) {
                  (transformedShifts[frontendDay] as any).dinner.stations[frontendStation] = {
                    name: frontendStation,
                    requiredCapacity: 2, // Default capacity
                    assignedStaff: dbStationData.assignedStaff || [],
                    color: 'yellow'
                  };
                }
              });
            }
          }
        });
      }
      
      console.log('🔄 Transformed shifts for frontend:', transformedShifts);
      
      return NextResponse.json({ 
        success: true,
        shifts: transformedShifts,
        scheduleId: latestSchedule.id,
        weekStart: latestSchedule.week_start_date,
        totalLaborCost: latestSchedule.total_labor_cost,
        totalHours: latestSchedule.total_hours
      });
    } else {
      console.log('ℹ️ No schedules found for organization');
      // No schedules found, return empty structure
      return NextResponse.json({ 
        success: true,
        shifts: {},
        scheduleId: null,
        weekStart: null,
        totalLaborCost: 0,
        totalHours: 0
      });
    }
    
  } catch (error) {
    console.error("❌ Schedule API error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch schedules",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
