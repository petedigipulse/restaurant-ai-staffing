"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

export default function DateRangePicker({ onDateRangeChange, className = "" }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Initialize with current week
  useEffect(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday
    
    setStartDate(weekStart.toISOString().split('T')[0]);
    setEndDate(weekEnd.toISOString().split('T')[0]);
    setSelectedPreset("current-week");
    
    onDateRangeChange(weekStart, weekEnd);
  }, [onDateRangeChange]);

  const handlePresetChange = (preset: string) => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (preset) {
      case "current-week":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay() + 1); // Monday
        end = new Date(start);
        end.setDate(start.getDate() + 6); // Sunday
        break;
      
      case "next-week":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay() + 8); // Next Monday
        end = new Date(start);
        end.setDate(start.getDate() + 6); // Next Sunday
        break;
      
      case "two-weeks":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay() + 1); // This Monday
        end = new Date(start);
        end.setDate(start.getDate() + 13); // 2 weeks from Monday
        break;
      
      case "four-weeks":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay() + 1); // This Monday
        end = new Date(start);
        end.setDate(start.getDate() + 27); // 4 weeks from Monday
        break;
      
      case "custom":
        // Don't change dates, let user pick
        setSelectedPreset("custom");
        return;
      
      default:
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setSelectedPreset(preset);
    onDateRangeChange(start, end);
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start <= end) {
        setSelectedPreset("custom");
        onDateRangeChange(start, end);
      }
    }
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return "";
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startFormatted = startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const endFormatted = endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  const getDaysCount = (start: string, end: string) => {
    if (!start || !end) return 0;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Schedule Period</h3>
          <div className="text-sm text-gray-600">
            {startDate && endDate && (
              <span>
                {formatDateRange(startDate, endDate)} • {getDaysCount(startDate, endDate)} days
              </span>
            )}
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPreset === "current-week" ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetChange("current-week")}
            className="text-xs"
          >
            Current Week
          </Button>
          <Button
            variant={selectedPreset === "next-week" ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetChange("next-week")}
            className="text-xs"
          >
            Next Week
          </Button>
          <Button
            variant={selectedPreset === "two-weeks" ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetChange("two-weeks")}
            className="text-xs"
          >
            2 Weeks
          </Button>
          <Button
            variant={selectedPreset === "four-weeks" ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetChange("four-weeks")}
            className="text-xs"
          >
            4 Weeks
          </Button>
          <Button
            variant={selectedPreset === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetChange("custom")}
            className="text-xs"
          >
            Custom
          </Button>
        </div>

        {/* Custom Date Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={handleCustomDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={handleCustomDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-gray-500">
            {startDate && endDate && (
              <span>
                {getDaysCount(startDate, endDate)} days • {startDate && endDate ? 
                  Math.ceil(getDaysCount(startDate, endDate) / 7) : 0} weeks
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetChange("current-week")}
            className="text-xs"
          >
            Reset to Current Week
          </Button>
        </div>
      </div>
    </div>
  );
}
