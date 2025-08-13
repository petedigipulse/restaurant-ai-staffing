import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/services/database";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function POST(req: Request) {
  try {
    const { organizationId, weekStart, staffAssignments } = await req.json();
    
    console.log('Schedule generation request:', {
      organizationId,
      weekStart,
      staffAssignmentsKeys: staffAssignments ? Object.keys(staffAssignments) : null,
      sampleDay: staffAssignments ? Object.keys(staffAssignments)[0] : null,
      sampleShift: staffAssignments ? staffAssignments[Object.keys(staffAssignments)[0]] : null
    });
    
    if (!organizationId || !weekStart) {
      return NextResponse.json({ 
        error: "Missing required fields: organizationId and weekStart" 
      }, { status: 400 });
    }

    // Calculate total labor cost and hours
    let totalLaborCost = 0;
    let totalHours = 0;
    
    // Process staff assignments and calculate costs
    if (staffAssignments) {
      Object.values(staffAssignments).forEach((day: any) => {
        Object.values(day).forEach((shift: any) => {
          if (shift.stations) {
            // The stations are stored as an object with station names as keys
            Object.entries(shift.stations).forEach(([stationName, station]: [string, any]) => {
              if (station.assignedStaff && Array.isArray(station.assignedStaff)) {
                console.log(`Processing station ${stationName} with ${station.assignedStaff.length} staff`);
                station.assignedStaff.forEach((staff: any) => {
                  console.log('Staff member:', staff);
                  // Calculate hours based on shift duration
                  const shiftHours = shift.name === 'Lunch' ? 4 : 5; // Lunch: 4h, Dinner: 5h
                  totalHours += shiftHours;
                  
                  // Calculate cost based on hourly wage
                  if (staff.hourly_wage && typeof staff.hourly_wage === 'number') {
                    totalLaborCost += staff.hourly_wage * shiftHours;
                    console.log(`Added ${staff.hourly_wage * shiftHours} to total cost for ${staff.name}`);
                  } else {
                    console.warn('Staff member missing hourly_wage:', staff);
                  }
                });
              }
            });
          }
        });
      });
    }
    
    console.log('Schedule calculation:', {
      staffAssignments,
      totalLaborCost,
      totalHours
    });

    // Create the schedule in the database
    const schedule = await DatabaseService.createSchedule({
      organization_id: organizationId,
      week_start_date: weekStart,
      shifts: staffAssignments || {},
      total_labor_cost: totalLaborCost,
      total_hours: totalHours,
      ai_generated: true
    });

    return NextResponse.json({ 
      success: true,
      scheduleId: schedule.id,
      message: "Schedule generated and saved successfully",
      totalLaborCost,
      totalHours
    }, { status: 201 });
    
  } catch (error) {
    console.error("Schedule generation error:", error);
    return NextResponse.json({ 
      error: "Failed to generate schedule",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}


