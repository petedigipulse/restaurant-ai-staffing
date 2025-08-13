import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { StripeService, STRIPE_PLANS } from '@/lib/stripe';
import { SubscriptionService } from '@/lib/services/subscription';
import { DatabaseService } from '@/lib/services/database';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planSlug, billingCycle } = await request.json();

    if (!planSlug || !billingCycle) {
      return NextResponse.json({ 
        error: 'Missing required fields: planSlug and billingCycle' 
      }, { status: 400 });
    }

    console.log('🚀 Creating checkout session for:', { planSlug, billingCycle, user: session.user.email });

    // Get organization ID for the user
    const organizationId = await DatabaseService.getCurrentUserOrganizationId();
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get subscription plan details
    const plans = await SubscriptionService.getSubscriptionPlans();
    const selectedPlan = plans.find(plan => plan.slug === planSlug);
    
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    try {
      // Check if organization already has a Stripe customer
      const existingSubscription = await SubscriptionService.getOrganizationSubscription(organizationId);
      
      if (existingSubscription?.stripe_customer_id) {
        stripeCustomerId = existingSubscription.stripe_customer_id;
        console.log('✅ Using existing Stripe customer:', stripeCustomerId);
      } else {
        // Create new Stripe customer
        const organization = await DatabaseService.getOrganizationById(organizationId);
        if (!organization) {
          return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const customer = await StripeService.createCustomer(
          session.user.email,
          organization.name || 'Restaurant Organization',
          {
            organization_id: organizationId,
            user_email: session.user.email,
          }
        );
        
        stripeCustomerId = customer.id;
        console.log('✅ Created new Stripe customer:', stripeCustomerId);
      }
    } catch (error) {
      console.error('❌ Error with Stripe customer:', error);
      return NextResponse.json({ 
        error: 'Failed to create Stripe customer' 
      }, { status: 500 });
    }

    // Get the appropriate Stripe price ID
    const priceId = billingCycle === 'yearly' 
      ? STRIPE_PLANS[planSlug as keyof typeof STRIPE_PLANS]?.yearly
      : STRIPE_PLANS[planSlug as keyof typeof STRIPE_PLANS]?.monthly;

    if (!priceId || priceId.includes('placeholder')) {
      console.warn('⚠️ Using placeholder Stripe price ID for development');
      // For development, create a mock checkout session
      return NextResponse.json({
        success: true,
        checkoutUrl: `/dashboard/billing?plan=${planSlug}&billing=${billingCycle}&dev=true`,
        message: 'Development mode - Stripe not configured'
      });
    }

    // Create Stripe checkout session
    const checkoutSession = await StripeService.createCheckoutSession({
      customerId: stripeCustomerId,
      priceId,
      successUrl: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true&plan=${planSlug}`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        organization_id: organizationId,
        plan_slug: planSlug,
        billing_cycle: billingCycle,
        user_email: session.user.email,
      },
    });

    console.log('✅ Stripe checkout session created:', checkoutSession.id);

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });

  } catch (error) {
    console.error('❌ Stripe checkout error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
