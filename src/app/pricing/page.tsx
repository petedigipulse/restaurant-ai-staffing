'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Zap, Shield, Users, BarChart3, Clock, Headphones } from 'lucide-react';
import Link from 'next/link';

interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  max_staff: number;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  description: string;
}

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, use mock data until we connect to the database
    const mockPlans: PricingPlan[] = [
      {
        id: '1',
        name: 'Starter',
        slug: 'starter',
        price_monthly: 2900,
        price_yearly: 29000,
        max_staff: 10,
        features: [
          'Basic AI Scheduling',
          'Staff Management',
          'CSV Import/Export',
          'Email Support',
          'Basic Analytics',
          'Mobile Responsive'
        ],
        icon: <Zap className="w-6 h-6" />,
        description: 'Perfect for small restaurants getting started with AI-powered scheduling'
      },
      {
        id: '2',
        name: 'Professional',
        slug: 'professional',
        price_monthly: 7900,
        price_yearly: 79000,
        max_staff: 25,
        features: [
          'Advanced AI Optimization',
          'Weather Integration',
          'Performance Analytics',
          'Priority Support',
          'Custom Workflows',
          'API Access',
          'Advanced Reporting',
          'Team Collaboration'
        ],
        popular: true,
        icon: <Star className="w-6 h-6" />,
        description: 'Ideal for growing restaurants that need advanced optimization and insights'
      },
      {
        id: '3',
        name: 'Enterprise',
        slug: 'enterprise',
        price_monthly: 19900,
        price_yearly: 199000,
        max_staff: -1, // Unlimited
        features: [
          'Unlimited Staff',
          'Custom Integrations',
          'White-label Options',
          'Dedicated Support',
          'Custom Features',
          'Advanced Security',
          'SLA Guarantees',
          'Onboarding Support'
        ],
        icon: <Shield className="w-6 h-6" />,
        description: 'For large restaurant chains and enterprises requiring custom solutions'
      }
    ];

    setPlans(mockPlans);
    setLoading(false);
  }, []);

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0)}`;
  };

  const getYearlyDiscount = (monthly: number, yearly: number) => {
    const monthlyTotal = monthly * 12;
    const discount = ((monthlyTotal - yearly) / monthlyTotal) * 100;
    return discount > 0 ? Math.round(discount) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Transparent
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your restaurant. Start free, scale as you grow. 
              No hidden fees, no surprises.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
                {billingCycle === 'yearly' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Save up to 20%
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular
                  ? 'ring-2 ring-blue-500 bg-white'
                  : 'bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly)}
                      </span>
                      <span className="text-lg text-gray-500 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && getYearlyDiscount(plan.price_monthly, plan.price_yearly) > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        Save {getYearlyDiscount(plan.price_monthly, plan.price_yearly)}% with yearly billing
                      </p>
                    )}
                  </div>

                  {/* Staff Limit */}
                  <div className="mb-6">
                    <span className="text-sm text-gray-500">
                      Up to {plan.max_staff === -1 ? 'unlimited' : plan.max_staff} staff members
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Link
                    href={`/checkout?plan=${plan.slug}&billing=${billingCycle}`}
                    className={`inline-flex items-center justify-center w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.popular ? 'Get Started' : 'Choose Plan'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Everything you need to know about our pricing and plans
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I change my plan at any time?
            </h3>
            <p className="text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
              and we'll prorate any billing adjustments.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-gray-600">
              We offer a 14-day free trial on all paid plans. No credit card required to start. 
              You can cancel anytime during the trial period.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What happens if I exceed my staff limit?
            </h3>
            <p className="text-gray-600">
              You'll receive a notification when you're approaching your limit. You can either 
              upgrade your plan or contact us to discuss custom solutions.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Do you offer custom pricing for large organizations?
            </h3>
            <p className="text-gray-600">
              Absolutely! For organizations with 100+ staff members or special requirements, 
              we offer custom enterprise pricing. Contact our sales team for a personalized quote.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of restaurants already using AI-powered scheduling to save time and money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
