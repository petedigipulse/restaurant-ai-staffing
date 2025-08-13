'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { SubscriptionService, type OrganizationSubscription, type UsageMetrics } from '@/lib/services/subscription';
import { DatabaseService } from '@/lib/services/database';

const BillingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<OrganizationSubscription | null>(null);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for success/cancel messages from Stripe
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const plan = searchParams.get('plan');
  const dev = searchParams.get('dev');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    loadBillingData();
  }, [status, router]);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Debug: Check what's in localStorage
      const userEmail = localStorage.getItem('userEmail');
      console.log('🔍 Debug - userEmail from localStorage:', userEmail);
      console.log('🔍 Debug - session data:', session);

      // Get organization ID from the database
      const organizationId = await DatabaseService.getCurrentUserOrganizationId();
      console.log('🔍 Debug - organizationId from database:', organizationId);
      
      if (!organizationId) {
        throw new Error('No organization found for current user');
      }
      
      // Load subscription and usage data
      const [subData, usageData] = await Promise.all([
        SubscriptionService.getOrganizationSubscription(organizationId),
        SubscriptionService.getUsageMetrics(organizationId)
      ]);

      setSubscription(subData);
      setUsageMetrics(usageData);
    } catch (err) {
      console.error('Error loading billing data:', err);
      setError('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleManageBilling = async () => {
    // This would integrate with Stripe billing portal
    alert('Stripe billing portal integration coming soon!');
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    if (confirm('Are you sure you want to cancel your subscription? You\'ll continue to have access until the end of your current billing period.')) {
      try {
        await SubscriptionService.cancelSubscriptionAtPeriodEnd(subscription.id);
        await loadBillingData(); // Refresh data
        alert('Subscription canceled successfully. You\'ll continue to have access until the end of your current period.');
      } catch (err) {
        console.error('Error canceling subscription:', err);
        alert('Failed to cancel subscription. Please try again.');
      }
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) return;
    
    try {
      await SubscriptionService.reactivateSubscription(subscription.id);
      await loadBillingData(); // Refresh data
      alert('Subscription reactivated successfully!');
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      alert('Failed to reactivate subscription. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Billing</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadBillingData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription, view usage, and handle billing</p>
        </div>

        {/* Success/Cancel Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  {plan ? `Successfully subscribed to ${plan} plan!` : 'Subscription successful!'}
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Welcome to your new plan. You now have access to all the features included in your subscription.
                </p>
              </div>
            </div>
          </div>
        )}

        {canceled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Subscription canceled</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your subscription was not completed. You can try again anytime.
                </p>
              </div>
            </div>
          </div>
        )}

        {dev && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Development Mode</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Stripe is not configured yet. This is a development preview of the billing system.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Subscription */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Current Subscription</h2>
                <div className="flex space-x-2">
                  {subscription ? (
                    <>
                      <button
                        onClick={handleManageBilling}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </button>
                      {subscription.cancel_at_period_end ? (
                        <button
                          onClick={handleReactivateSubscription}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={handleCancelSubscription}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleUpgrade}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </button>
                  )}
                </div>
              </div>

              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{subscription.plan.name} Plan</h3>
                        <p className="text-sm text-gray-500">
                          ${(subscription.plan.price_monthly / 100).toFixed(2)}/month
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {subscription.status === 'active' ? 'Active' : subscription.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">Next Billing</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {subscription.current_period_end 
                          ? new Date(subscription.current_period_end).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">Staff Limit</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {subscription.plan.max_staff === -1 ? 'Unlimited' : subscription.plan.max_staff}
                      </p>
                    </div>
                  </div>

                  {subscription.cancel_at_period_end && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800">Subscription Ending</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your subscription will end on {subscription.current_period_end 
                              ? new Date(subscription.current_period_end).toLocaleDateString()
                              : 'the end of your billing period'
                            }. You can reactivate anytime.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-500 mb-4">
                    You're currently on the free tier. Upgrade to unlock more features and staff capacity.
                  </p>
                  <button
                    onClick={handleUpgrade}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    View Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Usage & Quick Actions */}
          <div className="space-y-6">
            {/* Usage Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
              {usageMetrics ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Staff Members</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {usageMetrics.staff_count}
                      {subscription && (
                        <span className="text-sm text-gray-500 ml-1">
                          /{subscription.plan.max_staff === -1 ? '∞' : subscription.plan.max_staff}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Schedules Generated</span>
                    <span className="text-lg font-semibold text-gray-900">{usageMetrics.ai_schedules_generated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Calls</span>
                    <span className="text-lg font-semibold text-gray-900">{usageMetrics.api_calls}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No usage data available</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleUpgrade}
                  className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <span>Upgrade Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleManageBilling}
                  className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span>Billing Settings</span>
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.open('/pricing', '_blank')}
                  className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span>View All Plans</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Have questions about billing or need to change your plan?
              </p>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
