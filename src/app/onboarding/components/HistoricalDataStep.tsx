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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // In a real app, you'd parse the CSV/Excel file here
      // For now, we'll simulate some sample data
      const sampleData = [
        { date: '2024-07-01', timeOfDay: '11:00', totalSales: 500.25, customerCount: 20, stationSales: 'Kitchen: 350.50, Front of House: 150.00' },
        { date: '2024-07-01', timeOfDay: '12:00', totalSales: 820.75, customerCount: 35, stationSales: 'Kitchen: 550.00, Front of House: 270.75' },
        { date: '2024-07-01', timeOfDay: '17:00', totalSales: 1250, customerCount: 50, stationSales: 'Kitchen: 600.00, Bar: 300.00, FOH: 350.00' }
      ];
      handleChange('salesData', sampleData);
    }
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
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Supported formats: CSV, Excel (.xlsx, .xls)</p>
                <p>Expected columns: Date, Time, Sales, Customers, Station Breakdown</p>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Data Entry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Manual Data Entry</h2>
            <button
              onClick={addSalesDataRow}
              className="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
            >
              + Add Row
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Or manually enter your sales data below
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
