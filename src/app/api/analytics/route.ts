import { NextResponse } from "next/server";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // In a real app, this would fetch data from your database
    // For now, we'll return mock data
    const analyticsData = {
      laborCost: {
        current: 28.5,
        previous: 31.2,
        target: 25.0,
        trend: 'down',
        breakdown: {
          kitchen: 12.5,
          foh: 10.2,
          bar: 5.8
        }
      },
      staffingEfficiency: {
        current: 87,
        previous: 82,
        target: 90,
        trend: 'up',
        metrics: {
          coverage: 94,
          utilization: 89,
          satisfaction: 85
        }
      },
      scheduleQuality: {
        score: 92,
        previous: 88,
        improvements: [
          'Reduced overtime by 15%',
          'Better skill distribution',
          'Improved weekend coverage'
        ]
      },
      costSavings: {
        total: 2840,
        monthly: 2840,
        breakdown: {
          overtime: 1200,
          overstaffing: 890,
          skillMismatch: 750
        }
      },
      trends: [
        { date: '2024-01-01', laborCost: 31.2, efficiency: 82, quality: 88, savings: 0 },
        { date: '2024-01-08', laborCost: 30.8, efficiency: 83, quality: 89, savings: 450 },
        { date: '2024-01-15', laborCost: 30.1, efficiency: 85, quality: 90, savings: 890 },
        { date: '2024-01-22', laborCost: 29.5, efficiency: 86, quality: 91, savings: 1420 },
        { date: '2024-01-29', laborCost: 28.5, efficiency: 87, quality: 92, savings: 2840 }
      ],
      staffPerformance: [
        {
          id: 'S101',
          name: 'Emily Chen',
          role: 'FOH Manager',
          performanceScore: 95,
          attendanceRate: 98,
          efficiencyRating: 92,
          costPerHour: 32,
          totalHours: 120,
          trend: 'up'
        },
        {
          id: 'S102',
          name: 'Mai Kanako',
          role: 'Barista',
          performanceScore: 92,
          attendanceRate: 96,
          efficiencyRating: 89,
          costPerHour: 26,
          totalHours: 80,
          trend: 'up'
        },
        {
          id: 'S103',
          name: 'Alan James',
          role: 'Host',
          performanceScore: 88,
          attendanceRate: 94,
          efficiencyRating: 85,
          costPerHour: 25.5,
          totalHours: 75,
          trend: 'stable'
        },
        {
          id: 'S104',
          name: 'Sarah Wilson',
          role: 'Sous Chef',
          performanceScore: 91,
          attendanceRate: 97,
          efficiencyRating: 90,
          costPerHour: 30,
          totalHours: 110,
          trend: 'up'
        },
        {
          id: 'S105',
          name: 'Mike Rodriguez',
          role: 'Line Cook',
          performanceScore: 85,
          attendanceRate: 92,
          efficiencyRating: 82,
          costPerHour: 28,
          totalHours: 95,
          trend: 'down'
        }
      ]
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
