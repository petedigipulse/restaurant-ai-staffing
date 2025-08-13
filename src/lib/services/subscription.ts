import { supabase } from '../supabase';
import { StripeService } from '../stripe';
import type { StripeCustomer, StripeSubscription } from '../stripe';

// Types for subscription management
export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  max_staff: number;
  features: string[];
  is_active: boolean;
}

export interface OrganizationSubscription {
  id: string;
  organization_id: string;
  plan_id: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  plan: SubscriptionPlan;
}

export interface UsageMetrics {
  staff_count: number;
  ai_schedules_generated: number;
  api_calls: number;
  storage_used_mb: number;
}

export class SubscriptionService {
  /**
   * Get all available subscription plans
   */
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) {
        console.error('❌ Error fetching subscription plans:', error);
        throw error;
      }

      console.log('✅ Subscription plans fetched:', data?.length);
      return data || [];
    } catch (error) {
      console.error('❌ SubscriptionService.getSubscriptionPlans error:', error);
      throw error;
    }
  }

  /**
   * Get organization's current subscription
   */
  static async getOrganizationSubscription(organizationId: string): Promise<OrganizationSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error fetching organization subscription:', error);
        throw error;
      }

      console.log('✅ Organization subscription fetched:', data?.id || 'none');
      return data;
    } catch (error) {
      console.error('❌ SubscriptionService.getOrganizationSubscription error:', error);
      throw error;
    }
  }

  /**
   * Create a new subscription
   */
  static async createSubscription({
    organizationId,
    planId,
    stripeCustomerId,
    stripeSubscriptionId,
    metadata = {},
  }: {
    organizationId: string;
    planId: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    metadata?: Record<string, any>;
  }): Promise<OrganizationSubscription> {
    try {
      // Get plan details
      const plan = await this.getPlanById(planId);
      if (!plan) {
        throw new Error(`Plan not found: ${planId}`);
      }

      // Create subscription record
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          organization_id: organizationId,
          plan_id: planId,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          ...metadata,
        })
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .single();

      if (error) {
        console.error('❌ Error creating subscription:', error);
        throw error;
      }

      // Update organization with subscription reference
      await supabase
        .from('organizations')
        .update({ current_subscription_id: data.id })
        .eq('id', organizationId);

      console.log('✅ Subscription created:', data.id);
      return data;
    } catch (error) {
      console.error('❌ SubscriptionService.createSubscription error:', error);
      throw error;
    }
  }

  /**
   * Update subscription status from Stripe webhook
   */
  static async updateSubscriptionFromStripe(
    stripeSubscriptionId: string,
    updates: Partial<OrganizationSubscription>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('stripe_subscription_id', stripeSubscriptionId);

      if (error) {
        console.error('❌ Error updating subscription from Stripe:', error);
        throw error;
      }

      console.log('✅ Subscription updated from Stripe:', stripeSubscriptionId);
    } catch (error) {
      console.error('❌ SubscriptionService.updateSubscriptionFromStripe error:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription at period end
   */
  static async cancelSubscriptionAtPeriodEnd(subscriptionId: string): Promise<void> {
    try {
      const subscription = await this.getSubscriptionById(subscriptionId);
      if (!subscription) {
        throw new Error(`Subscription not found: ${subscriptionId}`);
      }

      // Cancel in Stripe if we have a Stripe subscription ID
      if (subscription.stripe_subscription_id) {
        await StripeService.cancelSubscriptionAtPeriodEnd(subscription.stripe_subscription_id);
      }

      // Update local subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ cancel_at_period_end: true })
        .eq('id', subscriptionId);

      if (error) {
        console.error('❌ Error canceling subscription:', error);
        throw error;
      }

      console.log('✅ Subscription canceled at period end:', subscriptionId);
    } catch (error) {
      console.error('❌ SubscriptionService.cancelSubscriptionAtPeriodEnd error:', error);
      throw error;
    }
  }

  /**
   * Reactivate subscription
   */
  static async reactivateSubscription(subscriptionId: string): Promise<void> {
    try {
      const subscription = await this.getSubscriptionById(subscriptionId);
      if (!subscription) {
        throw new Error(`Subscription not found: ${subscriptionId}`);
      }

      // Reactivate in Stripe if we have a Stripe subscription ID
      if (subscription.stripe_subscription_id) {
        await StripeService.reactivateSubscription(subscription.stripe_subscription_id);
      }

      // Update local subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ cancel_at_period_end: false })
        .eq('id', subscriptionId);

      if (error) {
        console.error('❌ Error reactivating subscription:', error);
        throw error;
      }

      console.log('✅ Subscription reactivated:', subscriptionId);
    } catch (error) {
      console.error('❌ SubscriptionService.reactivateSubscription error:', error);
      throw error;
    }
  }

  /**
   * Check if organization can add more staff
   */
  static async canAddStaff(organizationId: string): Promise<boolean> {
    try {
      const subscription = await this.getOrganizationSubscription(organizationId);
      
      // If no subscription, limit to 5 staff (free tier)
      if (!subscription) {
        const staffCount = await this.getStaffCount(organizationId);
        return staffCount < 5;
      }

      // If unlimited (-1), always allow
      if (subscription.plan.max_staff === -1) {
        return true;
      }

      const staffCount = await this.getStaffCount(organizationId);
      return staffCount < subscription.plan.max_staff;
    } catch (error) {
      console.error('❌ SubscriptionService.canAddStaff error:', error);
      return false; // Fail safe - don't allow if we can't verify
    }
  }

  /**
   * Get staff count for organization
   */
  static async getStaffCount(organizationId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('staff_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId);

      if (error) {
        console.error('❌ Error getting staff count:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ SubscriptionService.getStaffCount error:', error);
      return 0;
    }
  }

  /**
   * Track usage metrics
   */
  static async trackUsage(
    organizationId: string,
    metricName: string,
    value: number = 1
  ): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('usage_tracking')
        .upsert({
          organization_id: organizationId,
          metric_name: metricName,
          metric_value: value,
          tracking_date: today,
        }, {
          onConflict: 'organization_id,metric_name,tracking_date'
        });

      if (error) {
        console.error('❌ Error tracking usage:', error);
        throw error;
      }

      console.log('✅ Usage tracked:', metricName, value);
    } catch (error) {
      console.error('❌ SubscriptionService.trackUsage error:', error);
      // Don't throw - usage tracking shouldn't break main functionality
    }
  }

  /**
   * Get usage metrics for organization
   */
  static async getUsageMetrics(organizationId: string): Promise<UsageMetrics> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('metric_name, metric_value')
        .eq('organization_id', organizationId)
        .eq('tracking_date', today);

      if (error) {
        console.error('❌ Error getting usage metrics:', error);
        throw error;
      }

      const metrics: UsageMetrics = {
        staff_count: await this.getStaffCount(organizationId),
        ai_schedules_generated: 0,
        api_calls: 0,
        storage_used_mb: 0,
      };

      // Parse metrics from database
      data?.forEach(row => {
        switch (row.metric_name) {
          case 'ai_schedules_generated':
            metrics.ai_schedules_generated = row.metric_value;
            break;
          case 'api_calls':
            metrics.api_calls = row.metric_value;
            break;
          case 'storage_used_mb':
            metrics.storage_used_mb = row.metric_value;
            break;
        }
      });

      console.log('✅ Usage metrics fetched:', metrics);
      return metrics;
    } catch (error) {
      console.error('❌ SubscriptionService.getUsageMetrics error:', error);
      return {
        staff_count: 0,
        ai_schedules_generated: 0,
        api_calls: 0,
        storage_used_mb: 0,
      };
    }
  }

  /**
   * Get plan by ID
   */
  static async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) {
        console.error('❌ Error fetching plan:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ SubscriptionService.getPlanById error:', error);
      return null;
    }
  }

  /**
   * Get subscription by ID
   */
  static async getSubscriptionById(subscriptionId: string): Promise<OrganizationSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('id', subscriptionId)
        .single();

      if (error) {
        console.error('❌ Error fetching subscription:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ SubscriptionService.getSubscriptionById error:', error);
      return null;
    }
  }

  /**
   * Upgrade or downgrade subscription
   */
  static async changeSubscription(
    organizationId: string,
    newPlanId: string
  ): Promise<OrganizationSubscription> {
    try {
      // Get current subscription
      const currentSubscription = await this.getOrganizationSubscription(organizationId);
      
      if (currentSubscription) {
        // Cancel current subscription at period end
        await this.cancelSubscriptionAtPeriodEnd(currentSubscription.id);
      }

      // Create new subscription
      const newSubscription = await this.createSubscription({
        organizationId,
        planId: newPlanId,
      });

      console.log('✅ Subscription changed:', newSubscription.id);
      return newSubscription;
    } catch (error) {
      console.error('❌ SubscriptionService.changeSubscription error:', error);
      throw error;
    }
  }
}
