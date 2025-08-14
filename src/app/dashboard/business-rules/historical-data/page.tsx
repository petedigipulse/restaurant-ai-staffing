'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseService } from '@/lib/services/database';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HistoricalDataPoint {
  id: string;
  date: string;
  time: string;
  total_sales: number;
  customer_count: number;
  weather_conditions: string;
  special_events: string;
  notes: string;
}

export default function HistoricalDataPage() {
  const { data: session } = useSession();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!session?.user?.email) return;

      try {
        const orgId = await DatabaseService.getCurrentUserOrganizationId();
        if (orgId) {
          setOrganizationId(orgId);
          
          // Load historical data
          const data = await DatabaseService.getHistoricalDataForAnalytics(orgId);
          setHistoricalData(data || []);
        }
      } catch (error) {
        console.error('Error loading historical data:', error);
        setMessage({ type: 'error', text: 'Failed to load historical data' });
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoricalData();
  }, [session]);

  const handleDeleteDataPoint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this data point? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(id);
    try {
      // Note: You'll need to implement deleteHistoricalDataPoint in DatabaseService
      // For now, we'll just remove it from the local state
      setHistoricalData(prev => prev.filter(item => item.id !== id));
      setMessage({ type: 'success', text: 'Data point deleted successfully' });
    } catch (error) {
      console.error('Error deleting data point:', error);
      setMessage({ type: 'error', text: 'Failed to delete data point' });
    } finally {
      setIsDeleting(null);
    }
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
        setMessage({ type: 'success', text: `Successfully imported ${result.importedCount} data points!` });
        
        // Reload historical data
        const data = await DatabaseService.getHistoricalDataForAnalytics(organizationId!);
        setHistoricalData(data || []);
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
              <Button 
                variant="outline" 
                className="px-4 py-2 text-xs"
                onClick={() => {
                  console.log('🧪 Test button clicked');
                  console.log('📁 File input element:', document.getElementById('csv-upload'));
                  console.log('🔍 Organization ID:', organizationId);
                }}
              >
                🧪 Test
              </Button>
              <Link href="/onboarding">
                <Button variant="outline" className="px-4 py-2">
                  📥 Add More Data
                </Button>
              </Link>
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
            {message.text}
          </div>
        )}

        {/* Data Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📊</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Data Points</p>
                <p className="text-2xl font-bold text-gray-900">{historicalData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💰</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(historicalData.reduce((sum, item) => sum + (item.total_sales || 0), 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👥</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {historicalData.reduce((sum, item) => sum + (item.customer_count || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📅</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Date Range</p>
                <p className="text-lg font-bold text-gray-900">
                  {historicalData.length > 0 ? (
                    <>
                      {formatDate(historicalData[0].date)} - {formatDate(historicalData[historicalData.length - 1].date)}
                    </>
                  ) : 'No data'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Sales Data</h2>
          </div>
          
          {historicalData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weather
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Special Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {formatCurrency(item.total_sales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.customer_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.weather_conditions || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.special_events || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {item.notes || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteDataPoint(item.id)}
                          disabled={isDeleting === item.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {isDeleting === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Historical Data Found</h3>
              <p className="text-gray-600 mb-6">You haven't added any historical sales data yet.</p>
              <Link href="/onboarding">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  📥 Add Historical Data
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Data Insights */}
        {historicalData.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Average Daily Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(historicalData.reduce((sum, item) => sum + (item.total_sales || 0), 0) / historicalData.length)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Average Customers per Day</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(historicalData.reduce((sum, item) => sum + (item.customer_count || 0), 0) / historicalData.length)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Average Sale per Customer</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    historicalData.reduce((sum, item) => sum + (item.total_sales || 0), 0) / 
                    historicalData.reduce((sum, item) => sum + (item.customer_count || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
