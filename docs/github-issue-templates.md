# 🐛 GitHub Issue Templates

## 📋 **How to Use These Templates**

Copy and paste the appropriate template into a new GitHub issue. Fill in the details and assign to the appropriate team member.

---

## 🚨 **Critical Issue Template**

```markdown
## 🚨 Critical Issue: [Issue Title]

### **Priority:** 🔴 CRITICAL
**Status:** 🆕 NEW
**Type:** Bug/Feature/Improvement

### **Description**
[Brief description of the critical issue]

### **Impact**
- [ ] Data loss risk
- [ ] Core functionality broken
- [ ] User experience severely impacted
- [ ] Security vulnerability
- [ ] Performance critical

### **Current Behavior**
[Describe what's currently happening]

### **Expected Behavior**
[Describe what should happen]

### **Steps to Reproduce**
1. [Step 1]
2. [Step 2]
3. [Step 3]

### **Environment**
- **Browser:** [Chrome/Firefox/Safari]
- **OS:** [Windows/Mac/Linux]
- **User Role:** [Admin/Manager/Staff]

### **Files Affected**
- `[file path 1]`
- `[file path 2]`

### **Proposed Solution**
[Describe the proposed fix]

### **Acceptance Criteria**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### **Estimated Effort**
[Time estimate]

### **Dependencies**
[List any dependencies]

### **Additional Notes**
[Any additional context]
```

---

## 🔧 **Feature Request Template**

```markdown
## 🚀 Feature Request: [Feature Name]

### **Priority:** 🟡 MEDIUM / 🟢 LOW
**Status:** 🆕 NEW
**Type:** Feature

### **Description**
[Brief description of the requested feature]

### **Business Value**
[Why this feature is needed and what value it provides]

### **User Story**
As a [user type], I want [feature], so that [benefit].

### **Current State**
[Describe what currently exists]

### **Desired State**
[Describe what should be implemented]

### **Acceptance Criteria**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### **Technical Requirements**
- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

### **UI/UX Considerations**
[Describe any UI/UX requirements]

### **Estimated Effort**
[Time estimate]

### **Dependencies**
[List any dependencies]

### **Alternative Solutions**
[Describe any alternative approaches]

### **Additional Notes**
[Any additional context]
```

---

## 🐛 **Bug Report Template**

```markdown
## 🐛 Bug Report: [Bug Description]

### **Priority:** 🟡 MEDIUM / 🟢 LOW
**Status:** 🆕 NEW
**Type:** Bug

### **Description**
[Brief description of the bug]

### **Current Behavior**
[Describe what's currently happening]

### **Expected Behavior**
[Describe what should happen]

### **Steps to Reproduce**
1. [Step 1]
2. [Step 2]
3. [Step 3]

### **Environment**
- **Browser:** [Chrome/Firefox/Safari]
- **OS:** [Windows/Mac/Linux]
- **User Role:** [Admin/Manager/Staff]
- **Device:** [Desktop/Tablet/Mobile]

### **Screenshots/Videos**
[Attach relevant screenshots or videos]

### **Console Errors**
[Paste any console errors]

### **Network Tab**
[Any relevant network request/response issues]

### **Files Affected**
- `[file path 1]`
- `[file path 2]`

### **Proposed Fix**
[Describe the proposed fix if known]

### **Acceptance Criteria**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### **Additional Notes**
[Any additional context]
```

---

## 🔄 **Improvement Request Template**

```markdown
## 🔄 Improvement Request: [Improvement Description]

### **Priority:** 🟡 MEDIUM / 🟢 LOW
**Status:** 🆕 NEW
**Type:** Improvement

### **Description**
[Brief description of the improvement]

### **Current State**
[Describe what currently exists]

### **Desired Improvement**
[Describe what should be improved]

### **Business Value**
[Why this improvement is valuable]

### **User Impact**
[How this affects users]

### **Technical Considerations**
[Any technical aspects to consider]

### **Acceptance Criteria**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### **Estimated Effort**
[Time estimate]

### **Dependencies**
[List any dependencies]

### **Alternative Approaches**
[Describe any alternative solutions]

### **Additional Notes**
[Any additional context]
```

---

## 📊 **Issue Status Labels**

### **Priority Labels:**
- `🔴 critical` - Must fix immediately
- `🟡 high` - Fix soon
- `🟢 medium` - Fix when possible
- `🔵 low` - Nice to have

### **Status Labels:**
- `🆕 new` - Just created
- `🔍 investigating` - Under investigation
- `🛠️ in-progress` - Currently being worked on
- `🧪 testing` - Ready for testing
- `✅ resolved` - Issue fixed
- `❌ wont-fix` - Won't be fixed
- `📋 duplicate` - Duplicate of another issue

### **Type Labels:**
- `🐛 bug` - Something isn't working
- `🚀 feature` - New feature request
- `🔄 improvement` - Enhancement to existing feature
- `📚 documentation` - Documentation updates
- `🧪 testing` - Testing related
- `🔧 maintenance` - Code maintenance

---

## 📝 **Example Issues**

### **Critical Issue Example:**
```markdown
## 🚨 Critical Issue: Onboarding Wizard Data Loss

### **Priority:** 🔴 CRITICAL
**Status:** 🆕 NEW
**Type:** Bug

### **Description**
Users are losing business rules data when moving from onboarding wizard to business rules page due to data structure mismatch.

### **Impact**
- [x] Data loss risk
- [x] Core functionality broken
- [x] User experience severely impacted

### **Current Behavior**
Onboarding wizard saves data in simple format, but business rules page expects advanced structure with additional_policies.

### **Expected Behavior**
Both systems should use the same data structure to prevent data loss.

### **Steps to Reproduce**
1. Complete onboarding wizard with business rules
2. Navigate to business rules page
3. Notice data is missing or incomplete

### **Files Affected**
- `src/app/onboarding/components/BusinessRulesStep.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/dashboard/business-rules/policies/page.tsx`

### **Proposed Solution**
Unify data structures between onboarding wizard and business rules page.

### **Acceptance Criteria**
- [ ] Onboarding wizard saves data in same format as business rules page
- [ ] No data loss when moving between systems
- [ ] Consistent user experience

### **Estimated Effort**
1-2 days

### **Dependencies**
None
```

---

## 🎯 **Using These Templates**

1. **Copy the appropriate template** for your issue type
2. **Fill in all relevant sections** with specific details
3. **Add appropriate labels** for priority, status, and type
4. **Assign to team members** who can work on the issue
5. **Link related issues** if there are dependencies
6. **Update status** as work progresses

### **Best Practices:**
- Be specific and detailed in descriptions
- Include steps to reproduce for bugs
- Provide business value for features
- Estimate effort realistically
- Update status regularly
- Link related issues and pull requests

---

*Last Updated: January 15, 2025*
*Template Version: 1.0*
