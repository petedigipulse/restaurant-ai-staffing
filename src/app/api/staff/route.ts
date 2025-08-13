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

    const staff = await DatabaseService.getStaffMembers(organizationId);
    
    return NextResponse.json({ 
      success: true,
      staff,
      count: staff.length
    });
    
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ 
      error: "Failed to fetch staff",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { organization_id, ...staffData } = body;
    
    if (!organization_id) {
      return NextResponse.json({ 
        error: "Missing organization_id" 
      }, { status: 400 });
    }

    const staff = await DatabaseService.createStaffMember({
      organization_id,
      ...staffData
    });
    
    return NextResponse.json({ 
      success: true,
      staff,
      message: "Staff member created successfully"
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating staff member:", error);
    return NextResponse.json({ 
      error: "Failed to create staff member",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
