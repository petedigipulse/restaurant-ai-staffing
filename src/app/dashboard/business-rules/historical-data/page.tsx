'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DatabaseService } from '@/lib/services/database';

interface HistoricalDataPoint {
  id: string;
  organization_id: string;
  date: string;
  time: string;
  total_sales: number;
  customer_count: number;
  weather_conditions: string;
  special_events: string;
  notes: string;
  station_breakdown: any;
  created_at: string;
}

interface ImportGroup {
  id: string;
  importDate: string;
  dataPoints: HistoricalDataPoint[];
  totalSales: number;
  totalCustomers: number;
  dateRange: string;
  count: number;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

export default function HistoricalDataPage() {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [expandedImports, setExpandedImports] = useState<Set<string>>(new Set());
  const [importGroups, setImportGroups] = useState<ImportGroup[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('🔄 Loading data...');
      const orgId = await DatabaseService.getCurrentUserOrganizationId();
      setOrganizationId(orgId);

      if (orgId) {
        console.log('🏢 Organization ID:', orgId);
        const data = await DatabaseService.getAllHistoricalData(orgId);
        console.log('📊 Loaded historical data:', data?.length, 'records');
        
        // Log sample data to see what we're getting
        if (data && data.length > 0) {
          console.log('📅 First 3 records:', data.slice(0, 3).map(d => ({
            id: d.id,
            date: d.date,
            sales: d.total_sales,
            customers: d.customer_count,
            created: d.created_at,
            org_id: d.organization_id
          })));
          
          console.log('📅 Last 3 records:', data.slice(-3).map(d => ({
            id: d.id,
            date: d.date,
            sales: d.total_sales,
            customers: d.customer_count,
            created: d.created_at,
            org_id: d.organization_id
          })));
        }
        
        setHistoricalData(data || []);
        
        // Group the imports
        console.log('🔄 Grouping imports...');
        const grouped = groupImportsByDate(data || []);
        console.log('📦 Grouped result:', grouped);
        setImportGroups(grouped);
        console.log('✅ Data loading and grouping complete');
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load historical data' });
    } finally {
      setIsLoading(false);
    }
  };

  const groupImportsByDate = (data: HistoricalDataPoint[]) => {
    console.log('🔄 Grouping imports for', data.length, 'data points');
    
    // Group data by import batch (created_at timestamp rounded to nearest minute)
    const groups = new Map<string, HistoricalDataPoint[]>();
    
    data.forEach((point, index) => {
      // Round to nearest minute to group imports that happen close together
      const importTime = new Date(point.created_at);
      const roundedTime = new Date(importTime.getFullYear(), importTime.getMonth(), importTime.getDate(), 
                                  importTime.getHours(), importTime.getMinutes());
      const importKey = roundedTime.toISOString();
      
      if (!groups.has(importKey)) {
        groups.set(importKey, []);
      }
      groups.get(importKey)!.push(point);
      
      // Log first few points for debugging
      if (index < 3) {
        console.log(`📅 Point ${index}: date=${point.date}, created_at=${point.created_at}, importKey=${importKey}`);
      }
    });

    console.log('📊 Found', groups.size, 'import groups');

    // Convert to ImportGroup array
    const importGroupsArray: ImportGroup[] = Array.from(groups.entries()).map(([importKey, points]) => {
      const sortedPoints = points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const totalSales = points.reduce((sum, point) => sum + (point.total_sales || 0), 0);
      const totalCustomers = points.reduce((sum, point) => sum + (point.customer_count || 0), 0);
      const dateRange = `${sortedPoints[0]?.date} to ${sortedPoints[sortedPoints.length - 1]?.date}`;
      
      // Format the import time for display
      const importTime = new Date(importKey);
      const importDateDisplay = importTime.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      console.log(`📈 Group ${importDateDisplay}: ${points.length} points, sales: $${totalSales}, customers: ${totalCustomers}`);
      
      return {
        id: importKey,
        importDate: importDateDisplay,
        dataPoints: sortedPoints,
        totalSales,
        totalCustomers,
        dateRange,
        count: points.length
      };
    });

    // Sort by import time (newest first)
    importGroupsArray.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime());
    
    console.log('✅ Final import groups:', importGroupsArray.map(g => `${g.importDate}: ${g.count} points`));
    console.log('🔄 Setting import groups state with', importGroupsArray.length, 'groups');
    return importGroupsArray;
  };

  const toggleImportExpansion = (importId: string) => {
    const newExpanded = new Set(expandedImports);
    if (newExpanded.has(importId)) {
      newExpanded.delete(importId);
    } else {
      newExpanded.add(importId);
    }
    setExpandedImports(newExpanded);
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔄 CSV upload triggered:', event.target.files);
    
    const file = event.target.files?.[0];
    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    console.log('📁 File selected:', file.name, file.size, file.type);
    
    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('csv', file);
      formData.append('organizationId', organizationId || '');

      console.log('📤 Sending form data to API...');

      const response = await fetch('/api/historical-data/import', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Import successful:', result);
        
        let messageText = result.message || `Successfully imported ${result.importedCount} data points!`;
        
        // Add conflict information if there were conflicts
        if (result.hasConflicts && result.conflicts) {
          messageText += ` ${result.conflicts.conflictCount} existing records were updated.`;
        }
        
        setMessage({ type: 'success', text: messageText });
        
        // Reload historical data and regroup imports
        try {
          console.log('🔄 Reloading data after import...');
          
          // Force a small delay to ensure database is updated
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const data = await DatabaseService.getAllHistoricalData(organizationId!);
          console.log('📊 Reloaded data after import:', data?.length, 'records');
          
          // Log some sample data to see what we got
          if (data && data.length > 0) {
            console.log('📅 Sample data points after import:', data.slice(0, 3).map(d => ({
              id: d.id,
              date: d.date,
              sales: d.total_sales,
              customers: d.customer_count,
              created: d.created_at
            })));
            
            // Check if we have the new data
            const newDataCount = data.length - historicalData.length;
            console.log('🆕 New data count:', newDataCount, 'records');
          }
          
          setHistoricalData(data || []);
          
          // Regroup the data
          console.log('🔄 Regrouping imports...');
          const grouped = groupImportsByDate(data || []);
          console.log('📦 Regrouped result:', grouped);
          setImportGroups(grouped);
          console.log('✅ Data reloaded and regrouped successfully');
          
          // Force a re-render
          setTimeout(() => {
            console.log('🔄 Forcing re-render...');
            setHistoricalData(prev => [...prev]);
          }, 500);
          
        } catch (error) {
          console.error('❌ Error reloading data:', error);
          setMessage({ type: 'error', text: 'Data imported but failed to refresh display. Please refresh the page.' });
        }
      } else {
        const error = await response.json();
        console.error('❌ Import failed:', error);
        setMessage({ type: 'error', text: `Import failed: ${error.error}` });
      }
    } catch (error) {
      console.error('❌ Error uploading CSV:', error);
      setMessage({ type: 'error', text: 'Failed to upload CSV file' });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const downloadCSVTemplate = () => {
    const csvContent = `date,time,total_sales,customer_count,station_breakdown,weather_conditions,special_events,notes
2025-08-13,09:00,150.75,25,"Kitchen: 100.00, Front of House: 50.75",Sunny 22°C,,Morning rush
2025-08-13,10:00,220.50,35,"Kitchen: 150.00, Front of House: 70.50",Sunny 24°C,,Peak breakfast
2025-08-13,11:00,300.00,50,"Kitchen: 200.00, Front of House: 100.00",Sunny 26°C,,Lunch prep
2025-08-13,12:00,450.25,75,"Kitchen: 300.00, Front of House: 150.25",Sunny 28°C,,Lunch rush
2025-08-13,13:00,380.50,65,"Kitchen: 250.00, Front of House: 130.50",Sunny 29°C,,Post-lunch
2025-08-13,14:00,220.00,40,"Kitchen: 150.00, Front of House: 70.00",Sunny 30°C,,Afternoon lull
2025-08-13,15:00,180.75,30,"Kitchen: 120.00, Front of House: 60.75",Sunny 31°C,,Pre-dinner
2025-08-13,16:00,320.00,55,"Kitchen: 200.00, Front of House: 120.00",Sunny 30°C,,Dinner start
2025-08-13,17:00,480.25,80,"Kitchen: 320.00, Front of House: 160.25",Sunny 29°C,,Dinner rush
2025-08-13,18:00,520.50,85,"Kitchen: 350.00, Front of House: 170.50",Sunny 28°C,,Peak dinner
2025-08-13,19:00,450.00,75,"Kitchen: 300.00, Front of House: 150.00",Sunny 27°C,,Evening service`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historical_data_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading historical data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/business-rules" className="text-blue-600 hover:text-blue-700">
                  ← Back to Business Rules
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Historical Data</h1>
              <p className="text-gray-600 mt-2">View and manage your sales history and performance data</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => downloadCSVTemplate()}
                className="px-4 py-2"
              >
                📥 Download Template
              </Button>
              <Button 
                variant="outline" 
                onClick={async () => {
                  console.log('🔍 Debug: Current state');
                  console.log('📊 Historical data:', historicalData.length, 'records');
                  console.log('📦 Import groups:', importGroups.length, 'groups');
                  console.log('🏢 Organization ID:', organizationId);
                  if (historicalData.length > 0) {
                    console.log('📅 Sample data:', historicalData.slice(0, 3));
                  }
                  if (organizationId) {
                    try {
                      const data = await DatabaseService.getAllHistoricalData(organizationId);
                      console.log('🔍 Database check result:', {
                        totalRecords: data?.length,
                        sampleRecords: data?.slice(0, 3),
                        lastRecords: data?.slice(-3)
                      });
                    } catch (error) {
                      console.error('🔍 Database check failed:', error);
                    }
                  }
                }}
                className="px-4 py-2"
              >
                🔍 Debug
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setMessage({ type: 'success', text: 'Test message - Debug area is working!' });
                }}
                className="px-4 py-2"
              >
                🧪 Test Message
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleCSVUpload(e)}
                className="hidden"
                id="csv-upload"
                disabled={isUploading}
              />
              <label htmlFor="csv-upload">
                <Button 
                  variant="outline" 
                  className="px-4 py-2 cursor-pointer" 
                  disabled={isUploading}
                  onClick={() => {
                    // Trigger file input click as backup
                    const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                >
                  {isUploading ? '📁 Uploading...' : '📁 Upload CSV'}
                </Button>
              </label>
              <Link href="/dashboard/analytics">
                <Button className="px-4 py-2 bg-blue-600 hover:bg-blue-700">
                  📊 View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <span>{message.text}</span>
              {message.type === 'success' && (
                <div className="flex space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      console.log('🔄 Manual refresh triggered');
                      loadData();
                    }}
                    className="text-sm px-3 py-1"
                  >
                    🔄 Refresh Display
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      console.log('🔍 Manual database check...');
                      if (organizationId) {
                        try {
                          const data = await DatabaseService.getAllHistoricalData(organizationId);
                          console.log('🔍 Database check result:', {
                            totalRecords: data?.length,
                            sampleRecords: data?.slice(0, 3),
                            lastRecords: data?.slice(-3)
                          });
                        } catch (error) {
                          console.error('🔍 Database check failed:', error);
                        }
                      }
                    }}
                    className="text-sm px-3 py-1"
                  >
                    🔍 Check DB
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overall Summary */}
        {historicalData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Data Points</p>
                <p className="text-2xl font-bold text-gray-900">{historicalData.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(historicalData.reduce((sum, item) => sum + (item.total_sales || 0), 0))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {historicalData.reduce((sum, item) => sum + (item.customer_count || 0), 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Import Groups</p>
                <p className="text-2xl font-bold text-purple-600">{importGroups.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Import Groups */}
        <div className="space-y-6">
          {importGroups.map((importGroup) => (
            <div key={importGroup.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Import Group Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleImportExpansion(importGroup.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Import from {formatDate(importGroup.importDate)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {importGroup.count} data points • {importGroup.dateRange}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Quick Insights */}
                    <div className="flex space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Total Sales</p>
                        <p className="font-semibold text-green-600">{formatCurrency(importGroup.totalSales)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Customers</p>
                        <p className="font-semibold text-blue-600">{importGroup.totalCustomers}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Avg Sale</p>
                        <p className="font-semibold text-purple-600">
                          {formatCurrency(importGroup.totalSales / importGroup.count)}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {expandedImports.has(importGroup.id) ? '▼' : '▶'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Data Points */}
              {expandedImports.has(importGroup.id) && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Data Points</h4>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sales
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customers
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Weather
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Special Events
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {importGroup.dataPoints.map((point) => (
                            <tr key={point.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatDate(point.date)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {point.time}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600">
                                {formatCurrency(point.total_sales)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {point.customer_count}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {point.weather_conditions || '-'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {point.special_events || '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                {point.notes || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {importGroups.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Historical Data Yet</h3>
            <p className="text-gray-600 mb-6">
              Start by uploading your sales data via CSV or adding data through the onboarding process.
            </p>
            <div className="flex justify-center space-x-3">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleCSVUpload(e)}
                className="hidden"
                id="csv-upload-empty"
              />
              <label htmlFor="csv-upload-empty">
                <Button variant="outline" className="px-4 py-2 cursor-pointer">
                  📁 Upload CSV
                </Button>
              </label>
              <Link href="/onboarding">
                <Button className="px-4 py-2 bg-blue-600 hover:bg-blue-700">
                  📥 Add Data
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
