import { NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai";
import { DatabaseService } from "@/lib/services/database";

export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function POST(req: Request) {
  try {
    console.log('🚀 Starting AI-powered schedule optimization...');
    
    const { organizationId, startDate, endDate, staffMembers: requestStaffMembers, weatherData: requestWeatherData } = await req.json();
    
    if (!organizationId || !startDate || !endDate) {
      return NextResponse.json({ 
        error: "Organization ID, start date, and end date are required" 
      }, { status: 400 });
    }

    // Fetch all necessary data for AI analysis
    console.log('📊 Fetching data for AI analysis...');
    
    const [staffMembers, historicalData, businessRules, weatherData] = await Promise.all([
      DatabaseService.getStaffForScheduling(organizationId),
      DatabaseService.getHistoricalDataForScheduling(organizationId, '30d'),
      DatabaseService.getBusinessRules(organizationId),
      requestWeatherData || fetch(`/api/weather?city=Wellington&country=NZ`).then(res => res.json()).catch(() => null)
    ]);

    if (!staffMembers || staffMembers.length === 0) {
      return NextResponse.json({ 
        error: "No staff members found for this organization" 
      }, { status: 400 });
    }

    // Transform staff data for AI consumption
    const transformedStaff = staffMembers.map(staff => ({
      id: staff.id,
      name: `${staff.first_name} ${staff.last_name}`,
      role: staff.role,
      hourlyWage: staff.hourly_wage,
      performance: staff.performance_score,
      availability: staff.availability || {},
      stations: staff.stations || [],
      guaranteedHours: staff.guaranteed_hours
    }));

    console.log(`🤖 Sending ${transformedStaff.length} staff members to AI for optimization...`);

    // Generate AI-optimized schedule
    const aiResult = await AIService.generateOptimizedSchedule({
      organizationId,
      startDate,
      endDate,
      staffMembers: transformedStaff,
      historicalData: historicalData || [],
      weatherForecast: weatherData || {},
      businessRules: businessRules || {}
    });

    if (!aiResult.success) {
      console.error('❌ AI schedule optimization failed:', aiResult.error);
      return NextResponse.json({ 
        error: `AI optimization failed: ${aiResult.error}` 
      }, { status: 500 });
    }

    console.log('✅ AI schedule optimization completed successfully');

    // Extract the optimized schedule from AI response
    const { optimizedSchedule, reasoning, expectedEfficiency, costSavings, recommendations } = aiResult.data;

    // Calculate total labor cost and hours for the optimized schedule
    let totalLaborCost = 0;
    let totalHours = 0;

    if (optimizedSchedule) {
      Object.values(optimizedSchedule).forEach((day: any) => {
        Object.values(day).forEach((shift: any) => {
          if (shift.stations) {
            Object.entries(shift.stations).forEach(([stationName, station]: [string, any]) => {
              if (station.assignedStaff && Array.isArray(station.assignedStaff)) {
                station.assignedStaff.forEach((staff: any) => {
                  const shiftHours = shift.name === 'Lunch' ? 4 : 5;
                  totalHours += shiftHours;
                  
                  const staffMember = transformedStaff.find(s => s.id === staff.id);
                  if (staffMember?.hourlyWage) {
                    totalLaborCost += staffMember.hourlyWage * shiftHours;
                  }
                });
              }
            });
          }
        });
      });
    }

    // Save the AI-generated schedule to database
    const savedSchedule = await DatabaseService.createSchedule({
      organization_id: organizationId,
      week_start_date: startDate, // Assuming week_start_date is the startDate for the new structure
      shifts: optimizedSchedule,
      total_labor_cost: totalLaborCost,
      total_hours: totalHours,
      ai_generated: true
    });

    console.log('💾 AI-generated schedule saved to database');

    return NextResponse.json({
      success: true,
      message: "AI-optimized schedule generated successfully! 🎉",
      scheduleId: savedSchedule.id,
      schedule: optimizedSchedule,
      reasoning: reasoning,
      metrics: {
        expectedEfficiency: expectedEfficiency || 85,
        costSavings: costSavings || 0,
        totalLaborCost: totalLaborCost,
        totalHours: totalHours
      },
      recommendations: recommendations || [],
      aiCost: aiResult.cost?.totalCost || 0.001,
      nextSteps: [
        "Review the AI reasoning for schedule decisions",
        "Adjust assignments if needed",
        "Monitor performance against AI predictions"
      ]
    });

  } catch (error: any) {
    console.error('AI schedule optimization API error:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to generate AI-optimized schedule' 
    }, { status: 500 });
  }
}
