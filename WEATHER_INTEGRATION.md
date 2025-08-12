# Weather Integration for AI Staffing

## Overview
The restaurant AI staffing application now includes weather forecasting integration to optimize staffing levels based on weather conditions. This feature helps restaurant managers make data-driven decisions about staffing requirements.

## Features

### 🌤️ Weather Forecast Display
- **7-Day Forecast**: Shows weather conditions for the upcoming week
- **Weather Icons**: Visual representation of weather conditions (sunny, rainy, cloudy, etc.)
- **Temperature Display**: Current and forecasted temperatures
- **Precipitation & Wind**: Detailed weather metrics

### 📊 AI Staffing Recommendations
- **Weather Impact Analysis**: Automatically calculates staffing impact based on weather
- **Smart Capacity Adjustment**: Reduces staffing requirements during poor weather
- **Performance Prioritization**: Assigns high-performance staff during challenging conditions

### 🎯 Staffing Impact Levels

#### Low Impact (Green)
- **Conditions**: Clear skies, mild temperatures, low wind
- **Action**: Normal staffing levels recommended
- **Capacity**: 100% of standard requirements

#### Medium Impact (Yellow)
- **Conditions**: Light rain, moderate wind, overcast
- **Action**: Consider reducing staff by 10-15%
- **Capacity**: 85% of standard requirements

#### High Impact (Red)
- **Conditions**: Heavy rain, strong winds, thunderstorms
- **Action**: Consider reducing staff by 20-30%
- **Capacity**: 70% of standard requirements

## Technical Implementation

### API Integration
- **Primary**: Open-Meteo API (free, no API key required)
- **Fallback**: Mock data generation for development
- **Location**: Wellington, New Zealand (configurable)

### Weather Context
- **Real-time Updates**: Weather data refreshes every 30 minutes
- **Shared State**: Weather data available across all schedule components
- **Error Handling**: Graceful fallback to mock data

### AI Integration
- **Smart Assignment**: Weather-aware staff allocation
- **Capacity Optimization**: Dynamic adjustment based on conditions
- **Performance Sorting**: High-performing staff prioritized during challenges

## Configuration

### Environment Variables
```bash
# Weather API Configuration
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
WEATHER_LOCATION_LAT=-41.2866
WEATHER_LOCATION_LON=174.7756
WEATHER_LOCATION_NAME=Wellington, New Zealand
```

### Customizing Location
To change the weather location:

1. Update coordinates in `src/app/api/weather/route.ts`
2. Modify the `lat` and `lon` variables
3. Update the location name display

### API Rate Limits
- Open-Meteo: 10,000 requests per day (free tier)
- Current usage: ~48 requests per day (30-minute intervals)
- Well within free tier limits

## Usage

### Viewing Weather Forecast
1. Navigate to the Schedule page (`/dashboard/schedule`)
2. Weather forecast appears in the right sidebar
3. 7-day forecast with icons and temperatures
4. Staffing recommendations for each day

### AI Schedule Generation
1. Click "Generate AI Schedule" button
2. AI considers weather conditions automatically
3. Staffing levels adjusted based on forecast
4. High-performance staff prioritized during poor weather

### Manual Staff Assignment
1. Drag staff cards to schedule slots
2. Weather conflicts automatically detected
3. Visual indicators show weather impact
4. Real-time recommendations displayed

## Weather Factors Considered

### Temperature Impact
- **Cold Weather (<10°C)**: May reduce outdoor dining
- **Hot Weather (>25°C)**: May increase indoor dining
- **Mild Weather (10-25°C)**: Optimal conditions

### Precipitation Impact
- **Light Rain (1-5mm)**: Affects outdoor seating
- **Heavy Rain (>5mm)**: Significantly reduces traffic
- **No Rain**: Normal conditions

### Wind Impact
- **Moderate Wind (25-40 km/h)**: Affects outdoor dining
- **Strong Wind (>40 km/h)**: Significantly impacts outdoor seating
- **Light Wind (<25 km/h)**: Minimal impact

### Severe Weather
- **Thunderstorms**: High impact on customer traffic
- **Fog**: Moderate impact on visibility and accessibility
- **Snow**: High impact (rare in Wellington)

## Benefits

### For Restaurant Managers
- **Data-Driven Decisions**: Weather-based staffing optimization
- **Cost Savings**: Reduce overstaffing during poor weather
- **Customer Experience**: Maintain service quality in all conditions
- **Planning**: Advanced notice of weather-related challenges

### For Staff
- **Fair Scheduling**: Weather-aware shift allocation
- **Performance Recognition**: High performers prioritized during challenges
- **Workload Balance**: Appropriate staffing levels for conditions

### For Business
- **Operational Efficiency**: Optimize labor costs
- **Risk Management**: Prepare for weather-related challenges
- **Competitive Advantage**: Weather-smart operations

## Future Enhancements

### Planned Features
- **Historical Weather Analysis**: Learn from past weather patterns
- **Seasonal Adjustments**: Account for seasonal weather trends
- **Multi-Location Support**: Weather data for multiple restaurant locations
- **Advanced Forecasting**: Integration with multiple weather services

### API Improvements
- **Windy.com Integration**: Professional weather service with detailed forecasts
- **Real-time Updates**: Live weather monitoring and alerts
- **Custom Alerts**: Notifications for significant weather changes

## Troubleshooting

### Common Issues
1. **Weather Not Loading**: Check internet connection and API status
2. **Incorrect Location**: Verify coordinates in weather API route
3. **Mock Data Showing**: API may be down, check console for errors

### Debug Information
- Weather data refreshes every 30 minutes
- Mock data used as fallback during API failures
- Check browser console for detailed error messages

## Support

For technical support or feature requests related to weather integration:
- Check the application console for error messages
- Verify environment variables are correctly set
- Ensure the weather API endpoint is accessible

---

*Weather integration enhances the AI staffing system by providing real-time environmental context for optimal staffing decisions.*
