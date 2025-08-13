"use client";
import Link from "next/link";

interface CompleteData {
  restaurant: {
    name: string;
    type: string;
    timezone: string;
    operatingHours: any;
  };
  staff: any[];
  businessRules: {
    minStaffing: { kitchen: number; foh: number; bar: number };
    maxOvertime: number;
    breakRequirements: { meal: number; rest: number };
    targetLaborCost: number;
  };
  historicalData: {
    averageDailySales: number;
    peakHours: string[];
    seasonalPatterns: string[];
    salesData?: any[]; // Added for sales data
  };
  goals: {
    priority: string;
    staffSatisfaction: number;
    customerService: number;
    costOptimization: number;
    flexibility: number;
    training: number;
    specialEvents: string[];
    schedulingPreferences: string[];
  };
}

interface Props {
  data: CompleteData;
}

export default function CompleteStep({ data }: Props) {
  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: string } = {
      'cost-optimization': 'Cost Optimization',
      'staff-satisfaction': 'Staff Satisfaction',
      'customer-service': 'Customer Service',
      'flexibility': 'Flexibility',
      'training': 'Training & Development'
    };
    return labels[priority] || priority;
  };

  const getOperatingDays = () => {
    const days = Object.entries(data.restaurant.operatingHours);
    return days
      .filter(([_, hours]: [string, any]) => !hours.closed)
      .map(([day, hours]: [string, any]) => 
        `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.open}-${hours.close}`
      );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold">Setup Complete!</h1>
        <p className="text-muted-foreground">
          Your AI staffing system is ready to generate intelligent schedules
        </p>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Restaurant</h3>
            <p className="text-2xl font-bold text-blue-600">{data.restaurant.name || 'Not set'}</p>
            <p className="text-sm text-blue-600">{data.restaurant.type || 'Type not selected'}</p>
          </div>

          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
            <h3 className="font-semibold text-green-800 dark:text-green-200">Staff Members</h3>
            <p className="text-2xl font-bold text-green-600">{data.staff.length}</p>
            <p className="text-sm text-green-600">Team members added</p>
          </div>

          <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">Target Labor Cost</h3>
            <p className="text-2xl font-bold text-purple-600">{data.businessRules.targetLaborCost}%</p>
            <p className="text-sm text-purple-600">of revenue</p>
          </div>

          <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200">Priority</h3>
            <p className="text-lg font-bold text-orange-600">{getPriorityLabel(data.goals.priority)}</p>
            <p className="text-sm text-orange-600">Primary focus</p>
          </div>
        </div>

        {/* Detailed Summary */}
        <div className="space-y-6">
          {/* Restaurant Information */}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold">Restaurant Information</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Name:</span>
                  <p className="font-medium">{data.restaurant.name || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Type:</span>
                  <p className="font-medium">{data.restaurant.type || 'Not selected'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Timezone:</span>
                  <p className="font-medium">{data.restaurant.timezone || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Operating Days:</span>
                  <p className="font-medium">{getOperatingDays().length} days per week</p>
                </div>
              </div>
              {getOperatingDays().length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Hours:</span>
                  <div className="mt-1 space-y-1">
                    {getOperatingDays().map((hours, index) => (
                      <p key={index} className="text-sm">{hours}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Staff Summary */}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold">Staff Summary</h3>
            </div>
            <div className="p-4">
              {!Array.isArray(data.staff) || data.staff.length === 0 ? (
                <p className="text-muted-foreground">No staff members added</p>
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-3">
                                      <div>
                    <span className="text-sm font-medium text-muted-foreground">Total Staff:</span>
                    <p className="text-lg font-medium">{Array.isArray(data.staff) ? data.staff.length : 0} members</p>
                  </div>
                                      <div>
                    <span className="text-sm font-medium text-muted-foreground">Full-time:</span>
                    <p className="text-lg font-medium">
                      {Array.isArray(data.staff) ? data.staff.filter(s => s.employmentType === 'full-time').length : 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Part-time/Casual:</span>
                    <p className="text-lg font-medium">
                      {Array.isArray(data.staff) ? data.staff.filter(s => s.employmentType !== 'full-time').length : 0}
                    </p>
                  </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Roles:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {Array.isArray(data.staff) ? 
                        Array.from(new Set(data.staff.map(s => s.role))).filter(Boolean).map(role => (
                          <span key={role} className="px-2 py-1 bg-muted rounded text-sm">{role}</span>
                        ))
                        : <span className="text-muted-foreground">No roles defined</span>
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Rules */}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold">Business Rules</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Minimum Staffing</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Kitchen:</span>
                      <span className="font-medium">{data.businessRules.minStaffing.kitchen} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Front of House:</span>
                      <span className="font-medium">{data.businessRules.minStaffing.foh} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bar:</span>
                      <span className="font-medium">{data.businessRules.minStaffing.bar} people</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Other Rules</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Max Overtime:</span>
                      <span className="font-medium">{data.businessRules.maxOvertime} hours/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meal Break:</span>
                      <span className="font-medium">{data.businessRules.breakRequirements.meal} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rest Break:</span>
                      <span className="font-medium">{data.businessRules.breakRequirements.rest} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Data Summary */}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold">Historical Data Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Average Daily Sales:</span>
                  <p className="text-lg font-medium">
                    {data.historicalData.averageDailySales > 0 
                      ? `$${data.historicalData.averageDailySales.toLocaleString()}` 
                      : 'Not provided'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Peak Hours:</span>
                  <p className="text-lg font-medium">
                    {data.historicalData.peakHours.length > 0 
                      ? data.historicalData.peakHours.join(', ') 
                      : 'Not specified'
                    }
                  </p>
                </div>
              </div>
              
              {data.historicalData.seasonalPatterns.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Seasonal Patterns:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {data.historicalData.seasonalPatterns.map(pattern => (
                      <span key={pattern} className="px-2 py-1 bg-muted rounded text-sm">{pattern}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.historicalData.salesData && data.historicalData.salesData.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Data Points:</span>
                  <p className="text-lg font-medium">{data.historicalData.salesData.length} records imported</p>
                </div>
              )}
            </div>
          </div>

          {/* Goals & Preferences */}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold">Goals & Preferences</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Priority Scores</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex justify-between">
                    <span>Staff Satisfaction:</span>
                    <span className="font-medium">{data.goals.staffSatisfaction}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Service:</span>
                    <span className="font-medium">{data.goals.customerService}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Optimization:</span>
                    <span className="font-medium">{data.goals.costOptimization}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flexibility:</span>
                    <span className="font-medium">{data.goals.flexibility}/10</span>
                  </div>
                </div>
              </div>

              {data.goals.specialEvents.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Special Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.goals.specialEvents.map(event => (
                      <span key={event} className="px-2 py-1 bg-muted rounded text-sm">{event}</span>
                    ))}
                  </div>
                </div>
              )}

              {data.goals.schedulingPreferences.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Scheduling Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.goals.schedulingPreferences.map(pref => (
                      <span key={pref} className="px-2 py-1 bg-muted rounded text-sm">{pref}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="border rounded-lg bg-muted/30 p-6">
          <h3 className="font-semibold mb-4">What happens next?</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">AI Training</p>
                <p className="text-muted-foreground">Our AI will learn from your data and preferences</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Schedule Generation</p>
                <p className="text-muted-foreground">Generate your first AI-optimized schedule</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Continuous Learning</p>
                <p className="text-muted-foreground">The AI improves with each schedule and feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Ready to start generating intelligent schedules?
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/dashboard/schedule"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Generate First Schedule
            </Link>
            <button
              onClick={() => {
                console.log('Current form data:', data);
                console.log('Staff data:', data.staff);
                console.log('Staff type:', typeof data.staff);
                console.log('Is array:', Array.isArray(data.staff));
              }}
              className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
            >
              Debug Staff Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
