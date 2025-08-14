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
      const orgId = await DatabaseService.getCurrentUserOrganizationId();
      setOrganizationId(orgId);

      if (orgId) {
        const data = await DatabaseService.getHistoricalDataForAnalytics(orgId);
        setHistoricalData(data || []);
        groupImportsByDate(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load historical data' });
    } finally {
      setIsLoading(false);
    }
  };

  const groupImportsByDate = (data: HistoricalDataPoint[]) => {
    console.log('🔄 Grouping imports for', data.length, 'data points');
    
    // Group data by import date (created_at date)
    const groups = new Map<string, HistoricalDataPoint[]>();
    
    data.forEach((point, index) => {
      const importDate = new Date(point.created_at).toDateString();
      if (!groups.has(importDate)) {
        groups.set(importDate, []);
      }
      groups.get(importDate)!.push(point);
      
      // Log first few points for debugging
      if (index < 3) {
        console.log(`📅 Point ${index}: date=${point.date}, created_at=${point.created_at}, importDate=${importDate}`);
      }
    });

    console.log('📊 Found', groups.size, 'import groups');

    // Convert to ImportGroup array
    const importGroupsArray: ImportGroup[] = Array.from(groups.entries()).map(([date, points]) => {
      const sortedPoints = points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const totalSales = points.reduce((sum, point) => sum + (point.total_sales || 0), 0);
      const totalCustomers = points.reduce((sum, point) => sum + (point.customer_count || 0), 0);
      const dateRange = `${sortedPoints[0]?.date} to ${sortedPoints[sortedPoints.length - 1]?.date}`;
      
      console.log(`📈 Group ${date}: ${points.length} points, sales: $${totalSales}, customers: ${totalCustomers}`);
      
      return {
        id: date,
        importDate: date,
        dataPoints: sortedPoints,
        totalSales,
        totalCustomers,
        dateRange,
        count: points.length
      };
    });

    // Sort by import date (newest first)
    importGroupsArray.sort((a, b) => new Date(b.importDate).getTime() - new Date(a.importDate).getTime());
    
    console.log('✅ Final import groups:', importGroupsArray.map(g => `${g.importDate}: ${g.count} points`));
    setImportGroups(importGroupsArray);
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
          const data = await DatabaseService.getHistoricalDataForAnalytics(organizationId!);
          console.log('📊 Reloaded data:', data?.length, 'records');
          setHistoricalData(data || []);
          
          // Regroup the data
          console.log('🔄 Regrouping imports...');
          groupImportsByDate(data || []);
          console.log('✅ Data reloaded and regrouped successfully');
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
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log('🔄 Manual refresh triggered');
                    loadData();
                  }}
                  className="ml-4 text-sm px-3 py-1"
                >
                  🔄 Refresh Display
                </Button>
              )}
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
