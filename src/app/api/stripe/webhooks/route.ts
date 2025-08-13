import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe';
import { SubscriptionService } from '@/lib/services/subscription';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event;
    try {
      event = StripeService.verifyWebhookSignature(body, signature);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log('🆕 Handling subscription created:', subscription.id);
    
    // Extract metadata
    const organizationId = subscription.metadata?.organization_id;
    const planSlug = subscription.metadata?.plan_slug;
    
    if (!organizationId || !planSlug) {
      console.warn('⚠️ Missing metadata for subscription:', subscription.id);
      return;
    }

    // Get plan ID from slug
    const plans = await SubscriptionService.getSubscriptionPlans();
    const plan = plans.find(p => p.slug === planSlug);
    
    if (!plan) {
      console.error('❌ Plan not found for slug:', planSlug);
      return;
    }

    // Create subscription in our database
    await SubscriptionService.createSubscription({
      organizationId,
      planId: plan.id,
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      metadata: {
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      },
    });

    console.log('✅ Subscription created in database:', subscription.id);
  } catch (error) {
    console.error('❌ Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log('🔄 Handling subscription updated:', subscription.id);
    
    // Update subscription in our database
    await SubscriptionService.updateSubscriptionFromStripe(subscription.id, {
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    });

    console.log('✅ Subscription updated in database:', subscription.id);
  } catch (error) {
    console.error('❌ Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log('🗑️ Handling subscription deleted:', subscription.id);
    
    // Update subscription status in our database
    await SubscriptionService.updateSubscriptionFromStripe(subscription.id, {
      status: 'canceled',
    });

    console.log('✅ Subscription marked as canceled in database:', subscription.id);
  } catch (error) {
    console.error('❌ Error handling subscription deleted:', error);
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    console.log('💳 Handling payment succeeded:', invoice.id);
    
    // You can add additional logic here like:
    // - Sending confirmation emails
    // - Updating usage limits
    // - Logging successful payments
    
    console.log('✅ Payment succeeded handled:', invoice.id);
  } catch (error) {
    console.error('❌ Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    console.log('❌ Handling payment failed:', invoice.id);
    
    // You can add additional logic here like:
    // - Sending failure notifications
    // - Updating subscription status
    // - Triggering dunning management
    
    console.log('✅ Payment failed handled:', invoice.id);
  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
  }
}

async function handleTrialWillEnd(subscription: any) {
  try {
    console.log('⏰ Handling trial will end:', subscription.id);
    
    // You can add additional logic here like:
    // - Sending trial ending notifications
    // - Updating subscription status
    // - Triggering upgrade prompts
    
    console.log('✅ Trial ending handled:', subscription.id);
  } catch (error) {
    console.error('❌ Error handling trial will end:', error);
  }
}
