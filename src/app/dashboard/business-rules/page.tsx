'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseService } from '@/lib/services/database';
import Link from 'next/link';

interface SetupStage {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  status: 'completed' | 'incomplete' | 'not-started';
  lastUpdated?: string;
}

export default function BusinessRulesPage() {
  const { data: session } = useSession();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [setupStages, setSetupStages] = useState<SetupStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSetupStatus = async () => {
      if (!session?.user?.email) return;

      try {
        const orgId = await DatabaseService.getCurrentUserOrganizationId();
        if (orgId) {
          setOrganizationId(orgId);
          
          // Check completion status of each setup stage
          const stages = await checkSetupCompletion(orgId);
          setSetupStages(stages);
        }
      } catch (error) {
        console.error('Error loading setup status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSetupStatus();
  }, [session]);

  const checkSetupCompletion = async (orgId: string): Promise<SetupStage[]> => {
    try {
      // Check organization data
      const organization = await DatabaseService.getOrganizationById(orgId);
      const hasOrgData = organization && organization.name && organization.address;
      
      // Check staff data
      const staff = await DatabaseService.getStaffMembers(orgId);
      const hasStaffData = staff && staff.length > 0;
      
      // Check historical data
      const historicalData = await DatabaseService.getHistoricalDataForAnalytics(orgId);
      const hasHistoricalData = historicalData && historicalData.length > 0;
      
      // Check business rules
      const businessRules = await DatabaseService.getBusinessRules(orgId);
      const hasBusinessRules = businessRules && Object.keys(businessRules).length > 0;

      return [
        {
          id: 'restaurant-info',
          title: '1. Business Information',
          description: 'Basic restaurant details, contact info, and opening hours',
          icon: '🏪',
          href: '/dashboard/business-rules/restaurant-info',
          status: hasOrgData ? 'completed' : 'incomplete',
          lastUpdated: organization?.updated_at
        },
        {
          id: 'staff-setup',
          title: '2. Staff Management',
          description: 'Employee information, roles, schedules, and performance',
          icon: '👥',
          href: '/dashboard/business-rules/staff-setup',
          status: hasStaffData ? 'completed' : 'incomplete',
          lastUpdated: staff.length > 0 ? staff[0]?.updated_at : undefined
        },
        {
          id: 'historical-data',
          title: '3. Historical Data',
          description: 'Sales history, customer patterns, and performance metrics',
          icon: '📊',
          href: '/dashboard/business-rules/historical-data',
          status: hasHistoricalData ? 'completed' : 'incomplete',
          lastUpdated: historicalData.length > 0 ? historicalData[0]?.created_at : undefined
        },
        {
          id: 'business-rules',
          title: '4. Business Rules & Policies',
          description: 'Staffing requirements, scheduling policies, and operational rules',
          icon: '⚙️',
          href: '/dashboard/business-rules/policies',
          status: hasBusinessRules ? 'completed' : 'incomplete',
          lastUpdated: businessRules?.updated_at
        },
        {
          id: 'roles-stations',
          title: '5. Roles & Stations Management',
          description: 'Define and customize staff roles, stations, and requirements',
          icon: '🎭',
          href: '/dashboard/business-rules/roles-stations',
          status: 'not-started', // Will be updated when we implement this
          lastUpdated: undefined
        }
      ];
    } catch (error) {
      console.error('Error checking setup completion:', error);
      return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'incomplete':
        return '⚠️';
      case 'not-started':
        return '⏳';
      default:
        return '❓';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Business Rules & Setup
          </h1>
          <p className="text-gray-600">
            Manage your business information, staff, policies, and operational rules.
          </p>
        </div>

        {/* Step Navigation */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {setupStages.map((stage) => (
              <Link
                key={stage.id}
                href={stage.href}
                className={`block p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  stage.status === 'completed'
                    ? 'border-green-200 bg-green-50 hover:border-green-300'
                    : stage.status === 'incomplete'
                    ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stage.icon}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stage.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : stage.status === 'incomplete'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stage.status === 'completed' ? '✓ Complete' : 
                     stage.status === 'incomplete' ? '⚠ Incomplete' : 'Not Started'}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{stage.title}</h3>
                <p className="text-sm text-gray-600">{stage.description}</p>
                {stage.lastUpdated && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(stage.lastUpdated).toLocaleDateString()}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Setup Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {setupStages.map((stage) => (
            <div
              key={stage.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{stage.icon}</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(stage.status)}`}>
                  {getStatusIcon(stage.status)} {stage.status.replace('-', ' ')}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{stage.title}</h3>
              <p className="text-gray-600 mb-4">{stage.description}</p>
              
              {stage.lastUpdated && (
                <p className="text-xs text-gray-500 mb-4">
                  Last updated: {new Date(stage.lastUpdated).toLocaleDateString()}
                </p>
              )}
              
              <Link
                href={stage.href}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  stage.status === 'completed'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : stage.status === 'incomplete'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {stage.status === 'completed' ? 'Edit' : stage.status === 'incomplete' ? 'Complete' : 'Set Up'}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🚀 Complete Full Setup
            </Link>
            <Link
              href="/dashboard/schedule"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📅 Generate Schedule
            </Link>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              📊 View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
