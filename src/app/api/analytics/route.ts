import { NextResponse } from "next/server";
import { AnalyticsService } from "@/lib/services/analytics";

export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    const timeRange = searchParams.get('timeRange') as '7d' | '30d' | '90d' | '1y' || '30d';

    if (!organizationId) {
      return NextResponse.json({ 
        error: "Organization ID is required" 
      }, { status: 400 });
    }

    // Get analytics data
    const analyticsData = await AnalyticsService.getAnalyticsData(organizationId, timeRange);
    const chartData = await AnalyticsService.getChartData(organizationId, timeRange);
    const staffPerformance = await AnalyticsService.getStaffPerformanceData(organizationId);

    return NextResponse.json({
      success: true,
      data: {
        analytics: analyticsData,
        charts: chartData,
        staff: staffPerformance
      }
    });

  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to fetch analytics data' 
    }, { status: 500 });
  }
}
