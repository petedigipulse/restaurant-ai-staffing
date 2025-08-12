import { NextResponse } from "next/server";

// Required for static export
export const dynamic = 'force-static';
export const revalidate = false;

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

export async function GET() {
  try {
    // Wellington, New Zealand coordinates
    const lat = -41.2866;
    const lon = 174.7756;
    
    // Windy.com API endpoint (using their public API)
    // Note: In production, you'd need to register for an API key
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;
    
    const response = await await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the weather data for the next 7 days
    const weatherForecast: WeatherData[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayName = days[date.getDay()];
      
      // Get weather data for this day
      const weatherCode = data.daily.weather_code[i];
      const tempMax = data.daily.temperature_2m_max[i];
      const tempMin = data.daily.temperature_2m_min[i];
      const precipitation = data.daily.precipitation_sum[i];
      const windSpeed = data.daily.wind_speed_10m_max[i];
      
      // Determine weather icon and description
      const { icon, description } = getWeatherIcon(weatherCode);
      
      // Calculate staffing impact based on weather conditions
      const { impact, recommendation } = calculateStaffingImpact(
        weatherCode,
        tempMax,
        precipitation,
        windSpeed
      );
      
      weatherForecast.push({
        date: date.toISOString().split('T')[0],
        day: dayName,
        temp: Math.round((tempMax + tempMin) / 2),
        feelsLike: Math.round((tempMax + tempMin) / 2),
        humidity: Math.round(60 + Math.random() * 30), // Mock humidity
        windSpeed: Math.round(windSpeed),
        windDirection: getWindDirection(Math.random() * 360),
        precipitation: Math.round(precipitation * 100) / 100,
        cloudCover: Math.round(20 + Math.random() * 60), // Mock cloud cover
        weatherCode: weatherCode.toString(),
        weatherDescription: description,
        icon,
        staffingImpact: impact,
        staffingRecommendation: recommendation
      });
    }
    
    return NextResponse.json({
      location: "Wellington, New Zealand",
      coordinates: { lat, lon },
      forecast: weatherForecast,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      location: "Wellington, New Zealand",
      coordinates: { lat: -41.2866, lon: 174.7756 },
      forecast: generateMockWeatherData(),
      lastUpdated: new Date().toISOString(),
      note: "Using mock data due to API error"
    });
  }
}

function getWeatherIcon(code: number): { icon: string; description: string } {
  // WMO Weather interpretation codes
  switch (code) {
    case 0: return { icon: "☀️", description: "Clear sky" };
    case 1: return { icon: "🌤️", description: "Mainly clear" };
    case 2: return { icon: "⛅", description: "Partly cloudy" };
    case 3: return { icon: "☁️", description: "Overcast" };
    case 45: return { icon: "🌫️", description: "Foggy" };
    case 48: return { icon: "🌫️", description: "Depositing rime fog" };
    case 51: return { icon: "🌦️", description: "Light drizzle" };
    case 53: return { icon: "🌦️", description: "Moderate drizzle" };
    case 55: return { icon: "🌧️", description: "Dense drizzle" };
    case 56: return { icon: "🌨️", description: "Light freezing drizzle" };
    case 57: return { icon: "🌨️", description: "Dense freezing drizzle" };
    case 61: return { icon: "🌧️", description: "Slight rain" };
    case 63: return { icon: "🌧️", description: "Moderate rain" };
    case 65: return { icon: "🌧️", description: "Heavy rain" };
    case 66: return { icon: "🌨️", description: "Light freezing rain" };
    case 67: return { icon: "🌨️", description: "Heavy freezing rain" };
    case 71: return { icon: "🌨️", description: "Slight snow" };
    case 73: return { icon: "🌨️", description: "Moderate snow" };
    case 75: return { icon: "🌨️", description: "Heavy snow" };
    case 77: return { icon: "🌨️", description: "Snow grains" };
    case 80: return { icon: "🌦️", description: "Slight rain showers" };
    case 81: return { icon: "🌧️", description: "Moderate rain showers" };
    case 82: return { icon: "🌧️", description: "Violent rain showers" };
    case 85: return { icon: "🌨️", description: "Slight snow showers" };
    case 86: return { icon: "🌨️", description: "Heavy snow showers" };
    case 95: return { icon: "⛈️", description: "Thunderstorm" };
    case 96: return { icon: "⛈️", description: "Thunderstorm with slight hail" };
    case 99: return { icon: "⛈️", description: "Thunderstorm with heavy hail" };
    default: return { icon: "🌤️", description: "Partly cloudy" };
  }
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function calculateStaffingImpact(
  weatherCode: number,
  tempMax: number,
  precipitation: number,
  windSpeed: number
): { impact: 'high' | 'medium' | 'low'; recommendation: string } {
  let impactScore = 0;
  const reasons: string[] = [];
  
  // Temperature impact (Wellington has mild climate)
  if (tempMax < 10) {
    impactScore += 2;
    reasons.push("Cold weather may reduce outdoor dining");
  } else if (tempMax > 25) {
    impactScore += 1;
    reasons.push("Hot weather may increase indoor dining");
  }
  
  // Precipitation impact
  if (precipitation > 5) {
    impactScore += 3;
    reasons.push("Heavy rain likely to reduce customer traffic");
  } else if (precipitation > 1) {
    impactScore += 2;
    reasons.push("Light rain may affect outdoor seating");
  }
  
  // Wind impact (Wellington is known for wind)
  if (windSpeed > 40) {
    impactScore += 3;
    reasons.push("Strong winds may affect outdoor dining");
  } else if (windSpeed > 25) {
    impactScore += 2;
    reasons.push("Moderate winds may impact outdoor seating");
  }
  
  // Severe weather conditions
  if ([95, 96, 99].includes(weatherCode)) {
    impactScore += 4;
    reasons.push("Thunderstorms likely to significantly reduce traffic");
  }
  
  // Determine impact level
  let impact: 'high' | 'medium' | 'low';
  let recommendation: string;
  
  if (impactScore >= 6) {
    impact = 'high';
    recommendation = `Consider reducing staff by 20-30%. ${reasons.join(' ')}`;
  } else if (impactScore >= 3) {
    impact = 'medium';
    recommendation = `Consider reducing staff by 10-15%. ${reasons.join(' ')}`;
  } else {
    impact = 'low';
    recommendation = "Normal staffing levels recommended. Good weather conditions expected.";
  }
  
  return { impact, recommendation };
}

function generateMockWeatherData(): WeatherData[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mockData: WeatherData[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayName = days[date.getDay()];
    
    // Generate realistic Wellington weather
    const temp = Math.round(12 + Math.random() * 8); // 12-20°C typical for Wellington
    const precipitation = Math.random() > 0.6 ? Math.round(Math.random() * 5 * 100) / 100 : 0;
    const windSpeed = Math.round(15 + Math.random() * 25); // Wellington is windy!
    
    const { icon, description } = getWeatherIcon(precipitation > 0 ? 61 : 0);
    const { impact, recommendation } = calculateStaffingImpact(
      precipitation > 0 ? 61 : 0,
      temp,
      precipitation,
      windSpeed
    );
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      day: dayName,
      temp,
      feelsLike: temp - Math.round(Math.random() * 3),
      humidity: Math.round(60 + Math.random() * 30),
      windSpeed,
      windDirection: getWindDirection(Math.random() * 360),
      precipitation,
      cloudCover: Math.round(20 + Math.random() * 60),
      weatherCode: precipitation > 0 ? "61" : "0",
      weatherDescription: description,
      icon,
      staffingImpact: impact,
      staffingRecommendation: recommendation
    });
  }
  
  return mockData;
}
