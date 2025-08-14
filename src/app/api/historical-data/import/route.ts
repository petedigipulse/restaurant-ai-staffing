import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const csvFile = formData.get('csv') as File;
    const organizationId = formData.get('organizationId') as string;

    if (!csvFile || !organizationId) {
      return NextResponse.json(
        { error: 'Missing CSV file or organization ID' },
        { status: 400 }
      );
    }

    // Parse CSV content
    const csvText = await csvFile.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must have at least a header row and one data row' },
        { status: 400 }
      );
    }

    // Parse header row
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const dataRows = lines.slice(1);

    // Parse data rows
    const historicalData = [];
    for (const row of dataRows) {
      if (!row.trim()) continue;
      
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const rowData: any = {};
      
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });

      // Extract date and time for weather API call
      const date = rowData.date || rowData.Date || rowData.DATE;
      const time = rowData.time || rowData.Time || rowData.TIME;
      
      if (date) {
        try {
          // Fetch weather data for this date
          const weatherData = await fetchWeatherData(date, time);
          
          historicalData.push({
            organization_id: organizationId,
            date: date,
            time: time || '12:00:00',
            total_sales: parseFloat(rowData.total_sales || rowData['Total Sales'] || rowData['TOTAL_SALES'] || '0'),
            customer_count: parseInt(rowData.customer_count || rowData['Customer Count'] || rowData['CUSTOMER_COUNT'] || '0'),
            weather_conditions: weatherData.conditions || 'Unknown',
            special_events: rowData.special_events || rowData['Special Events'] || rowData['SPECIAL_EVENTS'] || '',
            notes: rowData.notes || rowData.Notes || rowData.NOTES || '',
            station_breakdown: {},
            created_at: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error fetching weather data for date:', date, error);
          // Continue without weather data
          historicalData.push({
            organization_id: organizationId,
            date: date,
            time: time || '12:00:00',
            total_sales: parseFloat(rowData.total_sales || rowData['Total Sales'] || rowData['TOTAL_SALES'] || '0'),
            customer_count: parseInt(rowData.customer_count || rowData['Customer Count'] || rowData['CUSTOMER_COUNT'] || '0'),
            weather_conditions: 'Unknown',
            special_events: rowData.special_events || rowData['Special Events'] || rowData['SPECIAL_EVENTS'] || '',
            notes: rowData.notes || rowData.Notes || rowData.NOTES || '',
            station_breakdown: {},
            created_at: new Date().toISOString()
          });
        }
      }
    }

    if (historicalData.length === 0) {
      return NextResponse.json(
        { error: 'No valid data found in CSV file' },
        { status: 400 }
      );
    }

    // Save to database
    try {
      // Use the new CSV import method instead of onboarding method
      const result = await DatabaseService.importHistoricalDataFromCSV(organizationId, historicalData);
      
      console.log(`✅ Successfully imported ${historicalData.length} historical data points`);

      return NextResponse.json({
        success: true,
        message: result.message || `Successfully imported ${historicalData.length} data points`,
        importedCount: historicalData.length,
        data: result.data,
        conflicts: result.conflicts,
        hasConflicts: result.conflicts?.hasConflicts || false
      });
    } catch (dbError: any) {
      console.error('Error saving historical data:', dbError);
      return NextResponse.json(
        { error: `Failed to save data: ${dbError.message}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error importing historical data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import historical data' },
      { status: 500 }
    );
  }
}

async function fetchWeatherData(date: string, time?: string): Promise<{ conditions: string }> {
  try {
    // For now, return a placeholder. You can integrate with a real weather API here
    // Example APIs: OpenWeatherMap, WeatherAPI, AccuWeather
    
    // This is a mock implementation - replace with actual API call
    const weatherConditions = [
      'Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Stormy', 
      'Clear', 'Overcast', 'Foggy', 'Windy', 'Snowy'
    ];
    
    // Generate consistent weather based on date (for demo purposes)
    const dateHash = date.split('-').join('');
    const weatherIndex = parseInt(dateHash) % weatherConditions.length;
    
    return {
      conditions: weatherConditions[weatherIndex]
    };
    
    // Real API implementation would look like:
    /*
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await fetch(
      `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=Wellington,NZ&dt=${date}`
    );
    const data = await response.json();
    return {
      conditions: data.forecast?.forecastday?.[0]?.day?.condition?.text || 'Unknown'
    };
    */
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { conditions: 'Unknown' };
  }
}
