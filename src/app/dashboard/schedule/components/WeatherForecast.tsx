"use client";
import { useState, useEffect } from "react";

interface WeatherData {
  date: string;
  day: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  cloudCover: number;
  weatherCode: string;
  weatherDescription: string;
  icon: string;
  staffingImpact: 'high' | 'medium' | 'low';
  staffingRecommendation: string;
}

interface WeatherResponse {
  location: string;
  coordinates: { lat: number; lon: number };
  forecast: WeatherData[];
  lastUpdated: string;
  note?: string;
}

export default function WeatherForecast() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/weather');
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return 'High Impact';
      case 'medium': return 'Medium Impact';
      case 'low': return 'Low Impact';
      default: return 'Unknown Impact';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading weather forecast...</span>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-2">🌦️</div>
          <h3 className="font-medium text-gray-900 mb-2">Weather Unavailable</h3>
          <p className="text-sm text-gray-500 mb-3">
            {error || 'Unable to load weather data'}
          </p>
          <button
            onClick={fetchWeatherData}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Weather Forecast</h3>
            <p className="text-sm text-gray-600">{weatherData.location}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Last Updated</div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(weatherData.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
        {weatherData.note && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            {weatherData.note}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weatherData.forecast.map((day) => (
            <div key={day.date} className="text-center">
              <div className="text-xs font-medium text-gray-600 mb-1">{day.day}</div>
              <div className="text-2xl mb-1" title={day.weatherDescription}>
                {day.icon}
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                {day.temp}°C
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {day.precipitation > 0 ? `${day.precipitation}mm` : '0mm'}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {day.windSpeed} km/h
              </div>
              <div 
                className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(day.staffingImpact)}`}
                title={day.staffingRecommendation}
              >
                {getImpactLabel(day.staffingImpact)}
              </div>
            </div>
          ))}
        </div>
        
        {/* AI Staffing Recommendations */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">AI Staffing Recommendations</h4>
          <div className="space-y-3">
            {weatherData.forecast
              .filter(day => day.staffingImpact !== 'low')
              .map((day) => (
                <div key={day.date} className="flex items-start space-x-3">
                  <div className="text-lg">{day.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{day.day}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(day.staffingImpact)}`}>
                        {getImpactLabel(day.staffingImpact)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{day.staffingRecommendation}</p>
                  </div>
                </div>
              ))}
            
            {weatherData.forecast.every(day => day.staffingImpact === 'low') && (
              <div className="text-center py-4">
                <div className="text-green-500 text-2xl mb-2">☀️</div>
                <p className="text-sm text-gray-600">
                  Great weather expected this week! Normal staffing levels recommended.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Weather Summary */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600">ℹ️</span>
            <span className="text-sm font-medium text-blue-900">Weather Impact on Staffing</span>
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            <div>• <strong>High Impact:</strong> Consider reducing staff by 20-30%</div>
            <div>• <strong>Medium Impact:</strong> Consider reducing staff by 10-15%</div>
            <div>• <strong>Low Impact:</strong> Normal staffing levels recommended</div>
          </div>
        </div>
      </div>
    </div>
  );
}
