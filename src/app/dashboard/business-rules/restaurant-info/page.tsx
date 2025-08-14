'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseService } from '@/lib/services/database';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RestaurantData {
  name: string;
  address: string;
  phone: string;
  email: string;
  cuisine_type: string;
  capacity: number;
  opening_hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

export default function RestaurantInfoPage() {
  const { data: session } = useSession();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadOrganizationData = async () => {
      if (!session?.user?.email) return;

      try {
        const orgId = await DatabaseService.getCurrentUserOrganizationId();
        if (orgId) {
          setOrganizationId(orgId);
          
          // Load existing data
          const organization = await DatabaseService.getOrganizationById(orgId);
          if (organization) {
            setRestaurantData({
              name: organization.name || '',
              address: organization.address || '',
              phone: organization.phone || '',
              email: organization.email || '',
              cuisine_type: organization.cuisine_type || '',
              capacity: organization.capacity || 50,
              opening_hours: organization.opening_hours || {
                monday: { open: '09:00', close: '17:00', closed: false },
                tuesday: { open: '09:00', close: '17:00', closed: false },
                wednesday: { open: '09:00', close: '17:00', closed: false },
                thursday: { open: '09:00', close: '17:00', closed: false },
                friday: { open: '09:00', close: '17:00', closed: false },
                saturday: { open: '09:00', close: '17:00', closed: false },
                sunday: { open: '09:00', close: '17:00', closed: false }
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading organization data:', error);
        setMessage({ type: 'error', text: 'Failed to load organization data' });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizationData();
  }, [session]);

  const handleRestaurantDataChange = (field: keyof RestaurantData, value: any) => {
    setRestaurantData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleOpeningHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: any) => {
    setRestaurantData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        opening_hours: {
          ...prev.opening_hours,
          [day]: {
            ...prev.opening_hours[day as keyof typeof prev.opening_hours],
            [field]: value
          }
        }
      };
    });
  };

  const handleSave = async () => {
    if (!organizationId || !restaurantData) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // Update organization data
      await DatabaseService.updateOrganization(organizationId, restaurantData);
      setMessage({ type: 'success', text: 'Restaurant information updated successfully!' });
    } catch (error) {
      console.error('Error updating restaurant information:', error);
      setMessage({ type: 'error', text: 'Failed to update restaurant information' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant information...</p>
        </div>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Restaurant Data Found</h2>
          <p className="text-gray-600 mb-4">Please complete the setup wizard first.</p>
          <Link href="/onboarding">
            <Button>Complete Setup</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/business-rules" className="text-blue-600 hover:text-blue-700">
                  ← Back to Business Rules
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Information</h1>
              <p className="text-gray-600 mt-2">Update your restaurant details and contact information</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
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

        {/* Restaurant Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                value={restaurantData.name}
                onChange={(e) => handleRestaurantDataChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Cuisine Type
              </label>
              <input
                type="text"
                value={restaurantData.cuisine_type}
                onChange={(e) => handleRestaurantDataChange('cuisine_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="e.g., Italian, Asian, American"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Address
              </label>
              <input
                type="text"
                value={restaurantData.address}
                onChange={(e) => handleRestaurantDataChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={restaurantData.phone}
                onChange={(e) => handleRestaurantDataChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={restaurantData.email}
                onChange={(e) => handleRestaurantDataChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Capacity
              </label>
              <input
                type="number"
                value={restaurantData.capacity}
                onChange={(e) => handleRestaurantDataChange('capacity', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Opening Hours</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(restaurantData.opening_hours).map(([day, hours]) => (
              <div key={day} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 capitalize">{day}</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => handleOpeningHoursChange(day, 'closed', !e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Open</span>
                  </label>
                </div>
                
                {!hours.closed && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Open</label>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Close</label>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
