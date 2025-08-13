# Database Fixes for Restaurant AI Staffing System

## 🚨 **What This Fixes:**

1. **Historical Data Not Saving** - RLS policies blocking data insertion
2. **Performance Metrics Table Empty** - Staff data not properly linked
3. **Authentication Issues** - Users not linked to organizations

## 📋 **Steps to Apply:**

### **Step 1: Run the SQL in Supabase**

1. **Go to your Supabase dashboard**
2. **Click "SQL Editor"** in the left sidebar
3. **Copy and paste the entire contents** of `database-fixes.sql`
4. **Click "Run"** to execute all the fixes

### **Step 2: Test the Authentication Flow**

1. **Start your app:** `npm run dev`
2. **Go to `/login`** and sign in with any email/password
3. **You should be redirected to the dashboard**

### **Step 3: Test the Onboarding Flow**

1. **Go to the onboarding wizard**
2. **Complete the restaurant setup step**
3. **Check if historical data saves properly**
4. **Verify staff data is linked correctly**

## 🔍 **What the SQL Does:**

- **Creates `users` table** to store authenticated users
- **Links organizations to users** via `user_id` foreign key
- **Fixes all RLS policies** to work with authenticated users
- **Creates helper functions** for user-organization management

## ⚠️ **Important Notes:**

- **Backup your database** before running these changes
- **The SQL will create a default user** for existing organizations
- **All data will be properly linked** to authenticated users after the fix

## 🎯 **Expected Results:**

- ✅ **Historical data saves** during onboarding
- ✅ **Performance metrics populate** correctly
- ✅ **Authentication works** end-to-end
- ✅ **All RLS policies work** properly

## 🆘 **If You Have Issues:**

1. **Check the Supabase logs** for any SQL errors
2. **Verify the tables were created** correctly
3. **Ensure RLS is enabled** on all tables
4. **Check that policies were created** successfully

---

**Ready to run the SQL fixes? Let me know if you need help!**
