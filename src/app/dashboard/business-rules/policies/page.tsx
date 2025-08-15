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
  additional_policies: {
    staffing_guidelines: string[];
    cost_optimization: string[];
    compliance_requirements: string[];
    custom_policies: string[];
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
              additional_policies: rules.additional_policies || {
                staffing_guidelines: [
                  'Ensure adequate coverage for all stations during peak hours',
                  'Balance workload across staff members',
                  'Consider staff performance and experience levels',
                  'Maintain minimum staffing requirements for safety'
                ],
                cost_optimization: [
                  'Monitor overtime costs and minimize excessive hours',
                  'Balance staff costs with service quality',
                  'Use performance data to optimize scheduling',
                  'Consider seasonal demand patterns'
                ],
                compliance_requirements: [
                  'Follow local labor laws and regulations',
                  'Ensure proper break and rest periods',
                  'Maintain accurate time and attendance records',
                  'Comply with minimum wage requirements'
                ],
                custom_policies: []
              }
            });
          } else {
            // Set default values if no rules exist
            setBusinessRules({
              min_staff_per_shift: 2,
              max_hours_per_week: 40,
              preferred_shift_length: 8,
              overtime_threshold: 40,
              break_requirements: '30-minute break after 5 hours',
              additional_policies: {
                staffing_guidelines: [
                  'Ensure adequate coverage for all stations during peak hours',
                  'Balance workload across staff members',
                  'Consider staff performance and experience levels',
                  'Maintain minimum staffing requirements for safety'
                ],
                cost_optimization: [
                  'Monitor overtime costs and minimize excessive hours',
                  'Balance staff costs with service quality',
                  'Use performance data to optimize scheduling',
                  'Consider seasonal demand patterns'
                ],
                compliance_requirements: [
                  'Follow local labor laws and regulations',
                  'Ensure proper break and rest periods',
                  'Maintain accurate time and attendance records',
                  'Comply with minimum wage requirements'
                ],
                custom_policies: []
              }
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

  const handlePolicyChange = (category: keyof BusinessRules['additional_policies'], index: number, value: string) => {
    setBusinessRules(prev => {
      if (!prev) return null;
      const policies = [...(prev.additional_policies?.[category] || [])];
      policies[index] = value;
      return {
        ...prev,
        additional_policies: {
          ...prev.additional_policies,
          [category]: policies
        }
      };
    });
  };

  const addPolicy = (category: keyof BusinessRules['additional_policies']) => {
    setBusinessRules(prev => {
      if (!prev) return null;
      const policies = [...(prev.additional_policies?.[category] || [])];
      policies.push(''); // Add an empty string for new policy
      return {
        ...prev,
        additional_policies: {
          ...prev.additional_policies,
          [category]: policies
        }
      };
    });
  };

  const removePolicy = (category: keyof BusinessRules['additional_policies'], index: number) => {
    setBusinessRules(prev => {
      if (!prev) return null;
      const policies = [...(prev.additional_policies?.[category] || [])];
      policies.splice(index, 1);
      return {
        ...prev,
        additional_policies: {
          ...prev.additional_policies,
          [category]: policies
        }
      };
    });
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

      console.log('🔄 Saving business rules:', { organizationId, rulesData });

      // Update business rules
      const result = await DatabaseService.updateBusinessRulesByOrganization(organizationId, rulesData);
      
      console.log('✅ Business rules saved successfully:', result);
      setMessage({ type: 'success', text: 'Business rules updated successfully!' });
      
      // Verify the data was saved by fetching it back
      setTimeout(async () => {
        try {
          const verification = await DatabaseService.getBusinessRules(organizationId);
          console.log('🔍 Verification - Retrieved business rules:', verification);
        } catch (error) {
          console.error('❌ Verification failed:', error);
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error updating business rules:', error);
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
          
          <div className="space-y-6">
            {/* Staffing Guidelines */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Staffing Guidelines</h3>
              <div className="space-y-3">
                {businessRules.additional_policies?.staffing_guidelines?.map((policy, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 mt-2">•</span>
                      <textarea
                        value={policy}
                        onChange={(e) => handlePolicyChange('staffing_guidelines', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        rows={3}
                        placeholder="Enter staffing guideline..."
                      />
                      <button
                        onClick={() => removePolicy('staffing_guidelines', index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800 text-sm mt-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addPolicy('staffing_guidelines')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Guideline
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  💡 <strong>Tips:</strong> Focus on operational efficiency and service quality. Examples: "Ensure adequate coverage for all stations during peak hours", 
                  "Balance workload across staff members", "Consider staff performance and experience levels"
                </p>
              </div>
            </div>
            
            {/* Cost Optimization */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Cost Optimization</h3>
              <div className="space-y-3">
                {businessRules.additional_policies?.cost_optimization?.map((policy, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 mt-2">•</span>
                      <textarea
                        value={policy}
                        onChange={(e) => handlePolicyChange('cost_optimization', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        rows={3}
                        placeholder="Enter cost optimization policy..."
                      />
                      <button
                        onClick={() => removePolicy('cost_optimization', index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800 text-sm mt-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addPolicy('cost_optimization')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Policy
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  💡 <strong>Tips:</strong> Focus on balancing cost reduction with service quality. Examples: "Monitor overtime costs and minimize excessive hours", 
                  "Balance staff costs with service quality", "Use performance data to optimize scheduling"
                </p>
              </div>
            </div>
            
            {/* Compliance Requirements */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Compliance Requirements</h3>
              <div className="space-y-3">
                {businessRules.additional_policies?.compliance_requirements?.map((policy, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 mt-2">•</span>
                      <textarea
                        value={policy}
                        onChange={(e) => handlePolicyChange('compliance_requirements', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        rows={3}
                        placeholder="Enter compliance requirement..."
                      />
                      <button
                        onClick={() => removePolicy('compliance_requirements', index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800 text-sm mt-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addPolicy('compliance_requirements')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Requirement
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  💡 <strong>Tips:</strong> Focus on legal requirements and safety standards. Examples: "Follow local labor laws and regulations", 
                  "Ensure proper break and rest periods", "Maintain accurate time and attendance records"
                </p>
              </div>
            </div>

            {/* Custom Policies */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-gray-900 mb-4">Custom Policies</h3>
              
              {/* Add New Policy */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Add New Custom Policy
                </label>
                <textarea
                  value={newCustomPolicy}
                  onChange={(e) => setNewCustomPolicy(e.target.value)}
                  placeholder="Enter a new custom policy that's specific to your business operations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  rows={3}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addCustomPolicy()}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 <strong>Tips:</strong> Be specific about your business needs. Examples: "Prioritize staff with food safety certifications", 
                  "Maintain gender balance in kitchen staff", "Rotate closing duties among senior staff"
                </p>
                <div className="mt-3">
                  <Button
                    onClick={addCustomPolicy}
                    disabled={!newCustomPolicy.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Policy
                  </Button>
                </div>
              </div>

              {/* Existing Custom Policies */}
              {businessRules.additional_policies?.custom_policies && businessRules.additional_policies.custom_policies.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm">Existing Custom Policies:</h4>
                  {businessRules.additional_policies.custom_policies.map((policy, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-white rounded border">
                      <textarea
                        value={policy}
                        onChange={(e) => handleCustomPolicyChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                        rows={2}
                        placeholder="Edit your custom policy..."
                      />
                      <button
                        onClick={() => removeCustomPolicy(index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800 text-sm mt-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 italic">No custom policies added yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Add policies that are unique to your business operations</p>
                </div>
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
            <Button 
              onClick={async () => {
                if (!organizationId) return;
                try {
                  console.log('🧪 Testing data retrieval...');
                  const rules = await DatabaseService.getBusinessRules(organizationId);
                  console.log('📊 Retrieved business rules:', rules);
                  alert(`Data retrieved successfully! Check console for details.\n\nAdditional Policies: ${JSON.stringify(rules?.additional_policies, null, 2)}`);
                } catch (error) {
                  console.error('❌ Test failed:', error);
                  alert(`Test failed: ${error}`);
                }
              }}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              🧪 Test Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
