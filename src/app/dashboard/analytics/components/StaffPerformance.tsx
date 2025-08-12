"use client";

export interface StaffPerformance {
  id: string;
  name: string;
  role: string;
  performanceScore: number;
  attendanceRate: number;
  efficiencyRating: number;
  costPerHour: number;
  totalHours: number;
  trend: 'up' | 'down' | 'stable';
}

interface Props {
  staff: StaffPerformance[];
}

export default function StaffPerformance({ staff }: Props) {
  const sortedStaff = [...staff].sort((a, b) => b.performanceScore - a.performanceScore);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Staff Performance Rankings</h2>
      
      <div className="space-y-4">
        {sortedStaff.map((member, index) => (
          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Performance</div>
                <div className={`font-semibold ${getPerformanceColor(member.performanceScore)}`}>
                  {member.performanceScore}/100
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Attendance</div>
                <div className="font-semibold">{member.attendanceRate}%</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Efficiency</div>
                <div className="font-semibold">{member.efficiencyRating}%</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Cost/Hour</div>
                <div className="font-semibold">${member.costPerHour}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Hours</div>
                <div className="font-semibold">{member.totalHours}h</div>
              </div>
              
              <div className={`text-lg ${getTrendColor(member.trend)}`}>
                {getTrendIcon(member.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Performance Summary */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Top Performers</h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            {staff.filter(s => s.performanceScore >= 90).length} staff members with 90%+ performance
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Average Performance</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {(staff.reduce((sum, s) => sum + s.performanceScore, 0) / staff.length).toFixed(1)}% 
            across all staff
          </p>
        </div>
        
        <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
          <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Improvement Areas</h3>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            {staff.filter(s => s.performanceScore < 80).length} staff members need support
          </p>
        </div>
      </div>
    </div>
  );
}
