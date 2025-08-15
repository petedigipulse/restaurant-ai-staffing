import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 CSV import API called');
    
    const formData = await request.formData();
    const csvFile = formData.get('csv') as File;
    const organizationId = formData.get('organizationId') as string;

    console.log('📋 Form data received:', {
      hasFile: !!csvFile,
      fileName: csvFile?.name,
      fileSize: csvFile?.size,
      organizationId
    });

    if (!csvFile || !organizationId) {
      console.log('❌ Missing required data:', { hasFile: !!csvFile, organizationId });
      return NextResponse.json(
        { error: 'Missing CSV file or organization ID' },
        { status: 400 }
      );
    }

    // Parse CSV content
    const csvText = await csvFile.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    console.log('📊 CSV parsing:', {
      totalLines: lines.length,
      headerLine: lines[0],
      firstDataLine: lines[1],
      lastDataLine: lines[lines.length - 1]
    });
    
    if (lines.length < 2) {
      console.log('❌ CSV too short:', lines.length, 'lines');
      return NextResponse.json(
        { error: 'CSV file must have at least a header row and one data row' },
        { status: 400 }
      );
    }

    // Parse header row
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const dataRows = lines.slice(1);

    console.log('📋 CSV Headers found:', headers);
    console.log('📊 CSV Data rows:', dataRows.length);

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
      const date = rowData.date || rowData.Date || rowData.DATE || rowData.Date || rowData.date;
      const time = rowData.time || rowData.Time || rowData.TIME || rowData.time || rowData.Time;
      
      console.log('📅 Processing row:', { date, time, rowData });
      console.log('🔍 Available columns:', Object.keys(rowData));
      console.log('🔍 Column values:', {
        'Total Sales ($)': rowData['Total Sales ($)'],
        'Total Sales': rowData['Total Sales'],
        'total_sales': rowData['total_sales'],
        'Customer Count': rowData['Customer Count'],
        'customer_count': rowData['customer_count'],
        'Weather Conditions': rowData['Weather Conditions'],
        'weather_conditions': rowData['weather_conditions'],
        'Special Events': rowData['Special Events'],
        'special_events': rowData['special_events'],
        'Notes': rowData['Notes'],
        'notes': rowData['notes'],
        'Station Breakdown': rowData['Station Breakdown'],
        'station_breakdown': rowData['station_breakdown']
      });
      
      if (date) {
        try {
          // Fetch weather data for this date
          const weatherData = await fetchWeatherData(date, time);
          
          // Clean and validate the data to prevent crossover
          const cleanData = {
            organization_id: organizationId,
            date: date,
            time: time || '12:00:00',
            total_sales: parseFloat(rowData['Total Sales ($)'] || rowData['Total Sales'] || rowData['total_sales'] || rowData['TOTAL_SALES'] || '0') || 0,
            customer_count: parseInt(rowData['Customer Count'] || rowData['customer_count'] || rowData['CUSTOMER_COUNT'] || '0') || 0,
            weather_conditions: (rowData['Weather Conditions'] || rowData['weather_conditions'] || '').trim() || null,
            special_events: (rowData['Special Events'] || rowData['special_events'] || '').trim() || null,
            notes: (rowData['Notes'] || rowData['notes'] || '').trim() || null,
            station_breakdown: (rowData['Station Breakdown'] || rowData['station_breakdown'] || '{}'),
            created_at: new Date().toISOString()
          };

          // Log the parsed data for debugging
          console.log('📊 Parsed CSV row:', {
            original: rowData,
            parsed: cleanData,
            columnMapping: {
              'Total Sales ($)': rowData['Total Sales ($)'],
              'Customer Count': rowData['Customer Count'],
              'Weather Conditions': rowData['Weather Conditions'],
              'Special Events': rowData['Special Events'],
              'Notes': rowData['Notes'],
              'Station Breakdown': rowData['Station Breakdown']
            }
          });

          // Add all valid data (don't filter out 0 sales/customers as they might be valid)
          if (cleanData.date) {
            historicalData.push(cleanData);
            console.log('✅ Added to historicalData array, total count:', historicalData.length);
          }
        } catch (error) {
          console.error('❌ Error processing row:', error);
          // Continue without weather data
          const cleanData = {
            organization_id: organizationId,
            date: date,
            time: time || '12:00:00',
            total_sales: parseFloat(rowData['Total Sales ($)'] || rowData['Total Sales'] || rowData['total_sales'] || rowData['TOTAL_SALES'] || '0') || 0,
            customer_count: parseInt(rowData['Customer Count'] || rowData['customer_count'] || rowData['CUSTOMER_COUNT'] || '0') || 0,
            weather_conditions: (rowData['Weather Conditions'] || rowData['weather_conditions'] || '').trim() || null,
            special_events: (rowData['Special Events'] || rowData['special_events'] || '').trim() || null,
            notes: (rowData['Notes'] || rowData['notes'] || '').trim() || null,
            station_breakdown: (rowData['Station Breakdown'] || rowData['station_breakdown'] || '{}'),
            created_at: new Date().toISOString()
          };

          // Log the parsed data for debugging
          console.log('📊 Parsed CSV row (no weather):', {
            original: rowData,
            parsed: cleanData
          });

          // Add all valid data (don't filter out 0 sales/customers as they might be valid)
          if (cleanData.date) {
            historicalData.push(cleanData);
            console.log('✅ Added to historicalData array (no weather), total count:', historicalData.length);
          }
        }
      }
    }

    if (historicalData.length === 0) {
      return NextResponse.json(
        { error: 'No valid data found in CSV file' },
        { status: 400 }
      );
    }

    // Log summary of imported data
    const totalSales = historicalData.reduce((sum, item) => sum + (item.total_sales || 0), 0);
    const totalCustomers = historicalData.reduce((sum, item) => sum + (item.customer_count || 0), 0);
    
    console.log('📊 Import Summary:', {
      totalRecords: historicalData.length,
      totalSales,
      totalCustomers,
      averageSales: totalSales / historicalData.length,
      averageCustomers: totalCustomers / historicalData.length
    });

    // Save to database
    try {
      console.log('💾 Saving to database...');
      console.log('📦 Data to save:', historicalData.length, 'records');
      
      // Use the new CSV import method instead of onboarding method
      const result = await DatabaseService.importHistoricalDataFromCSV(organizationId, historicalData);
      
      console.log('✅ Database save result:', result);
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
      console.error('❌ Database save error:', dbError);
      console.error('❌ Error details:', {
        message: dbError.message,
        stack: dbError.stack,
        organizationId,
        recordCount: historicalData.length
      });
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
