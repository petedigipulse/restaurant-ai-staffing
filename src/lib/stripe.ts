import Stripe from 'stripe';

// Initialize Stripe with environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
});

// Stripe configuration constants
export const STRIPE_CONFIG = {
  // Test mode configuration
  testMode: process.env.NODE_ENV === 'development',
  
  // Webhook endpoint secret
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder',
  
  // Success and cancel URLs
  successUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/dashboard/billing?success=true',
  cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/dashboard/billing?canceled=true',
  
  // Billing portal return URL
  billingPortalReturnUrl: process.env.STRIPE_BILLING_PORTAL_RETURN_URL || 'http://localhost:3000/dashboard/billing',
};

// Subscription plan IDs (these will be created in Stripe)
export const STRIPE_PLANS = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || 'price_starter_monthly_placeholder',
    yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || 'price_starter_yearly_placeholder',
  },
  professional: {
    monthly: process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID || 'price_professional_monthly_placeholder',
    yearly: process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID || 'price_professional_yearly_placeholder',
  },
  enterprise: {
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly_placeholder',
    yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID || 'price_enterprise_yearly_placeholder',
  },
};

// Stripe utility functions
export class StripeService {
  /**
   * Create a Stripe customer
   */
  static async createCustomer(email: string, name: string, metadata?: Record<string, string>) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata,
      });
      
      console.log('✅ Stripe customer created:', customer.id);
      return customer;
    } catch (error) {
      console.error('❌ Error creating Stripe customer:', error);
      throw error;
    }
  }

  /**
   * Create a checkout session for subscription
   */
  static async createCheckoutSession({
    customerId,
    priceId,
    successUrl,
    cancelUrl,
    metadata,
  }: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
      });
      
      console.log('✅ Stripe checkout session created:', session.id);
      return session;
    } catch (error) {
      console.error('❌ Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Create a billing portal session
   */
  static async createBillingPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      
      console.log('✅ Stripe billing portal session created:', session.id);
      return session;
    } catch (error) {
      console.error('❌ Error creating billing portal session:', error);
      throw error;
    }
  }

  /**
   * Retrieve a subscription
   */
  static async getSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      console.log('✅ Stripe subscription retrieved:', subscription.id);
      return subscription;
    } catch (error) {
      console.error('❌ Error retrieving subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription at period end
   */
  static async cancelSubscriptionAtPeriodEnd(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      
      console.log('✅ Subscription canceled at period end:', subscription.id);
      return subscription;
    } catch (error) {
      console.error('❌ Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Reactivate a subscription
   */
  static async reactivateSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
      
      console.log('✅ Subscription reactivated:', subscription.id);
      return subscription;
    } catch (error) {
      console.error('❌ Error reactivating subscription:', error);
      throw error;
    }
  }

  /**
   * Update subscription quantity (for usage-based billing)
   */
  static async updateSubscriptionQuantity(subscriptionId: string, quantity: number) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0]?.id;
      
      if (!itemId) {
        throw new Error('No subscription item found');
      }
      
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: itemId,
            quantity,
          },
        ],
      });
      
      console.log('✅ Subscription quantity updated:', updatedSubscription.id);
      return updatedSubscription;
    } catch (error) {
      console.error('❌ Error updating subscription quantity:', error);
      throw error;
    }
  }

  /**
   * Create an invoice for additional charges
   */
  static async createInvoice(customerId: string, amount: number, description: string) {
    try {
      const invoice = await stripe.invoices.create({
        customer: customerId,
        auto_advance: false,
        collection_method: 'charge_automatically',
        custom_fields: [
          {
            name: 'Description',
            value: description,
          },
        ],
      });

      await stripe.invoiceItems.create({
        customer: customerId,
        invoice: invoice.id,
        amount,
        currency: 'usd',
        description,
      });

      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
      const paidInvoice = await stripe.invoices.pay(finalizedInvoice.id);
      
      console.log('✅ Invoice created and paid:', paidInvoice.id);
      return paidInvoice;
    } catch (error) {
      console.error('❌ Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        STRIPE_CONFIG.webhookSecret
      );
      
      console.log('✅ Webhook signature verified:', event.type);
      return event;
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      throw error;
    }
  }
}

// Export types for use in other files
export type StripeCustomer = Stripe.Customer;
export type StripeSubscription = Stripe.Subscription;
export type StripeCheckoutSession = Stripe.Checkout.Session;
export type StripeBillingPortalSession = Stripe.BillingPortal.Session;
export type StripeInvoice = Stripe.Invoice;
export type StripeEvent = Stripe.Event;
