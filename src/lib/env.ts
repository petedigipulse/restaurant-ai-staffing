import { z } from 'zod';

const envSchema = z.object({
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  
  // OpenAI
  OPENAI_API_KEY: z.string(),
  
  // Weather API
  WEATHER_API_KEY: z.string().optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  
  // Stripe Price IDs (optional for development)
  STRIPE_STARTER_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_STARTER_YEARLY_PRICE_ID: z.string().optional(),
  STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_PROFESSIONAL_YEARLY_PRICE_ID: z.string().optional(),
  STRIPE_ENTERPRISE_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_ENTERPRISE_YEARLY_PRICE_ID: z.string().optional(),
  
  // Stripe URLs (optional for development)
  STRIPE_SUCCESS_URL: z.string().url().optional(),
  STRIPE_CANCEL_URL: z.string().url().optional(),
  STRIPE_BILLING_PORTAL_RETURN_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);


