# 🤖 AI Integration Guide

## Overview

This application now includes **AI-powered restaurant staffing optimization** using OpenAI's GPT-4o-mini model. The AI system analyzes your data to generate optimal schedules, provide predictive insights, and deliver business intelligence.

## 🚀 New AI Features

### 1. **AI-Powered Schedule Generation**
- **Intelligent Staff Assignment**: AI analyzes staff skills, performance, and availability
- **Weather Integration**: Considers weather forecasts for demand prediction
- **Historical Data Analysis**: Uses past sales data to optimize staffing levels
- **Cost Optimization**: Balances service quality with labor costs
- **Business Rules Compliance**: Respects your operational constraints

### 2. **Predictive Analytics**
- **Demand Forecasting**: Predicts busy periods and staffing needs
- **Cost Projections**: Estimates labor costs based on trends
- **Performance Insights**: Identifies improvement opportunities
- **Trend Analysis**: Spots patterns in your business data

### 3. **Business Intelligence**
- **Executive Summaries**: Clear, actionable business insights
- **Recommendations**: AI-suggested improvements and strategies
- **Risk Assessment**: Identifies potential operational challenges
- **Opportunity Analysis**: Highlights growth and optimization potential

## 🔧 Setup Instructions

### Step 1: Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Generate a new API key
4. **Important**: Keep your API key secure and never commit it to version control

### Step 2: Configure Environment
1. Copy your API key
2. Open your `.env.local` file
3. Add this line:
   ```bash
   OPENAI_API_KEY=your-actual-api-key-here
   ```
4. Save the file

### Step 3: Restart Development Server
```bash
npm run dev
```

### Step 4: Test AI Service
1. Navigate to `/dashboard/ai-test`
2. Click "Test AI Service"
3. Verify connection is successful

## 📱 How to Use

### AI Schedule Generation
1. Go to **Schedule** page (`/dashboard/schedule`)
2. Click the **"🤖 AI-Powered Schedule"** button
3. AI will analyze your data and generate an optimized schedule
4. Review the AI reasoning and recommendations
5. Apply the schedule or make adjustments as needed

### AI Analytics Insights
1. Go to **Analytics** page (`/dashboard/analytics`)
2. Use the **"Generate AI Insights"** feature
3. Select insight type (predictive, business, or all)
4. Review AI-generated recommendations

## 🏗️ Technical Architecture

### AI Service Layer (`src/lib/services/ai.ts`)
- **OpenAI Integration**: Handles API calls and response processing
- **Prompt Engineering**: Structured prompts for consistent AI responses
- **Cost Tracking**: Monitors API usage and costs
- **Error Handling**: Robust error handling and fallbacks

### API Endpoints
- **`/api/ai/test`**: Test AI service connectivity
- **`/api/ai/schedule/optimize`**: Generate AI-optimized schedules
- **`/api/ai/analytics/insights`**: Generate predictive and business insights

### Data Flow
```
Frontend → API Routes → AI Service → OpenAI API → Structured Response → Database
                ↓
        Business Logic Layer
                ↓
        Prompt Engineering
                ↓
        Response Processing
```

## 💰 Cost Management

### OpenAI Pricing (GPT-4o-mini)
- **Input Tokens**: $0.00015 per 1K tokens
- **Output Tokens**: $0.0006 per 1K tokens
- **Typical Schedule Generation**: ~$0.01-0.05 per schedule
- **Typical Analytics**: ~$0.005-0.02 per insight

### Cost Optimization Tips
1. **Use Specific Prompts**: More focused prompts use fewer tokens
2. **Batch Requests**: Generate multiple insights in one call when possible
3. **Monitor Usage**: Check the cost tracking in AI responses
4. **Set Limits**: Consider implementing usage limits for production

## 🔍 AI Prompt Examples

### Schedule Optimization Prompt
```
Please analyze the following restaurant data and generate an optimized staff schedule for the week starting [DATE].

STAFF MEMBERS:
- [Staff details with skills, performance, availability]

HISTORICAL SALES DATA:
- [Sales patterns, customer counts, weather conditions]

WEATHER FORECAST:
- [Weather data for demand prediction]

BUSINESS RULES:
- [Operational constraints and preferences]

Focus on:
1. Matching staff skills to station requirements
2. Considering weather impact on demand
3. Optimizing for cost while maintaining service quality
4. Balancing workload across staff members
5. Following business rules and constraints
```

### Business Insights Prompt
```
You are an expert restaurant business consultant. 
Your goal is to provide clear, actionable business insights that help restaurant owners 
improve operations, reduce costs, and increase profitability.

[Restaurant data analysis request]

Focus on:
1. Key performance indicators
2. Cost optimization opportunities
3. Operational improvements
4. Risk mitigation strategies
5. Actionable next steps
```

## 🚨 Troubleshooting

### Common Issues

#### "AI service connection failed"
- **Solution**: Check your `OPENAI_API_KEY` in `.env.local`
- **Verify**: API key is valid and has sufficient credits
- **Restart**: Development server after adding the key

#### "AI optimization failed"
- **Check**: Staff data exists and is properly formatted
- **Verify**: Historical data is available
- **Review**: Console logs for detailed error messages

#### "No response from AI"
- **Check**: OpenAI API status at [status.openai.com](https://status.openai.com)
- **Verify**: API key permissions and rate limits
- **Review**: Network connectivity and firewall settings

### Debug Mode
Enable detailed logging by checking the browser console and server logs for:
- AI service calls and responses
- Token usage and costs
- Error details and stack traces

## 🔮 Future Enhancements

### Planned Features
1. **Advanced Weather Integration**: More sophisticated weather impact analysis
2. **Machine Learning Models**: Custom models trained on your specific data
3. **Real-time Optimization**: Continuous schedule adjustments based on live data
4. **Multi-location Support**: AI optimization across multiple restaurant locations
5. **Seasonal Patterns**: Long-term trend analysis and seasonal adjustments

### Customization Options
1. **Prompt Templates**: Customize AI prompts for your specific needs
2. **Business Rules**: Define custom constraints and preferences
3. **Performance Metrics**: Set custom KPIs for AI optimization
4. **Integration APIs**: Connect with external systems (POS, HR, etc.)

## 📚 Best Practices

### For Restaurant Owners
1. **Start Small**: Begin with basic AI schedule generation
2. **Validate Results**: Review AI recommendations before implementing
3. **Monitor Performance**: Track the impact of AI-optimized schedules
4. **Iterate**: Use feedback to improve AI prompts and constraints

### For Developers
1. **Secure API Keys**: Never expose API keys in client-side code
2. **Rate Limiting**: Implement appropriate rate limiting for production
3. **Error Handling**: Graceful fallbacks when AI service is unavailable
4. **Cost Monitoring**: Track and alert on API usage costs

## 🆘 Support

### Getting Help
1. **Check Logs**: Review console and server logs for error details
2. **Test Connectivity**: Use the AI test page to verify setup
3. **Review Setup**: Ensure all environment variables are configured
4. **API Status**: Check OpenAI service status

### Resources
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [OpenAI Status Page](https://status.openai.com)

---

## 🎉 Congratulations!

You've successfully integrated AI-powered restaurant staffing optimization into your application! The AI system will now:

- **Generate intelligent schedules** based on multiple data sources
- **Provide predictive insights** to improve business decisions
- **Optimize labor costs** while maintaining service quality
- **Learn from your data** to continuously improve recommendations

Start by testing the AI service, then explore the new AI-powered features in your schedule and analytics pages. The AI will become more valuable as you use it more and provide more data for analysis.

**Happy AI-powered restaurant management! 🚀🍕**
