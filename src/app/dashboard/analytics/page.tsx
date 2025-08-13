"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PerformanceChart from "./components/PerformanceChart";
import StaffPerformance from "./components/StaffPerformance";
import { AnalyticsService, AnalyticsData, StaffPerformanceData, ChartDataPoint } from "@/lib/services/analytics";
import { DatabaseService } from "@/lib/services/database";

type TimeRange = '7d' | '30d' | '90d' | '1y';
type MetricType = 'labor-cost' | 'staffing-efficiency' | 'schedule-quality' | 'cost-savings';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('labor-cost');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [refreshMessage, setRefreshMessage] = useState<string>('');

  // Load analytics data from database
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // Get organization ID for the current authenticated user
        const currentOrgId = await DatabaseService.getCurrentUserOrganizationId();
        if (!currentOrgId) {
          console.error('No organization ID found for current user');
          setIsLoading(false);
          return;
        }
        
        setOrganizationId(currentOrgId);
        
        // Load all analytics data
        const [analytics, charts, staff] = await Promise.all([
          AnalyticsService.getAnalyticsData(currentOrgId, timeRange),
          AnalyticsService.getChartData(currentOrgId, timeRange),
          AnalyticsService.getStaffPerformanceData(currentOrgId)
        ]);
        
        setAnalyticsData(analytics);
        setChartData(charts);
        setStaffPerformance(staff);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [timeRange]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Use real data or fallback to defaults
  const data = analyticsData || {
    laborCost: { current: 0, previous: 0, target: 0, trend: 'stable', breakdown: { kitchen: 0, foh: 0, bar: 0 } },
    staffingEfficiency: { current: 0, previous: 0, target: 0, trend: 'stable', metrics: { coverage: 0, utilization: 0, satisfaction: 0 } },
    scheduleQuality: { score: 0, previous: 0, improvements: [] },
    costSavings: { total: 0, monthly: 0, breakdown: { overtime: 0, overstaffing: 0, skillMismatch: 0 } }
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  };

  const getTrendColor = (trend: string, metric: string) => {
    if (metric === 'labor-cost') {
      return trend === 'down' ? 'text-green-600' : 'text-red-600';
    }
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Insights into your AI-powered staffing performance
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 dark:text-green-400">
              Live data from database • {staffPerformance.length} staff members • {chartData.length} data points
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={async () => {
              try {
                console.log('Refresh button clicked!');
                setIsRefreshing(true);
                const storedOrgId = localStorage.getItem('organizationId');
                console.log('Organization ID from localStorage:', storedOrgId);
                
                if (!storedOrgId) {
                  console.error('No organization ID found');
                  setRefreshMessage('No organization ID found. Please complete onboarding first.');
                  setTimeout(() => setRefreshMessage(''), 3000);
                  return;
                }
                
                console.log('Starting data refresh for organization:', storedOrgId);
                
                // Reload all analytics data
                const [analytics, charts, staff] = await Promise.all([
                  AnalyticsService.getAnalyticsData(storedOrgId, timeRange),
                  AnalyticsService.getChartData(storedOrgId, timeRange),
                  AnalyticsService.getStaffPerformanceData(storedOrgId)
                ]);
                
                console.log('Refresh results:', { analytics, charts, staff });
                
                setAnalyticsData(analytics);
                setChartData(charts);
                setStaffPerformance(staff);
                
                // Show success message
                setRefreshMessage(`Data refreshed successfully! Loaded ${staff.length} staff members and ${charts.length} data points.`);
                setTimeout(() => setRefreshMessage(''), 3000); // Clear after 3 seconds
              } catch (error) {
                console.error('Error refreshing analytics data:', error);
                setRefreshMessage('Error refreshing data. Please try again.');
                setTimeout(() => setRefreshMessage(''), 3000);
              } finally {
                setIsRefreshing(false);
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Refreshing...</span>
              </div>
            ) : (
              'Refresh Data'
            )}
          </button>
          <Link
            href="/dashboard/schedule"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Generate New Schedule
          </Link>
        </div>
      </div>

      {/* Refresh Message */}
      {refreshMessage && (
        <div className={`p-4 rounded-lg ${
          refreshMessage.includes('Error') 
            ? 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-300' 
            : 'bg-green-50 border border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              refreshMessage.includes('Error') ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
            <span className="text-sm font-medium">{refreshMessage}</span>
          </div>
        </div>
      )}

      {/* Key Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Labor Cost</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {data.laborCost.current}%
              </p>
            </div>
            <div className={`text-2xl ${getTrendColor(data.laborCost.trend, 'labor-cost')}`}>
              {getTrendIcon(data.laborCost.trend)}
            </div>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Target: {data.laborCost.target}%
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Efficiency Score</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {data.staffingEfficiency.current}%
              </p>
            </div>
            <div className={`text-2xl ${getTrendColor(data.staffingEfficiency.trend, 'efficiency')}`}>
              {getTrendIcon(data.staffingEfficiency.trend)}
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Target: {data.staffingEfficiency.target}%
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Schedule Quality</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {data.scheduleQuality.score}/100
              </p>
            </div>
            <div className="text-2xl text-purple-600">
              ⭐
            </div>
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
            +{data.scheduleQuality.score - data.scheduleQuality.previous} from last period
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Cost Savings</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                ${data.costSavings.total.toLocaleString()}
              </p>
            </div>
            <div className="text-2xl text-orange-600">
              💰
            </div>
          </div>
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
            This {timeRange === '7d' ? 'week' : timeRange === '30d' ? 'month' : 'period'}
          </p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Labor Cost Breakdown */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Labor Cost Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Kitchen Staff</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(data.laborCost.breakdown.kitchen / Math.max(data.laborCost.current, 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.laborCost.breakdown.kitchen.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Front of House</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(data.laborCost.breakdown.foh / Math.max(data.laborCost.current, 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.laborCost.breakdown.foh.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bar Staff</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(data.laborCost.breakdown.bar / Math.max(data.laborCost.current, 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.laborCost.breakdown.bar.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">AI Insights</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your labor costs are trending {data.laborCost.trend === 'down' ? 'downward' : 'upward'}! The AI has optimized scheduling to reduce 
              overtime and improve staff utilization, saving you ${(data.laborCost.previous - data.laborCost.current).toFixed(1)}% 
              compared to last period.
            </p>
          </div>
        </div>

        {/* Staffing Efficiency Metrics */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Staffing Efficiency Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Coverage Rate</span>
                <span className="text-sm font-medium">{data.staffingEfficiency.metrics.coverage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${data.staffingEfficiency.metrics.coverage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Staff Utilization</span>
                <span className="text-sm font-medium">{data.staffingEfficiency.metrics.utilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${data.staffingEfficiency.metrics.utilization}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Staff Satisfaction</span>
                <span className="text-sm font-medium">{data.staffingEfficiency.metrics.satisfaction}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${data.staffingEfficiency.metrics.satisfaction}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Performance Highlights</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your efficiency score {data.staffingEfficiency.trend === 'up' ? 'improved' : 'decreased'} by {Math.abs(data.staffingEfficiency.current - data.staffingEfficiency.previous)} points! 
              The AI has better balanced workload distribution and staff preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Cost Savings Breakdown */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cost Savings Breakdown</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">⏰</div>
            <h3 className="font-medium mb-2">Overtime Reduction</h3>
            <p className="text-2xl font-bold text-green-600">
              ${data.costSavings.breakdown.overtime.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Saved through better shift planning
            </p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-medium mb-2">Overstaffing Prevention</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${data.costSavings.breakdown.overstaffing.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Avoided unnecessary labor costs
            </p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-medium mb-2">Skill Optimization</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${data.costSavings.breakdown.skillMismatch.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Better role-to-skill matching
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Quality Improvements */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Schedule Improvements</h2>
        <div className="grid gap-4 md:grid-cols-2">
                  {data.scheduleQuality.improvements.map((improvement, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-sm">{improvement}</p>
          </div>
        ))}
        </div>
        
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
          <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">AI Learning Progress</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
              Your AI system has analyzed {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : timeRange === '90d' ? '90' : '365'} 
              days of scheduling data and continues to improve. The quality score has {data.scheduleQuality.score >= data.scheduleQuality.previous ? 'increased' : 'decreased'} by 
              {Math.abs(data.scheduleQuality.score - data.scheduleQuality.previous)} points through 
              pattern recognition and optimization.
            </p>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart data={chartData} metric="laborCost" />
        <PerformanceChart data={chartData} metric="efficiency" />
        <PerformanceChart data={chartData} metric="quality" />
        <PerformanceChart data={chartData} metric="savings" />
      </div>

      {/* Staff Performance */}
      <StaffPerformance staff={staffPerformance} />

      {/* Action Items */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Optimize Kitchen Staffing</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Kitchen labor costs are slightly high. Consider cross-training staff for multiple stations.
            </p>
            <button className="text-sm text-primary hover:underline">
              View Kitchen Schedule →
            </button>
          </div>
          
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Improve Weekend Coverage</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Weekend efficiency is 15% lower than weekdays. Review weekend staffing patterns.
            </p>
            <button className="text-sm text-primary hover:underline">
              Analyze Weekend Data →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
