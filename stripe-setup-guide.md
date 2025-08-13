# 🚀 Stripe Integration Setup Guide

This guide will walk you through setting up Stripe payments for your restaurant AI staffing application.

## 📋 Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Supabase Database**: Ensure your database schema is applied
3. **Environment Variables**: Configure the required environment variables

## 🔧 Step 1: Stripe Dashboard Setup

### 1.1 Get Your API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
4. Make sure you're in **Test mode** for development

### 1.2 Create Products and Prices
1. Go to **Products** in your Stripe dashboard
2. Create three products:

#### Starter Plan
- **Name**: Starter
- **Price**: $29.00/month
- **Billing**: Recurring, Monthly
- **Copy the Price ID** (starts with `price_`)

#### Professional Plan  
- **Name**: Professional
- **Price**: $79.00/month
- **Billing**: Recurring, Monthly
- **Copy the Price ID** (starts with `price_`)

#### Enterprise Plan
- **Name**: Enterprise  
- **Price**: $199.00/month
- **Billing**: Recurring, Monthly
- **Copy the Price ID** (starts with `price_`)

### 1.3 Set Up Webhooks
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/api/stripe/webhooks`
4. **Events to send**: Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`
5. **Copy the Webhook Secret** (starts with `whsec_`)

## 🔑 Step 2: Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price IDs
STRIPE_STARTER_MONTHLY_PRICE_ID=price_starter_monthly_here
STRIPE_STARTER_YEARLY_PRICE_ID=price_starter_yearly_here
STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID=price_professional_monthly_here
STRIPE_PROFESSIONAL_YEARLY_PRICE_ID=price_professional_yearly_here
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_enterprise_monthly_here
STRIPE_ENTERPRISE_YEARLY_PRICE_ID=price_enterprise_yearly_here

# Stripe URLs (for production)
STRIPE_SUCCESS_URL=https://yourdomain.com/dashboard/billing?success=true
STRIPE_CANCEL_URL=https://yourdomain.com/pricing?canceled=true
STRIPE_BILLING_PORTAL_RETURN_URL=https://yourdomain.com/dashboard/billing
```

## 🗄️ Step 3: Database Schema

Make sure you've applied the subscription schema to your Supabase database:

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-subscription-schema.sql`
4. Run the SQL script

## 🧪 Step 4: Test the Integration

### 4.1 Test Checkout Flow
1. Visit `/pricing` page
2. Click "Choose Plan" on any plan
3. You should be redirected to Stripe checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete the checkout
6. Verify you're redirected back to billing dashboard

### 4.2 Test Webhooks (Local Development)
For local development, you'll need to use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

## 🔍 Step 5: Verify Everything Works

### 5.1 Check Database
1. Go to Supabase → **Table Editor**
2. Verify these tables exist:
   - `subscription_plans`
   - `subscriptions`
   - `billing_history`
   - `usage_tracking`

### 5.2 Check Billing Dashboard
1. Visit `/dashboard/billing`
2. Verify subscription details are displayed
3. Check usage metrics are tracking

### 5.3 Monitor Logs
1. Check your application logs for Stripe events
2. Verify webhook signatures are being validated
3. Ensure subscription data is being saved

## 🚨 Troubleshooting

### Common Issues:

#### 1. "Invalid Stripe signature" error
- Check your `STRIPE_WEBHOOK_SECRET` is correct
- Ensure webhook endpoint URL matches exactly

#### 2. "Price not found" error
- Verify all price IDs are correct in environment variables
- Check prices exist in Stripe dashboard

#### 3. Webhooks not working locally
- Use Stripe CLI to forward webhooks
- Check your webhook endpoint is accessible

#### 4. Database errors
- Ensure subscription schema is applied
- Check RLS policies are correct
- Verify table permissions

## 🎯 Next Steps

Once Stripe is working:

1. **Customize Plans**: Modify pricing and features in `supabase-subscription-schema.sql`
2. **Add Analytics**: Track conversion rates and revenue
3. **Email Notifications**: Send welcome emails and billing reminders
4. **Dunning Management**: Handle failed payments automatically
5. **Trial Periods**: Add free trial functionality

## 📞 Support

If you encounter issues:

1. Check Stripe dashboard for error logs
2. Verify webhook delivery in Stripe dashboard
3. Check application console for error messages
4. Ensure all environment variables are set correctly

---

**Happy monetizing! 🎉**
