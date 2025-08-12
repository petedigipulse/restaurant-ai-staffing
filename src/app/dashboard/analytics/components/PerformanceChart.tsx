"use client";
import { useState } from "react";

interface ChartData {
  date: string;
  laborCost: number;
  efficiency: number;
  quality: number;
  savings: number;
}

interface Props {
  data: ChartData[];
  metric: 'laborCost' | 'efficiency' | 'quality' | 'savings';
}

export default function PerformanceChart({ data, metric }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartData | null>(null);

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'laborCost': return 'Labor Cost (%)';
      case 'efficiency': return 'Efficiency Score (%)';
      case 'quality': return 'Schedule Quality';
      case 'savings': return 'Cost Savings ($)';
      default: return '';
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'laborCost': return 'bg-blue-500';
      case 'efficiency': return 'bg-green-500';
      case 'quality': return 'bg-purple-500';
      case 'savings': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getMetricValue = (point: ChartData, metric: string) => {
    switch (metric) {
      case 'laborCost': return point.laborCost;
      case 'efficiency': return point.efficiency;
      case 'quality': return point.quality;
      case 'savings': return point.savings;
      default: return 0;
    }
  };

  const maxValue = Math.max(...data.map(d => getMetricValue(d, metric)));
  const minValue = Math.min(...data.map(d => getMetricValue(d, metric)));
  const range = maxValue - minValue;

  const getYPosition = (value: number) => {
    if (range === 0) return 50;
    return 100 - ((value - minValue) / range) * 80;
  };

  const getXPosition = (index: number) => {
    return (index / (data.length - 1)) * 100;
  };

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{getMetricLabel(metric)}</h3>
      
      <div className="relative h-64 mb-4">
        {/* Chart Area */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid Lines */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="#e5e7eb" strokeWidth="0.5" />
          
          {/* Data Line */}
          <polyline
            fill="none"
            stroke={metric === 'laborCost' ? '#3b82f6' : metric === 'efficiency' ? '#10b981' : metric === 'quality' ? '#8b5cf6' : '#f59e0b'}
            strokeWidth="2"
            points={data.map((d, i) => `${getXPosition(i)},${getYPosition(getMetricValue(d, metric))}`).join(' ')}
          />
          
          {/* Data Points */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={getXPosition(index)}
              cy={getYPosition(getMetricValue(point, metric))}
              r="3"
              fill={metric === 'laborCost' ? '#3b82f6' : metric === 'efficiency' ? '#10b981' : metric === 'quality' ? '#8b5cf6' : '#f59e0b'}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer hover:r-4 transition-all"
            />
          ))}
        </svg>
        
        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div 
            className="absolute bg-white dark:bg-gray-800 border rounded-lg p-3 shadow-lg text-sm"
            style={{
              left: `${getXPosition(data.indexOf(hoveredPoint))}%`,
              top: `${getYPosition(getMetricValue(hoveredPoint, metric))}%`,
              transform: 'translate(-50%, -100%) translateY(-10px)'
            }}
          >
            <div className="font-medium">{hoveredPoint.date}</div>
            <div className="text-muted-foreground">
              {getMetricLabel(metric)}: {getMetricValue(hoveredPoint, metric)}
              {metric === 'laborCost' || metric === 'efficiency' ? '%' : metric === 'savings' ? '$' : ''}
            </div>
          </div>
        )}
      </div>
      
      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {data.map((point, index) => (
          <span key={index} className="text-center">
            {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-muted-foreground">Current</div>
          <div className="font-semibold">
            {getMetricValue(data[data.length - 1], metric)}
            {metric === 'laborCost' || metric === 'efficiency' ? '%' : metric === 'savings' ? '$' : ''}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Average</div>
          <div className="font-semibold">
            {(data.reduce((sum, d) => sum + getMetricValue(d, metric), 0) / data.length).toFixed(1)}
            {metric === 'laborCost' || metric === 'efficiency' ? '%' : metric === 'savings' ? '$' : ''}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Change</div>
          <div className={`font-semibold ${
            getMetricValue(data[data.length - 1], metric) > getMetricValue(data[0], metric) 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {getMetricValue(data[data.length - 1], metric) > getMetricValue(data[0], metric) ? '+' : ''}
            {(getMetricValue(data[data.length - 1], metric) - getMetricValue(data[0], metric)).toFixed(1)}
            {metric === 'laborCost' || metric === 'efficiency' ? '%' : metric === 'savings' ? '$' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
