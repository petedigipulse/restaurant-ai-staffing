# 🚀 Supabase Setup Guide for Restaurant AI Staffing

## 📋 **Prerequisites**
- GitHub account (for your repository)
- Netlify account (for deployment)
- Basic understanding of databases

## 🗄️ **Step 1: Create Supabase Project**

### 1.1 Go to Supabase
- Visit [supabase.com](https://supabase.com)
- Click "Start your project" or "Sign Up"
- Sign in with GitHub

### 1.2 Create New Project
- Click "New Project"
- Choose your organization
- **Project Name**: `restaurant-ai-staffing`
- **Database Password**: Create a strong password (save this!)
- **Region**: Choose closest to your users (e.g., Australia for NZ)
- Click "Create new project"

### 1.3 Wait for Setup
- Project creation takes 2-3 minutes
- You'll see "Database is ready" when complete

## 🔑 **Step 2: Get API Keys**

### 2.1 Access Project Settings
- In your project dashboard, go to **Settings** → **API**
- Copy these values:
  - **Project URL** (starts with `https://...`)
  - **anon public** key (starts with `eyJ...`)

### 2.2 Update Environment Variables
- In your local project, create `.env.local` file
- Add these variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🗃️ **Step 3: Set Up Database Schema**

### 3.1 Access SQL Editor
- In Supabase dashboard, go to **SQL Editor**
- Click "New query"

### 3.2 Run Schema Script
- Copy the entire content of `supabase-schema.sql`
- Paste into the SQL editor
- Click "Run" to execute

### 3.3 Verify Tables
- Go to **Table Editor**
- You should see these tables:
  - `organizations`
  - `staff_members`
  - `business_rules`
  - `schedules`
  - `performance_metrics`
  - `integrations`

## 🔐 **Step 4: Configure Authentication**

### 4.1 Enable Email Auth
- Go to **Authentication** → **Providers**
- Ensure "Email" is enabled
- Configure any additional providers (Google, etc.)

### 4.2 Set Up Email Templates
- Go to **Authentication** → **Email Templates**
- Customize welcome and confirmation emails
- Test with your email

## 📊 **Step 5: Test Database Connection**

### 5.1 Test Local Connection
```bash
npm run dev
```
- Visit your app
- Check browser console for connection errors
- Verify Supabase connection in Network tab

### 5.2 Test API Endpoints
- Try creating a test organization
- Check if data appears in Supabase dashboard

## 🚀 **Step 6: Deploy to Netlify**

### 6.1 Update Netlify Environment Variables
- Go to your Netlify dashboard
- **Site settings** → **Environment variables**
- Add the same Supabase variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 6.2 Trigger New Deploy
- Push changes to GitHub
- Netlify will auto-deploy with new environment variables

## 🔍 **Step 7: Verify Production Setup**

### 7.1 Test Production App
- Visit your live Netlify site
- Try the onboarding wizard
- Check if data saves to Supabase

### 7.2 Monitor Database
- In Supabase dashboard, check **Table Editor**
- Verify data is being created
- Check **Logs** for any errors

## 🛠️ **Troubleshooting**

### Common Issues:

#### **"Invalid API key" Error**
- Double-check your environment variables
- Ensure no extra spaces or quotes
- Verify you're using the `anon` key, not `service_role`

#### **"Connection refused" Error**
- Check if Supabase project is active
- Verify region selection
- Check firewall settings

#### **"Table doesn't exist" Error**
- Run the schema script again
- Check SQL Editor for any error messages
- Verify table names match exactly

#### **Authentication Issues**
- Check Supabase Auth settings
- Verify email templates are configured
- Check browser console for auth errors

## 📈 **Next Steps**

### **Immediate (Week 1)**
- ✅ Set up Supabase project
- ✅ Configure database schema
- ✅ Test local connection
- ✅ Deploy to production

### **Short Term (Week 2-3)**
- 🔄 Update onboarding wizard to use real database
- 🔄 Replace mock APIs with Supabase calls
- 🔄 Add CSV import functionality
- 🔄 Implement real-time updates

### **Medium Term (Month 2)**
- 🔄 Integrate with Xero (accounting)
- 🔄 Connect to POS systems
- 🔄 Add HR system integration
- 🔄 Implement advanced analytics

### **Long Term (Month 3+)**
- 🔄 AI model training on real data
- 🔄 Predictive analytics
- 🔄 Multi-tenant architecture
- 🔄 Enterprise features

## 🎯 **Success Metrics**

- **Database Connection**: ✅ Working locally and in production
- **Data Persistence**: ✅ Onboarding data saves to database
- **User Authentication**: ✅ Users can sign up and log in
- **Real-time Updates**: ✅ Changes reflect immediately
- **Performance**: ✅ Fast response times (<500ms)

## 📞 **Support Resources**

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord**: [discord.gg/supabase](https://discord.gg/supabase)
- **GitHub Issues**: Your repository issues page
- **Netlify Support**: [netlify.com/support](https://netlify.com/support)

---

**🎉 Congratulations!** You now have a production-ready backend database that can scale with your business needs.

**Need help?** Check the troubleshooting section or reach out with specific error messages.
