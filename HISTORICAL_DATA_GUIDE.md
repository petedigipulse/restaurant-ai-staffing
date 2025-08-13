# Historical Data & CSV Import Guide

## 📊 **What Happens to CSV Data**

When you upload a CSV file through the "Historical Data & Patterns" page:

1. **File Processing**: The app reads your CSV file and extracts data from each row
2. **Data Validation**: Checks that required columns are present and data formats are correct
3. **Database Storage**: Saves each row as a record in the `historical_sales_data` table
4. **AI Analysis**: The data is used to train the AI to understand your business patterns

## 🗄️ **Database Storage Location**

Your historical data is stored in the **`historical_sales_data`** table in your Supabase database with this structure:

```sql
historical_sales_data (
  id: UUID (unique identifier)
  organization_id: UUID (links to your restaurant)
  date: DATE (e.g., 2025-08-13)
  time: TIME (e.g., 09:00)
  total_sales: DECIMAL (e.g., 150.75)
  customer_count: INTEGER (e.g., 25)
  station_breakdown: JSONB (e.g., {"Kitchen": 100.00, "Front of House": 50.75})
  weather_conditions: JSONB (e.g., {"condition": "Sunny", "temperature": 22})
  special_events: TEXT (e.g., "Holiday weekend")
  notes: TEXT (e.g., "Morning rush")
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

## 📋 **CSV Template for Users**

### **Download the Template**
- **File**: `historical-data-template.csv`
- **Format**: CSV (Comma Separated Values)
- **Compatible with**: Excel, Google Sheets, Numbers, any spreadsheet software

### **Required Columns**

| Column | Required | Format | Example | Description |
|--------|----------|---------|---------|-------------|
| **Date** | ✅ Yes | YYYY-MM-DD | 2025-08-13 | Date of the sales data |
| **Time** | ✅ Yes | HH:MM | 09:00 | Time period (24-hour format) |
| **Total Sales ($)** | ✅ Yes | Number | 150.75 | Total sales amount for that time period |
| **Customer Count** | ✅ Yes | Number | 25 | Number of customers served |
| **Station Breakdown** | ✅ Yes | Text | "Kitchen: 100.00, Front of House: 50.75" | Sales breakdown by station |
| **Weather Conditions** | ❌ Optional | Text | "Sunny, 22°C" | Weather info for AI analysis |
| **Special Events** | ❌ Optional | Text | "Holiday weekend" | Any special events affecting sales |
| **Notes** | ❌ Optional | Text | "Morning rush" | Additional context |

### **How to Fill Out the Template**

1. **Download** the `historical-data-template.csv` file
2. **Open** in your preferred spreadsheet software (Excel, Google Sheets, etc.)
3. **Fill in** your actual sales data for each time period
4. **Save** as CSV format
5. **Upload** through the app's "Import Historical Data" section

### **Data Entry Tips**

- **Time Periods**: Use consistent time intervals (e.g., every hour, every 30 minutes)
- **Station Breakdown**: Use the format "Station: Amount, Station: Amount"
- **Weather**: Include temperature and conditions for better AI analysis
- **Special Events**: Note holidays, promotions, or other events that affect sales
- **Consistency**: Use the same format throughout for best results

## 🔄 **Data Flow Process**

```
CSV Upload → Data Parsing → Validation → Database Storage → AI Training → Scheduling Optimization
```

1. **Upload**: User uploads CSV file
2. **Parse**: App extracts data from each row
3. **Validate**: Check data format and required fields
4. **Store**: Save to `historical_sales_data` table
5. **Train**: AI learns from patterns in your data
6. **Optimize**: Use patterns to improve staff scheduling

## 📈 **What the AI Learns**

From your historical data, the AI can understand:

- **Peak Hours**: When you're busiest
- **Seasonal Patterns**: How weather affects sales
- **Station Workload**: Which areas need more staff
- **Customer Flow**: How many customers you serve at different times
- **Revenue Patterns**: Sales trends throughout the day/week

## 🚀 **Benefits of Historical Data**

- **Better Staffing**: AI can predict exactly how many staff you need
- **Cost Optimization**: Reduce overstaffing and understaffing
- **Weather Integration**: Adjust staffing based on weather forecasts
- **Event Planning**: Prepare for special events and holidays
- **Performance Insights**: Understand your business patterns

## 📝 **Example Data Entry**

Here's how a typical row should look:

```csv
2025-08-13,12:00,450.25,75,"Kitchen: 300.00, Front of House: 150.25","Sunny, 28°C","","Lunch rush"
```

This represents:
- **Date**: August 13, 2025
- **Time**: 12:00 PM (noon)
- **Sales**: $450.25 total
- **Customers**: 75 customers
- **Breakdown**: Kitchen made $300, Front of House made $150.25
- **Weather**: Sunny, 28°C
- **Events**: None
- **Notes**: Lunch rush period

## 🔧 **Technical Details**

- **File Size Limit**: Up to 10MB CSV files
- **Row Limit**: Up to 10,000 data points
- **Data Retention**: Historical data is kept indefinitely
- **Backup**: Data is automatically backed up in Supabase
- **Security**: Only your organization can access your data

## 📞 **Need Help?**

If you have questions about:
- **Data Format**: Check the template examples
- **Upload Issues**: Ensure your CSV has the required columns
- **Data Accuracy**: Review your entries for typos or formatting errors
- **AI Analysis**: The more data you provide, the better the AI performs

---

**Remember**: The quality of your AI-powered scheduling depends on the quality and quantity of your historical data. More detailed, consistent data leads to better staffing predictions!
