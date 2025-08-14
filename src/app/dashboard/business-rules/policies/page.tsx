'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseService } from '@/lib/services/database';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BusinessRules {
  min_staff_per_shift: number;
  max_hours_per_week: number;
  preferred_shift_length: number;
  overtime_threshold: number;
  break_requirements: string;
  min_staffing_requirements?: any;
  labor_cost_management?: any;
  shift_constraints?: any;
  additional_policies?: {
    staffing_guidelines?: string;
    cost_optimization?: string;
    compliance_requirements?: string;
    custom_policies?: string[];
  };
}

export default function BusinessPoliciesPage() {
  const { data: session } = useSession();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [businessRules, setBusinessRules] = useState<BusinessRules | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newCustomPolicy, setNewCustomPolicy] = useState('');

  useEffect(() => {
    const loadBusinessRules = async () => {
      if (!session?.user?.email) return;

      try {
        const orgId = await DatabaseService.getCurrentUserOrganizationId();
        if (orgId) {
          setOrganizationId(orgId);
          
          // Load business rules
          const rules = await DatabaseService.getBusinessRules(orgId);
          if (rules) {
            setBusinessRules({
              min_staff_per_shift: rules.min_staffing_requirements?.min_staff_per_shift || 2,
              max_hours_per_week: rules.labor_cost_management?.max_hours_per_week || 40,
              preferred_shift_length: rules.shift_constraints?.preferred_shift_length || 8,
              overtime_threshold: rules.labor_cost_management?.overtime_threshold || 40,
              break_requirements: rules.break_requirements?.break_requirements || '30-minute break after 5 hours',
              min_staffing_requirements: rules.min_staffing_requirements || {},
              labor_cost_management: rules.labor_cost_management || {},
              shift_constraints: rules.shift_constraints || {},
              additional_policies: rules.additional_policies || {}
            });
          } else {
            // Set default values if no rules exist
            setBusinessRules({
              min_staff_per_shift: 2,
              max_hours_per_week: 40,
              preferred_shift_length: 8,
              overtime_threshold: 40,
              break_requirements: '30-minute break after 5 hours'
            });
          }
        }
      } catch (error) {
        console.error('Error loading business rules:', error);
        setMessage({ type: 'error', text: 'Failed to load business rules' });
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessRules();
  }, [session]);

  const handleBusinessRulesChange = (field: keyof BusinessRules, value: any) => {
    setBusinessRules(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleCustomPolicyChange = (index: number, value: string) => {
    setBusinessRules(prev => {
      if (!prev) return null;
      const customPolicies = [...(prev.additional_policies?.custom_policies || [])];
      customPolicies[index] = value;
      return {
        ...prev,
        additional_policies: {
          ...prev.additional_policies,
          custom_policies: customPolicies
        }
      };
    });
  };

  const addCustomPolicy = () => {
    if (!newCustomPolicy.trim()) return;
    
    setBusinessRules(prev => {
      if (!prev) return null;
      const customPolicies = [...(prev.additional_policies?.custom_policies || []), newCustomPolicy.trim()];
      return {
        ...prev,
        additional_policies: {
          ...prev.additional_policies,
          custom_policies: customPolicies
        }
      };
    });
    setNewCustomPolicy('');
  };

  const removeCustomPolicy = (index: number) => {
    setBusinessRules(prev => {
      if (!prev) return null;
      const customPolicies = [...(prev.additional_policies?.custom_policies || [])];
      customPolicies.splice(index, 1);
      return {
        ...prev,
        additional_policies: {
          ...prev.additional_policies,
          custom_policies: customPolicies
        }
      };
    });
  };

  const handleSave = async () => {
    if (!organizationId || !businessRules) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // Transform the data to match the database schema
      const rulesData = {
        min_staffing_requirements: {
          min_staff_per_shift: businessRules.min_staff_per_shift
        },
        labor_cost_management: {
          max_hours_per_week: businessRules.max_hours_per_week,
          overtime_threshold: businessRules.overtime_threshold
        },
        shift_constraints: {
          preferred_shift_length: businessRules.preferred_shift_length
        },
        break_requirements: {
          break_requirements: businessRules.break_requirements
        },
        additional_policies: businessRules.additional_policies || {}
      };

      // Update business rules
      await DatabaseService.updateBusinessRulesByOrganization(organizationId, rulesData);
      setMessage({ type: 'success', text: 'Business rules updated successfully!' });
    } catch (error) {
      console.error('Error updating business rules:', error);
      setMessage({ type: 'error', text: 'Failed to update business rules' });
    } finally {
      setIsSaving(false);
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

  if (!businessRules) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Business Rules Found</h2>
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
              <h1 className="text-3xl font-bold text-gray-900">Business Rules & Policies</h1>
              <p className="text-gray-600 mt-2">Configure your operational policies and staffing requirements</p>
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

        {/* Staffing Requirements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Staffing Requirements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Minimum Staff per Shift
              </label>
              <input
                type="number"
                value={businessRules.min_staff_per_shift}
                onChange={(e) => handleBusinessRulesChange('min_staff_per_shift', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                min="1"
                placeholder="e.g., 2"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum number of staff required for each shift</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Preferred Shift Length (hours)
              </label>
              <input
                type="number"
                value={businessRules.preferred_shift_length}
                onChange={(e) => handleBusinessRulesChange('preferred_shift_length', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                min="1"
                max="24"
                placeholder="e.g., 8"
              />
              <p className="text-xs text-gray-500 mt-1">Standard shift duration in hours</p>
            </div>
          </div>
        </div>

        {/* Labor Cost Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Labor Cost Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Maximum Hours per Week
              </label>
              <input
                type="number"
                value={businessRules.max_hours_per_week}
                onChange={(e) => handleBusinessRulesChange('max_hours_per_week', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                min="1"
                max="168"
                placeholder="e.g., 40"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum hours any staff member can work per week</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Overtime Threshold (hours)
              </label>
              <input
                type="number"
                value={businessRules.overtime_threshold}
                onChange={(e) => handleBusinessRulesChange('overtime_threshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                min="1"
                max="168"
                placeholder="e.g., 40"
              />
              <p className="text-xs text-gray-500 mt-1">Hours worked before overtime rates apply</p>
            </div>
          </div>
        </div>

        {/* Break Requirements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Break Requirements</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Break Policy
            </label>
            <textarea
              value={businessRules.break_requirements}
              onChange={(e) => handleBusinessRulesChange('break_requirements', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              rows={4}
              placeholder="e.g., 30-minute break after 5 hours, 15-minute break every 4 hours"
            />
            <p className="text-xs text-gray-500 mt-1">Describe your break requirements and policies</p>
          </div>
        </div>

        {/* Additional Policies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Policies</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Staffing Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure adequate coverage for all stations during peak hours</li>
                <li>• Balance workload across staff members</li>
                <li>• Consider staff performance and experience levels</li>
                <li>• Maintain minimum staffing requirements for safety</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Cost Optimization</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Monitor overtime costs and minimize excessive hours</li>
                <li>• Balance staff costs with service quality</li>
                <li>• Use performance data to optimize scheduling</li>
                <li>• Consider seasonal demand patterns</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Compliance Requirements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Follow local labor laws and regulations</li>
                <li>• Ensure proper break and rest periods</li>
                <li>• Maintain accurate time and attendance records</li>
                <li>• Comply with minimum wage requirements</li>
              </ul>
            </div>

            {/* Custom Policies */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-gray-900 mb-4">Custom Policies</h3>
              
              {/* Add New Policy */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newCustomPolicy}
                  onChange={(e) => setNewCustomPolicy(e.target.value)}
                  placeholder="Enter a new custom policy..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomPolicy()}
                />
                <Button
                  onClick={addCustomPolicy}
                  disabled={!newCustomPolicy.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </Button>
              </div>

              {/* Existing Custom Policies */}
              {businessRules.additional_policies?.custom_policies && businessRules.additional_policies.custom_policies.length > 0 ? (
                <div className="space-y-2">
                  {businessRules.additional_policies.custom_policies.map((policy, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                      <input
                        type="text"
                        value={policy}
                        onChange={(e) => handleCustomPolicyChange(index, e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                      />
                      <button
                        onClick={() => removeCustomPolicy(index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No custom policies added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/schedule">
              <Button className="bg-blue-600 hover:bg-blue-700">
                📅 Generate Schedule
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button className="bg-purple-600 hover:bg-purple-700">
                📊 View Analytics
              </Button>
            </Link>
            <Link href="/dashboard/staff">
              <Button className="bg-green-600 hover:bg-green-700">
                👥 Manage Staff
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
