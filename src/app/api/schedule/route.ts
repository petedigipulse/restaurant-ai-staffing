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

    const schedules = await DatabaseService.getSchedules(organizationId);
    
    return NextResponse.json({ 
      success: true,
      schedules,
      count: schedules.length
    });
    
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ 
      error: "Failed to fetch schedules",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
