import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/services/database";

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

    const staff = await DatabaseService.getStaffForScheduling(organizationId);
    
    // Transform staff data to match the frontend expectations
    const transformedStaff = staff.map(member => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      role: member.role,
      performance: member.performance_score,
      availability: Object.entries(member.availability || {}).map(([day, data]: [string, any]) => 
        data.available ? day.charAt(0).toUpperCase() + day.slice(1, 3) : null
      ).filter(Boolean),
      stations: member.stations || [],
      hourlyWage: member.hourly_wage,
      conflicts: [], // TODO: Implement conflict detection
      image: undefined
    }));
    
    return NextResponse.json({ 
      success: true,
      staff: transformedStaff,
      count: transformedStaff.length
    });
    
  } catch (error) {
    console.error("Error fetching staff for scheduling:", error);
    return NextResponse.json({ 
      error: "Failed to fetch staff",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
