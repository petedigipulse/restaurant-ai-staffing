"use client";
import { useState } from "react";
import Link from "next/link";
import PerformanceChart from "./components/PerformanceChart";
import StaffPerformance, { StaffPerformance as StaffPerformanceType } from "./components/StaffPerformance";

type TimeRange = '7d' | '30d' | '90d' | '1y';
type MetricType = 'labor-cost' | 'staffing-efficiency' | 'schedule-quality' | 'cost-savings';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('labor-cost');

  // Mock data - in a real app, this would come from your backend
  const mockData = {
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
    }
  };

  // Mock chart data for performance trends
  const chartData = [
    { date: '2024-01-01', laborCost: 31.2, efficiency: 82, quality: 88, savings: 0 },
    { date: '2024-01-08', laborCost: 30.8, efficiency: 83, quality: 89, savings: 450 },
    { date: '2024-01-15', laborCost: 30.1, efficiency: 85, quality: 90, savings: 890 },
    { date: '2024-01-22', laborCost: 29.5, efficiency: 86, quality: 91, savings: 1420 },
    { date: '2024-01-29', laborCost: 28.5, efficiency: 87, quality: 92, savings: 2840 }
  ];

  // Mock staff performance data
  const staffPerformance: StaffPerformanceType[] = [
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
  ];

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
          <Link
            href="/dashboard/schedule"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Generate New Schedule
          </Link>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Labor Cost</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {mockData.laborCost.current}%
              </p>
            </div>
            <div className={`text-2xl ${getTrendColor(mockData.laborCost.trend, 'labor-cost')}`}>
              {getTrendIcon(mockData.laborCost.trend)}
            </div>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Target: {mockData.laborCost.target}%
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Efficiency Score</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {mockData.staffingEfficiency.current}%
              </p>
            </div>
            <div className={`text-2xl ${getTrendColor(mockData.staffingEfficiency.trend, 'efficiency')}`}>
              {getTrendIcon(mockData.staffingEfficiency.trend)}
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Target: {mockData.staffingEfficiency.target}%
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Schedule Quality</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {mockData.scheduleQuality.score}/100
              </p>
            </div>
            <div className="text-2xl text-purple-600">
              ⭐
            </div>
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
            +{mockData.scheduleQuality.score - mockData.scheduleQuality.previous} from last period
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Cost Savings</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                ${mockData.costSavings.total.toLocaleString()}
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
                    style={{ width: `${(mockData.laborCost.breakdown.kitchen / mockData.laborCost.current) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{mockData.laborCost.breakdown.kitchen}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Front of House</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(mockData.laborCost.breakdown.foh / mockData.laborCost.current) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{mockData.laborCost.breakdown.foh}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bar Staff</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(mockData.laborCost.breakdown.bar / mockData.laborCost.current) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{mockData.laborCost.breakdown.bar}%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">AI Insights</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your labor costs are trending downward! The AI has optimized scheduling to reduce 
              overtime and improve staff utilization, saving you ${(mockData.laborCost.previous - mockData.laborCost.current).toFixed(1)}% 
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
                <span className="text-sm font-medium">{mockData.staffingEfficiency.metrics.coverage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${mockData.staffingEfficiency.metrics.coverage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Staff Utilization</span>
                <span className="text-sm font-medium">{mockData.staffingEfficiency.metrics.utilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${mockData.staffingEfficiency.metrics.utilization}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Staff Satisfaction</span>
                <span className="text-sm font-medium">{mockData.staffingEfficiency.metrics.satisfaction}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${mockData.staffingEfficiency.metrics.satisfaction}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Performance Highlights</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your efficiency score improved by {mockData.staffingEfficiency.current - mockData.staffingEfficiency.previous} points! 
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
              ${mockData.costSavings.breakdown.overtime.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Saved through better shift planning
            </p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-medium mb-2">Overstaffing Prevention</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${mockData.costSavings.breakdown.overstaffing.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Avoided unnecessary labor costs
            </p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-medium mb-2">Skill Optimization</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${mockData.costSavings.breakdown.skillMismatch.toLocaleString()}
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
          {mockData.scheduleQuality.improvements.map((improvement, index) => (
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
            days of scheduling data and continues to improve. The quality score has increased by 
            {mockData.scheduleQuality.score - mockData.scheduleQuality.previous} points through 
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
