# Staff CSV Import Guide

## 🚀 **New Feature: Bulk Staff Import via CSV**

Your restaurant AI staffing app now supports importing multiple staff members at once using CSV files! This makes it much faster to set up your team.

## 📋 **How to Use Staff CSV Import**

### **Step 1: Access the Feature**
1. **Go to** your Staff Directory page (`/dashboard/staff`)
2. **Click** the green "Import CSV" button in the top right
3. **Upload** your CSV file or drag & drop it

### **Step 2: Download the Template**
- **Click** "Download template" in the import modal
- **Use** the provided `staff-template.csv` as a starting point
- **Customize** it with your actual staff data

## 📊 **CSV Template Structure**

### **Required Fields (Must be filled):**
| Column | Example | Description |
|--------|---------|-------------|
| **First Name** | Emily | Staff member's first name |
| **Last Name** | Chen | Staff member's last name |
| **Email** | emily.chen@restaurant.com | Unique email address |
| **Role** | FOH Manager | Job title/position |

### **Optional Fields (Can be left blank):**
| Column | Example | Description |
|--------|---------|-------------|
| **Hourly Wage** | 32.00 | Pay rate per hour |
| **Guaranteed Hours** | 30 | Minimum hours per week |
| **Employment Type** | full-time | full-time, part-time, or casual |
| **Performance Score** | 95 | 0-100 performance rating |
| **Stations** | "Front of House, Management" | Work areas (comma-separated) |
| **Phone** | +1 (555) 123-4567 | Contact number |
| **Emergency Contact** | John Chen | Emergency contact name |
| **Start Date** | 2024-01-15 | Employment start date (YYYY-MM-DD) |

## 📝 **Sample CSV Data**

```csv
First Name,Last Name,Email,Role,Hourly Wage,Guaranteed Hours,Employment Type,Performance Score,Stations,Phone,Emergency Contact,Start Date
Emily,Chen,emily.chen@restaurant.com,FOH Manager,32.00,30,full-time,95,"Front of House, Management","+1 (555) 123-4567","John Chen","2024-01-15"
Mai,Kanako,mai.kanako@restaurant.com,Barista,26.00,15,part-time,98,"Barista, Till","+1 (555) 987-6543","Sarah Johnson","2024-02-01"
Liam,O'Connor,liam.oconnor@restaurant.com,Head Chef,38.00,40,full-time,97,"Kitchen, Management","+1 (555) 456-7890","Mary O'Connor","2023-11-01"
```

## 🔧 **CSV Format Requirements**

### **File Format:**
- **Extension**: `.csv` (Comma Separated Values)
- **Encoding**: UTF-8 (standard)
- **Delimiter**: Comma (,)
- **Quotes**: Use double quotes for fields containing commas

### **Data Validation:**
- **Email addresses** must be unique
- **Employment types** must be: `full-time`, `part-time`, or `casual`
- **Performance scores** must be 0-100
- **Dates** must be in YYYY-MM-DD format
- **Stations** should be comma-separated without extra spaces

### **Default Values:**
- **Employment Type**: `part-time` (if not specified)
- **Performance Score**: `80` (if not specified)
- **Status**: `active` (all imported staff are active)
- **Availability**: Standard weekday schedule (if not specified)

## 📱 **How to Import**

### **Method 1: Drag & Drop**
1. **Open** the CSV import modal
2. **Drag** your CSV file over the upload area
3. **Drop** it when the border turns purple
4. **Wait** for the import to complete

### **Method 2: File Browser**
1. **Click** "Choose File" button
2. **Browse** to your CSV file
3. **Select** the file and click "Open"
4. **Wait** for the import to complete

## ✅ **Import Success**

When successful, you'll see:
- **Green success message** with import count
- **Staff members** added to your database
- **Immediate availability** in the staff directory
- **Data ready** for scheduling

## ❌ **Common Import Errors**

### **Missing Required Fields:**
```
Error: Invalid data in 2 rows. First Name, Last Name, Email, and Role are required.
```
**Solution**: Fill in all required fields for every row

### **Invalid Employment Type:**
```
Error: Invalid employment type 'contract'. Must be full-time, part-time, or casual.
```
**Solution**: Use only the three allowed employment types

### **Invalid Date Format:**
```
Error: Invalid date format '15/01/2024'. Use YYYY-MM-DD.
```
**Solution**: Format dates as YYYY-MM-DD (e.g., 2024-01-15)

### **Duplicate Emails:**
```
Error: Email 'emily.chen@restaurant.com' already exists.
```
**Solution**: Use unique email addresses for each staff member

## 🎯 **Best Practices**

### **Before Importing:**
1. **Review** your CSV data for accuracy
2. **Check** email addresses are unique
3. **Verify** phone numbers are properly formatted
4. **Ensure** dates are in correct format

### **Data Quality:**
1. **Use consistent** naming conventions
2. **Standardize** role titles
3. **Group similar** stations together
4. **Validate** contact information

### **After Importing:**
1. **Review** imported staff in the directory
2. **Check** that all data imported correctly
3. **Update** availability schedules if needed
4. **Set** performance scores based on actual data

## 🔄 **Updating Existing Staff**

### **To Update Staff:**
1. **Export** current staff data (if export feature available)
2. **Modify** the CSV with updated information
3. **Re-import** the updated CSV
4. **Note**: This will create new records, not update existing ones

## 📞 **Need Help?**

### **If Import Fails:**
1. **Check** the error message for specific issues
2. **Verify** your CSV format matches the template
3. **Ensure** all required fields are filled
4. **Check** for special characters or formatting issues

### **Common Issues:**
- **File encoding** problems (use UTF-8)
- **Extra commas** in station lists (use quotes)
- **Date format** mismatches
- **Missing headers** in first row

## 🚀 **Next Steps After Import**

1. **Review** imported staff in the directory
2. **Set up** individual availability schedules
3. **Configure** performance metrics
4. **Generate** AI schedules using your new staff
5. **Import** historical sales data for optimization

---

**Your staff CSV import is now ready to use! This feature will save you hours of manual data entry and get your AI scheduling system up and running much faster.** 🎯
