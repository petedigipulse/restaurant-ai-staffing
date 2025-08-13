"use client";
import { useState, useEffect } from 'react';

interface Schedule {
  id: string;
  week_start_date: string;
  total_labor_cost: number;
  total_hours: number;
  ai_generated: boolean;
  created_at: string;
}

interface ScheduleHistoryProps {
  organizationId: string;
}

export default function ScheduleHistory({ organizationId }: ScheduleHistoryProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`/api/schedule?organizationId=${organizationId}`);
        if (response.ok) {
          const data = await response.json();
          setSchedules(data.schedules);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      fetchSchedules();
    }
  }, [organizationId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-3"></div>
          <span className="text-gray-600">Loading schedules...</span>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">No schedules yet</p>
          <p className="text-sm">Generate your first AI schedule to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Schedule History</h2>
        <p className="text-sm text-gray-500 mt-1">Your previously generated schedules</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Week of {formatDate(schedule.week_start_date)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created {formatDate(schedule.created_at)}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(schedule.total_labor_cost)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {schedule.total_hours} hours
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {schedule.ai_generated && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      AI Generated
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    ID: {schedule.id.slice(0, 8)}...
                  </span>
                </div>
                
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
