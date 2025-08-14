'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseService } from '@/lib/services/database';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StaffSummary {
  totalStaff: number;
  activeStaff: number;
  roles: string[];
  totalHourlyCost: number;
  averagePerformance: number;
}

export default function StaffSetupPage() {
  const { data: session } = useSession();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [staffSummary, setStaffSummary] = useState<StaffSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaffSummary = async () => {
      if (!session?.user?.email) return;

      try {
        const orgId = await DatabaseService.getCurrentUserOrganizationId();
        if (orgId) {
          setOrganizationId(orgId);
          
          // Load staff summary
          const staff = await DatabaseService.getStaffMembers(orgId);
          if (staff && staff.length > 0) {
            const roles = [...new Set(staff.map(s => s.role))];
            const totalHourlyCost = staff.reduce((sum, s) => sum + (s.hourly_wage || 0), 0);
            const averagePerformance = staff.reduce((sum, s) => sum + (s.performance_score || 0), 0) / staff.length;
            
            setStaffSummary({
              totalStaff: staff.length,
              activeStaff: staff.filter(s => s.status === 'active').length,
              roles,
              totalHourlyCost,
              averagePerformance: Math.round(averagePerformance)
            });
          }
        }
      } catch (error) {
        console.error('Error loading staff summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaffSummary();
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/business-rules" className="text-blue-600 hover:text-blue-700">
                  ← Back to Business Rules
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600 mt-2">Manage your staff information, roles, and performance</p>
            </div>
            <Link href="/dashboard/staff">
              <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700">
                Manage Staff
              </Button>
            </Link>
          </div>
        </div>

        {staffSummary ? (
          <>
            {/* Staff Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">👥</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Staff</p>
                    <p className="text-2xl font-bold text-gray-900">{staffSummary.totalStaff}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">✅</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Staff</p>
                    <p className="text-2xl font-bold text-gray-900">{staffSummary.activeStaff}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">💰</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Hourly Cost</p>
                    <p className="text-2xl font-bold text-gray-900">${staffSummary.totalHourlyCost}/hr</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📊</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{staffSummary.averagePerformance}/100</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Roles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Staff Roles</h2>
              <div className="flex flex-wrap gap-2">
                {staffSummary.roles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard/staff">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    👥 View All Staff
                  </Button>
                </Link>
                <Link href="/dashboard/staff?modal=add">
                  <Button className="bg-green-600 hover:bg-green-700">
                    ➕ Add New Staff
                  </Button>
                </Link>
                <Link href="/dashboard/staff?modal=import">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    📥 Import CSV
                  </Button>
                </Link>
                <Link href="/dashboard/analytics">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    📊 Performance Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Staff Data Found</h2>
            <p className="text-gray-600 mb-6">You haven't added any staff members yet. Get started by adding your team.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/staff?modal=add">
                <Button className="bg-green-600 hover:bg-green-700 px-6 py-3">
                  ➕ Add First Staff Member
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="outline" className="px-6 py-3">
                  🚀 Complete Setup Wizard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
