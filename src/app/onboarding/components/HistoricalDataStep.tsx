"use client";
import { useState } from "react";

interface HistoricalData {
  averageDailySales: number;
  peakHours: string[];
  seasonalPatterns: string[];
  salesData: Array<{
    date: string;
    timeOfDay: string;
    totalSales: number;
    customerCount: number;
    stationSales: string;
  }>;
  customerPatterns: {
    weekday: number;
    weekend: number;
    lunch: number;
    dinner: number;
  };
}

interface Props {
  data: HistoricalData;
  updateData: (data: Partial<HistoricalData>) => void;
}

export default function HistoricalDataStep({ data, updateData }: Props) {
  const [localData, setLocalData] = useState(data);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const handleSalesDataChange = (index: number, field: string, value: any) => {
    const newSalesData = [...localData.salesData];
    newSalesData[index] = { ...newSalesData[index], [field]: value };
    handleChange('salesData', newSalesData);
  };

  const addSalesDataRow = () => {
    const newRow = {
      date: new Date().toISOString().slice(0, 10),
      timeOfDay: '12:00',
      totalSales: 0,
      customerCount: 0,
      stationSales: 'Kitchen: 0, Front of House: 0'
    };
    handleChange('salesData', [...localData.salesData, newRow]);
  };

  const removeSalesDataRow = (index: number) => {
    const newSalesData = localData.salesData.filter((_, i) => i !== index);
    handleChange('salesData', newSalesData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadedFile(file);
      
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(Boolean);
        
        if (lines.length < 2) {
          alert('CSV must have at least a header row and one data row');
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        const csvData: Array<{
          date: string;
          timeOfDay: string;
          totalSales: number;
          customerCount: number;
          stationSales: string;
        }> = [];
        
        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
          const row: any = {};
          
          headers.forEach((header, index) => {
            row[header] = cells[index] || '';
          });
          
          // Transform CSV data to match our interface
          const dataPoint = {
            date: row['Date'] || row['date'] || new Date().toISOString().slice(0, 10),
            timeOfDay: row['Time'] || row['time'] || '12:00',
            totalSales: parseFloat(row['Total Sales ($)'] || row['totalSales'] || row['Total Sales'] || '0'),
            customerCount: parseInt(row['Customer Count'] || row['customerCount'] || row['Customers'] || '0'),
            stationSales: row['Station Breakdown'] || row['stationBreakdown'] || row['Stations'] || 'Kitchen: 0, Front of House: 0'
          };
          
          csvData.push(dataPoint);
        }
        
        // Validate data
        const validData = csvData.filter(point => 
          point.date && point.totalSales > 0 && point.customerCount > 0
        );
        
        if (validData.length === 0) {
          alert('No valid data found in CSV. Please check the format.');
          return;
        }
        
        // Update the data with all imported records
        handleChange('salesData', validData);
        
        // Show success message with import summary
        const totalRecords = validData.length;
        const totalSales = validData.reduce((sum, point) => sum + point.totalSales, 0);
        const totalCustomers = validData.reduce((sum, point) => sum + point.customerCount, 0);
        
        setImportSuccess(`✅ Successfully imported ${totalRecords} records! Total Sales: $${totalSales.toFixed(2)}, Total Customers: ${totalCustomers}`);
        
        // Auto-hide success message after 8 seconds
        setTimeout(() => setImportSuccess(null), 8000);
        
      } else {
        alert('Please upload a CSV file');
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Failed to parse CSV file. Please check the format and try again.');
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Date,Time,Total Sales ($),Customer Count,Station Breakdown,Weather Conditions,Special Events,Notes
2024-07-01,11:00,500.25,20,Kitchen: 350.50, Front of House: 150.00,Sunny,None,Regular lunch service
2024-07-01,12:00,820.75,35,Kitchen: 550.00, Front of House: 270.75,Sunny,None,Peak lunch hour
2024-07-01,17:00,1250.00,50,Kitchen: 600.00, Bar: 300.00, FOH: 350.00,Sunny,None,Early dinner rush`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historical-data-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00', '00:00'
  ];

  const seasons = [
    'Spring (Mar-May)',
    'Summer (Jun-Aug)',
    'Fall (Sep-Nov)',
    'Winter (Dec-Feb)',
    'Holiday Season',
    'Off-Peak Season'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Historical Data & Patterns</h1>
        <p className="text-muted-foreground">
          Help our AI understand your business patterns and customer flow
        </p>
      </div>

      {/* Success Banner */}
      {importSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{importSuccess}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setImportSuccess(null)}
                className="inline-flex text-green-400 hover:text-green-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* File Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Import Historical Data</h2>
          <p className="text-sm text-muted-foreground">
            Upload your sales data, customer counts, and other historical information
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">📊</div>
              <div>
                <h3 className="text-lg font-medium">Upload your data</h3>
                <p className="text-sm text-muted-foreground">
                  CSV, Excel, or Google Sheets format
                </p>
              </div>
              
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Choose File
                </label>
                <p className="text-xs text-muted-foreground">
                  {uploadedFile ? `Selected: ${uploadedFile.name}` : 'No file selected'}
                </p>
                
                {/* File Upload Status */}
                {uploadedFile && localData.salesData.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-green-800 font-medium">
                      ✅ {localData.salesData.length} records imported successfully!
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      File: {uploadedFile.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Supported formats: CSV, Excel (.xlsx, .xls)</p>
                <p>Expected columns: Date, Time, Sales, Customers, Station Breakdown</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Download our CSV template to get started
                </p>
                <button
                  onClick={downloadTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Template
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        {localData.salesData.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Data Summary</h2>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{localData.salesData.length}</div>
                <div className="text-sm text-blue-700">Total Records</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  ${localData.salesData.reduce((sum, point) => sum + point.totalSales, 0).toFixed(2)}
                </div>
                <div className="text-sm text-green-700">Total Sales</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {localData.salesData.reduce((sum, point) => sum + point.customerCount, 0)}
                </div>
                <div className="text-sm text-purple-700">Total Customers</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  ${(localData.salesData.reduce((sum, point) => sum + point.totalSales, 0) / localData.salesData.length).toFixed(2)}
                </div>
                <div className="text-sm text-orange-700">Average Sale</div>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Import Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>File:</strong> {uploadedFile?.name || 'Manual entry'}</p>
                <p><strong>Date Range:</strong> {localData.salesData.length > 0 ? 
                  (() => {
                    const dates = localData.salesData.map(d => new Date(d.date).getTime());
                    const minDate = new Date(Math.min(...dates)).toLocaleDateString();
                    const maxDate = new Date(Math.max(...dates)).toLocaleDateString();
                    return `${minDate} - ${maxDate}`;
                  })() : 
                  'N/A'
                }</p>
                <p><strong>Time Range:</strong> {localData.salesData.length > 0 ? 
                  (() => {
                    const times = localData.salesData.map(d => parseInt(d.timeOfDay.split(':')[0]));
                    const minTime = Math.min(...times);
                    const maxTime = Math.max(...times);
                    return `${minTime}:00 - ${maxTime}:00`;
                  })() : 
                  'N/A'
                }</p>
              </div>
            </div>
          </div>
        )}

        {/* Sales Data */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sales Data ({localData.salesData.length} records)</h2>
            <button
              onClick={addSalesDataRow}
              className="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
            >
              + Add Row
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {localData.salesData.length > 0 ? 
              `Showing ${localData.salesData.length} data points. You can edit any record below or add new ones.` : 
              'No sales data entered yet. Add your first data point below or import from CSV above.'
            }
          </p>

          {localData.salesData.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No sales data entered yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {localData.salesData.map((row, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Data Point {index + 1}</h4>
                    <button
                      onClick={() => removeSalesDataRow(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => handleSalesDataChange(index, 'date', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Time</label>
                      <select
                        value={row.timeOfDay}
                        onChange={(e) => handleSalesDataChange(index, 'timeOfDay', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Total Sales ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={row.totalSales}
                        onChange={(e) => handleSalesDataChange(index, 'totalSales', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Customers</label>
                      <input
                        type="number"
                        value={row.customerCount}
                        onChange={(e) => handleSalesDataChange(index, 'customerCount', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Station Sales</label>
                      <input
                        type="text"
                        value={row.stationSales}
                        onChange={(e) => handleSalesDataChange(index, 'stationSales', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Kitchen: 0, FOH: 0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Business Patterns */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Business Patterns</h2>
          <p className="text-sm text-muted-foreground">
            Help us understand your typical business patterns
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Daily Sales</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Average Daily Sales ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={localData.averageDailySales}
                  onChange={(e) => handleChange('averageDailySales', parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Peak Hours</label>
                <div className="space-y-2">
                  {timeSlots.map(time => (
                    <label key={time} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={localData.peakHours.includes(time)}
                        onChange={(e) => {
                          const newPeakHours = e.target.checked
                            ? [...localData.peakHours, time]
                            : localData.peakHours.filter(h => h !== time);
                          handleChange('peakHours', newPeakHours);
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Patterns</h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Weekday vs Weekend</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-muted-foreground">Weekday</label>
                      <input
                        type="number"
                        value={localData.customerPatterns.weekday}
                        onChange={(e) => handleChange('customerPatterns', { ...localData.customerPatterns, weekday: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">Weekend</label>
                      <input
                        type="number"
                        value={localData.customerPatterns.weekend}
                        onChange={(e) => handleChange('customerPatterns', { ...localData.customerPatterns, weekend: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lunch vs Dinner</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-muted-foreground">Lunch</label>
                      <input
                        type="number"
                        value={localData.customerPatterns.lunch}
                        onChange={(e) => handleChange('customerPatterns', { ...localData.customerPatterns, lunch: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">Dinner</label>
                      <input
                        type="number"
                        value={localData.customerPatterns.dinner}
                        onChange={(e) => handleChange('customerPatterns', { ...localData.customerPatterns, dinner: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Patterns */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Seasonal Patterns</h2>
          <p className="text-sm text-muted-foreground">
            Select seasons or periods that affect your business
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            {seasons.map(season => (
              <label key={season} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localData.seasonalPatterns.includes(season)}
                  onChange={(e) => {
                    const newPatterns = e.target.checked
                      ? [...localData.seasonalPatterns, season]
                      : localData.seasonalPatterns.filter(p => p !== season);
                    handleChange('seasonalPatterns', newPatterns);
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{season}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Templates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Templates</h2>
          <p className="text-sm text-muted-foreground">
            Apply common restaurant patterns
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const template = {
                  averageDailySales: 2500,
                  peakHours: ['11:00', '12:00', '17:00', '18:00', '19:00'],
                  seasonalPatterns: ['Summer (Jun-Aug)', 'Holiday Season'],
                  customerPatterns: { weekday: 80, weekend: 120, lunch: 100, dinner: 150 }
                };
                setLocalData(prev => ({ ...prev, ...template }));
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Standard Restaurant
            </button>

            <button
              onClick={() => {
                const template = {
                  averageDailySales: 1500,
                  peakHours: ['07:00', '08:00', '12:00', '13:00'],
                  seasonalPatterns: ['Spring (Mar-May)', 'Fall (Sep-Nov)'],
                  customerPatterns: { weekday: 60, weekend: 90, lunch: 80, dinner: 70 }
                };
                setLocalData(prev => ({ ...prev, ...template }));
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Cafe/Breakfast
            </button>

            <button
              onClick={() => {
                const template = {
                  averageDailySales: 800,
                  peakHours: ['11:00', '12:00', '18:00', '19:00'],
                  seasonalPatterns: ['Holiday Season'],
                  customerPatterns: { weekday: 40, weekend: 60, lunch: 50, dinner: 50 }
                };
                setLocalData(prev => ({ ...prev, ...template }));
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Small Restaurant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
