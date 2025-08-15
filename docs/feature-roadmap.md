# 🗺️ Feature Roadmap & Issue Tracking

## 📋 **Overview**
This document tracks all features, fixes, and improvements identified during development of the AI Restaurant Staffing application. Items are categorized by priority and status.

---

## 🚨 **High Priority - Data Consistency & User Experience**

### **1. Onboarding Wizard & Business Rules Synchronization**
**Status:** 🔴 **CRITICAL - Needs Immediate Attention**
**Issue:** Data structure mismatch between onboarding wizard and business rules page

**Current Problem:**
- Onboarding wizard uses simple `BusinessRules` interface
- Business Rules page uses advanced structure with `additional_policies`
- Two systems store data differently, causing inconsistencies
- Users may lose data when moving between systems

**Impact:**
- Data inconsistency between onboarding and post-setup
- Confusing user experience
- Potential data loss
- AI may not use complete business rules

**Proposed Solution:**
- **Option 1 (Recommended):** Unify data structures
  - Update `BusinessRulesStep.tsx` to match business rules page
  - Include `staffing_guidelines`, `cost_optimization`, `compliance_requirements`
  - Ensure consistent data flow
- **Option 2:** Implement data mapping layer
  - Create transformation functions between systems
  - More complex but preserves current onboarding flow

**Files to Modify:**
- `src/app/onboarding/components/BusinessRulesStep.tsx`
- `src/app/onboarding/page.tsx` (saveBusinessRulesData function)
- Database schema consistency

**Estimated Effort:** 1-2 days
**Priority:** 🔴 **CRITICAL**

### **4. Onboarding Wizard & Business Rules Synchronization**
**Status:** 🔴 **CRITICAL - Needs Immediate Attention**
**Issue:** Data structures mismatch between onboarding wizard and Business Rules pages

**Current Problem:**
- Onboarding wizard uses different data structures than Business Rules pages
- Data entered in onboarding doesn't appear in Business Rules, and vice versa
- Two separate interfaces for the same business data
- Users cannot edit or update information entered during onboarding

**Impact:**
- Core functionality broken - users can't edit their setup data
- Data inconsistency between different parts of the application
- Poor user experience and confusion
- Potential data loss when trying to update information

**Root Cause Analysis:**
- **Onboarding Wizard:** Uses `OnboardingStaffMember` interface with `firstName`, `lastName`, `hourlyWage`
- **Business Rules:** Uses different interfaces and data structures
- **Database Schema:** Both try to save to same tables but with different field mappings
- **Data Flow:** No unified data transformation layer between the two interfaces

**Proposed Solution:**
- **Phase 1:** Create unified data interfaces that both components can use
- **Phase 2:** Implement data transformation layer to bridge the gap
- **Phase 3:** Update both onboarding and Business Rules to use unified structures
- **Phase 4:** Add bidirectional sync to ensure data consistency

**Files to Modify:**
- `src/app/onboarding/page.tsx` - Update data structures
- `src/app/dashboard/business-rules/*/page.tsx` - Unify interfaces
- `src/lib/services/database.ts` - Add transformation methods
- Create new unified interfaces and types

**Estimated Effort:** 1-2 days
**Priority:** 🔴 **CRITICAL**

### **2. Business Information Page Data Saving**
**Status:** 🔴 **CRITICAL - Needs Immediate Attention**
**Issue:** Business Information page cannot save data due to database schema mismatch

**Current Problem:**
- Page tries to update fields that don't exist in `organizations` table
- Database only has: `id`, `name`, `type`, `timezone`, `operating_hours`, `created_at`, `updated_at`, `owner_id`
- Page tries to update: `address`, `phone`, `email`, `cuisine_type`, `capacity`, `opening_hours`
- Data structure mismatch causes save failures

**Impact:**
- Users cannot update business information
- Data loss when trying to save changes
- Core functionality broken
- Poor user experience

**Proposed Solution:**
- **Option 1 (Recommended):** Store additional data in `operating_hours` JSON field
  - Transform data to fit existing schema
  - Maintain backward compatibility
  - Quick fix for immediate functionality
- **Option 2:** Update database schema to include missing fields
  - Add `address`, `phone`, `email`, `cuisine_type`, `capacity` columns
  - More robust long-term solution
  - Requires database migration

**Files to Modify:**
- `src/app/dashboard/business-rules/restaurant-info/page.tsx`
- Database schema (if Option 2 chosen)

**Estimated Effort:** 0.5-1 day
**Priority:** 🔴 **CRITICAL**

### **3. AI Schedule Generation JSON Truncation**
**Status:** 🔴 **CRITICAL - Needs Immediate Attention**
**Issue:** AI responses are being truncated, causing JSON parsing failures

**Current Problem:**
- AI generates schedule data but response gets cut off
- JSON parsing fails with "Unterminated string in JSON" error
- Schedule generation fails completely
- Users cannot create AI-generated schedules

**Impact:**
- Core AI functionality broken
- Users cannot generate schedules
- Poor user experience
- Potential data loss

**Root Cause Analysis:**
- AI response length limits (OpenAI token limits)
- Response streaming issues
- JSON structure too complex for single response
- Possible API timeout issues

**Proposed Solution:**
- **Option 1 (Immediate):** Implement response chunking and reconstruction
  - Break large responses into smaller chunks
  - Reconstruct complete JSON on client side
  - Handle partial responses gracefully
- **Option 2 (Long-term):** Optimize AI prompt for shorter responses
  - Simplify schedule structure
  - Reduce response complexity
  - Implement progressive loading

**Files to Modify:**
- `src/lib/services/ai.ts`
- `src/app/api/ai/schedule/optimize/route.ts`
- Frontend schedule generation logic

**Estimated Effort:** 1-2 days
**Priority:** 🔴 **CRITICAL**

---

## 🔧 **Medium Priority - Functionality Improvements**

### **2. Historical Data Import Display Issues**
**Status:** 🟡 **RESOLVED - CSV Import Working, Display Fixed**
**Issue:** New CSV imports not displaying in UI despite successful database save

**What Was Fixed:**
- ✅ CSV upload functionality working
- ✅ Data saving to database correctly
- ✅ Authentication issues resolved
- ✅ Duplicate key constraints handled
- ✅ Column mapping issues fixed
- ✅ Import grouping and display working

**Remaining Considerations:**
- Monitor for any new display issues
- Consider adding import validation
- Add success notifications for users

**Status:** ✅ **COMPLETED**

### **3. Staff Management CRUD Operations**
**Status:** 🟡 **MOSTLY COMPLETE - Needs Testing**
**Issue:** Staff editing, updating, and deletion functionality

**What Was Implemented:**
- ✅ Add new staff functionality
- ✅ Edit existing staff members
- ✅ Delete staff members
- ✅ CSV import for staff data
- ✅ Performance score tracking

**Needs Testing:**
- Verify all CRUD operations work correctly
- Test edge cases (deleting staff with schedules, etc.)
- Ensure data consistency

**Status:** 🟡 **NEEDS TESTING**

---

## 📊 **Medium Priority - AI & Analytics Features**

### **4. AI Schedule Generation Optimization**
**Status:** 🟡 **WORKING - Needs Performance Monitoring**
**Issue:** AI schedule generation and staff placement on roster

**Current Status:**
- ✅ AI schedule generation working
- ✅ Staff placement on roster functional
- ✅ Cost calculation working
- ✅ Business rules enforcement working

**Areas for Improvement:**
- Monitor AI response quality
- Optimize prompt engineering
- Add more sophisticated constraint handling
- Performance metrics tracking

**Status:** 🟡 **MONITORING REQUIRED**

### **5. Performance Analytics Dashboard**
**Status:** ✅ **COMPLETED**
**Issue:** A-Team vs B-Team analysis and performance insights

**What Was Implemented:**
- ✅ Performance tier analysis (A, B, C teams)
- ✅ Cost-benefit analysis
- ✅ Station-based performance metrics
- ✅ Team composition optimization

**Status:** ✅ **COMPLETED**

---

## 🎨 **Low Priority - UI/UX Improvements**

### **6. Policy Form Field Sizes**
**Status:** ✅ **COMPLETED**
**Issue:** Policy input fields too small for detailed policies

**What Was Fixed:**
- ✅ Changed single-line inputs to textareas
- ✅ Added 3-row height for better usability
- ✅ Consistent with Break Requirements field
- ✅ Added helpful tips and examples

**Status:** ✅ **COMPLETED**

### **7. Navigation and Layout Consistency**
**Status:** 🟡 **MOSTLY COMPLETE**
**Issue:** Inconsistent navigation and layout across sections

**What Was Implemented:**
- ✅ Business Rules section restructured
- ✅ Navigation updated (Edit Setup → Business Info)
- ✅ Settings dropdown with Billing
- ✅ Consistent card layouts

**Minor Improvements Needed:**
- Ensure consistent spacing across all pages
- Standardize button styles
- Improve mobile responsiveness

**Status:** 🟡 **MINOR IMPROVEMENTS NEEDED**

---

## 🔮 **Future Enhancements - Low Priority**

### **8. Advanced AI Features**
**Status:** 📋 **PLANNED**
**Features:**
- Machine learning models for specific business types
- Predictive analytics for demand forecasting
- Real-time schedule optimization
- Multi-location support

**Estimated Effort:** 2-4 weeks
**Priority:** 🟢 **LOW**

### **9. Integration Capabilities**
**Status:** 📋 **PLANNED**
**Features:**
- POS system integration
- Payroll system integration
- Weather API integration
- Event calendar integration

**Estimated Effort:** 1-3 weeks each
**Priority:** 🟢 **LOW**

### **10. Advanced Analytics**
**Status:** 📋 **PLANNED**
**Features:**
- Custom reporting
- Export capabilities
- Trend analysis
- Benchmarking tools

**Estimated Effort:** 1-2 weeks
**Priority:** 🟢 **LOW**

---

## 🐛 **Known Issues & Bugs**

### **11. Minor UI Glitches**
**Status:** 🟡 **LOW PRIORITY**
**Issues:**
- Some button hover states inconsistent
- Mobile layout improvements needed
- Loading states could be more polished

**Impact:** Minimal - cosmetic only
**Priority:** 🟢 **LOW**

---

## 📈 **Performance & Monitoring**

### **12. System Performance**
**Status:** 🟡 **MONITORING REQUIRED**
**Areas:**
- AI response times
- Database query performance
- Frontend rendering performance
- Memory usage optimization

**Action:** Monitor and optimize as needed
**Priority:** 🟡 **MEDIUM**

---

## 🎯 **Immediate Action Items**

### **This Week:**
1. **🔴 CRITICAL:** Address Onboarding Wizard synchronization ✅ **COMPLETED**
2. **🔴 CRITICAL:** Fix Business Information page data saving ✅ **COMPLETED**
3. **🔴 CRITICAL:** Fix AI Schedule Generation JSON truncation ✅ **COMPLETED**
4. **🟡 MEDIUM:** Implement Roles & Stations Management ✅ **COMPLETED**
5. **🧪 Testing:** Verify staff CRUD operations
6. **📊 Monitoring:** Check AI schedule generation performance

### **Next Week:**
1. **🔧 Polish:** Minor UI/UX improvements
2. **📈 Performance:** Monitor system performance
3. **📋 Planning:** Prioritize future enhancements

### **This Month:**
1. **🚀 Features:** Begin advanced AI features
2. **🔗 Integration:** Start POS integration planning
3. **📊 Analytics:** Enhance reporting capabilities

---

## 📝 **Notes & Decisions**

### **Architecture Decisions:**
- **Data Structure:** Unified approach preferred over mapping layer
- **AI Integration:** Direct API calls preferred over queue-based system
- **Database:** Supabase with RLS for security
- **Frontend:** Next.js 14 with App Router

### **Technical Debt:**
- Some TypeScript `any` types need proper typing
- Error handling could be more consistent
- Logging could be more structured
- Test coverage needs improvement

### **User Experience Priorities:**
1. **Data Consistency** - Most critical
2. **Ease of Use** - Important for adoption
3. **Performance** - Important for satisfaction
4. **Advanced Features** - Nice to have

---

## 🔄 **Update Log**

- **2025-01-15:** Document created
- **2025-01-15:** Added Onboarding Wizard synchronization issue
- **2025-01-15:** Added historical data import resolution
- **2025-01-15:** Added policy form field improvements
- **2025-01-15:** Added staff management CRUD status

---

## 📞 **Next Steps**

### **Immediate (This Week):**
1. **Decide on Onboarding Wizard approach** (Option 1 vs Option 2)
2. **Test current staff management functionality**
3. **Monitor AI performance**

### **Short Term (Next 2 Weeks):**
1. **Implement chosen Onboarding Wizard solution**
2. **Polish UI/UX inconsistencies**
3. **Begin planning advanced features**

### **Long Term (Next Month):**
1. **Implement advanced AI features**
2. **Add integration capabilities**
3. **Enhance analytics and reporting**

---

## 💡 **Recommendations**

1. **Prioritize data consistency** - This affects core functionality
2. **Test thoroughly** before moving to new features
3. **Document decisions** for future reference
4. **Monitor user feedback** for priority adjustments
5. **Plan for scalability** in all new features

---

*Last Updated: January 15, 2025*
*Next Review: January 22, 2025*
