import OpenAI from 'openai';
import { DatabaseService } from './database';

// AI Service Configuration
const AI_MODEL = 'gpt-4o-mini'; // Using GPT-4o-mini for cost-effectiveness
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.3; // Lower temperature for more consistent business logic

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAnalysisResult {
  success: boolean;
  data?: any;
  reasoning?: string;
  error?: string;
  cost?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };
}

export interface ScheduleOptimizationRequest {
  organizationId: string;
  startDate: string;
  endDate: string;
  staffMembers: any[];
  historicalData: any[];
  weatherForecast: any;
  businessRules: any;
}

export interface ScheduleOptimizationResult {
  optimizedSchedule: any;
  reasoning: string;
  expectedEfficiency: number;
  costSavings: number;
  recommendations: string[];
}

export interface PredictiveInsightsRequest {
  organizationId: string;
  timeRange: '7d' | '30d' | '90d' | '1y';
  dataType: 'demand' | 'costs' | 'performance' | 'all';
}

export interface PredictiveInsightsResult {
  insights: string[];
  predictions: {
    demand: number[];
    costs: number[];
    performance: number[];
  };
  confidence: number;
  recommendations: string[];
}

export class AIService {
  /**
   * Generate an AI-optimized schedule based on multiple factors
   */
  static async generateOptimizedSchedule(
    request: ScheduleOptimizationRequest
  ): Promise<AIAnalysisResult> {
    try {
      console.log('🤖 Starting AI schedule optimization...');
      
      const prompt = this.buildScheduleOptimizationPrompt(request);
      
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an expert restaurant operations manager and AI scheduling specialist. 
            Your goal is to create optimal staff schedules that maximize efficiency, minimize costs, 
            and ensure excellent customer service. Always provide detailed reasoning for your decisions.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from AI');
      }

      const result = JSON.parse(content);
      
      console.log('✅ AI schedule optimization completed successfully');
      
      return {
        success: true,
        data: result,
        reasoning: result.reasoning,
        cost: {
          inputTokens: response.usage?.prompt_tokens || 0,
          outputTokens: response.usage?.completion_tokens || 0,
          totalCost: this.calculateCost(
            response.usage?.prompt_tokens || 0,
            response.usage?.completion_tokens || 0
          )
        }
      };

    } catch (error) {
      console.error('❌ AI schedule optimization failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate predictive insights and analytics
   */
  static async generatePredictiveInsights(
    request: PredictiveInsightsRequest
  ): Promise<AIAnalysisResult> {
    try {
      console.log('🔮 Starting AI predictive insights generation...');
      
      const prompt = this.buildPredictiveInsightsPrompt(request);
      
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an expert business analyst specializing in restaurant operations. 
            Your goal is to provide actionable insights and predictions based on historical data. 
            Always support your analysis with data and provide specific recommendations.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from AI');
      }

      const result = JSON.parse(content);
      
      console.log('✅ AI predictive insights generated successfully');
      
      return {
        success: true,
        data: result,
        reasoning: result.reasoning,
        cost: {
          inputTokens: response.usage?.prompt_tokens || 0,
          outputTokens: response.usage?.completion_tokens || 0,
          totalCost: this.calculateCost(
            response.usage?.prompt_tokens || 0,
            response.usage?.completion_tokens || 0
          )
        }
      };

    } catch (error) {
      console.error('❌ AI predictive insights generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate business intelligence insights
   */
  static async generateBusinessInsights(
    organizationId: string,
    dataType: 'summary' | 'trends' | 'recommendations' | 'all'
  ): Promise<AIAnalysisResult> {
    try {
      console.log('💡 Starting AI business insights generation...');
      
      // Fetch relevant data
      const [staff, schedules, historicalData] = await Promise.all([
        DatabaseService.getStaffMembers(organizationId),
        DatabaseService.getSchedules(organizationId),
        DatabaseService.getHistoricalDataForScheduling(organizationId, '30d')
      ]);

      const prompt = this.buildBusinessInsightsPrompt({
        staff,
        schedules,
        historicalData,
        dataType
      });

      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an expert restaurant business consultant. 
            Your goal is to provide clear, actionable business insights that help restaurant owners 
            improve operations, reduce costs, and increase profitability.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from AI');
      }

      const result = JSON.parse(content);
      
      console.log('✅ AI business insights generated successfully');
      
      return {
        success: true,
        data: result,
        reasoning: result.reasoning,
        cost: {
          inputTokens: response.usage?.prompt_tokens || 0,
          outputTokens: response.usage?.completion_tokens || 0,
          totalCost: this.calculateCost(
            response.usage?.prompt_tokens || 0,
            response.usage?.completion_tokens || 0
          )
        }
      };

    } catch (error) {
      console.error('❌ AI business insights generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Build prompt for schedule optimization
   */
  private static buildScheduleOptimizationPrompt(request: ScheduleOptimizationRequest): string {
    const { staffMembers, historicalData, weatherForecast, businessRules } = request;
    
    // Calculate the number of days in the schedule period
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return `Please analyze the following restaurant data and generate an optimized staff schedule for the period from ${request.startDate} to ${request.endDate} (${daysDiff} days).

STAFF MEMBERS (${staffMembers.length}):
${staffMembers.map(staff => {
  // Handle availability - it's an object with day keys, not an array
  const availableDays = staff.availability && typeof staff.availability === 'object' 
    ? Object.keys(staff.availability).filter(day => 
        staff.availability[day] && staff.availability[day].available
      ).join(', ')
    : 'Not specified';
  
  return `- ${staff.name} (${staff.role}): $${staff.hourlyWage}/hr, Performance: ${staff.performance}/100, Available: ${availableDays}, Stations: ${staff.stations.join(', ')}`;
}).join('\n')}

HISTORICAL SALES DATA (${historicalData.length} records):
${historicalData.slice(0, 10).map(data => 
  `- ${data.date}: $${data.total_sales}, ${data.customer_count} customers, ${data.weather_conditions}`
).join('\n')}

WEATHER FORECAST:
${JSON.stringify(weatherForecast, null, 2)}

BUSINESS RULES:
${JSON.stringify(businessRules, null, 2)}

IMPORTANT REQUIREMENTS:
1. EVERY shift (lunch and dinner) MUST have staff assigned to ALL stations
2. NO empty shifts or stations - ensure full coverage
3. Match staff skills to station requirements
4. Consider staff availability and performance scores
5. Balance workload across staff members
6. Optimize for cost while maintaining service quality

Please provide a JSON response with the following structure:
{
  "optimizedSchedule": {
    "monday": {
      "lunch": {
        "stations": {
          "kitchen": { 
            "assignedStaff": [
              {"id": "staff_id", "name": "Staff Name", "role": "Role", "hourly_wage": 25}
            ]
          },
          "front_of_house": { 
            "assignedStaff": [
              {"id": "staff_id", "name": "Staff Name", "role": "Role", "hourly_wage": 20}
            ]
          },
          "bar": { 
            "assignedStaff": [
              {"id": "staff_id", "name": "Staff Name", "role": "Role", "hourly_wage": 22}
            ]
          },
          "host": { 
            "assignedStaff": [
              {"id": "staff_id", "name": "Staff Name", "role": "Role", "hourly_wage": 18}
            ]
          }
        }
      },
      "dinner": { 
        "stations": {
          "kitchen": { 
            "assignedStaff": [
              {"id": "staff_id", "name": "Staff Name", "role": "Role", "hourly_wage": 25}
            ]
          },
          "front_of_house": { 
            "assignedStaff": [
              {"id": "staff_id", "name": "Staff Name", "role": "Role", "hourly_wage": 20}
            ]
          },
          "bar": { 
            "assignedStaff": [
              {"id": "staff_id", "name": "Staff Name", "role": "Role", "hourly_wage": 22}
            ]
          },
          "host": { 
            "assignedStaff": [
              {"id": "staff_id", "name": "Staff Name", "role": "Role", "hourly_wage": 18}
            ]
          }
        }
      }
    }
    /* repeat for tuesday, wednesday, thursday, friday, saturday, sunday */
  },
  "reasoning": "Detailed explanation of why this schedule is optimal",
  "expectedEfficiency": 85,
  "costSavings": 150,
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

CRITICAL: Ensure every day has both lunch and dinner shifts with staff assigned to all 4 stations (kitchen, front_of_house, bar, host). Do not leave any shifts empty.`;
  }

  /**
   * Build prompt for predictive insights
   */
  private static buildPredictiveInsightsPrompt(request: PredictiveInsightsRequest): string {
    return `Please analyze the restaurant data for the ${request.timeRange} time range and provide predictive insights for ${request.dataType === 'all' ? 'demand, costs, and performance' : request.dataType}.

Please provide a JSON response with the following structure:
{
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "predictions": {
    "demand": [/* predicted demand values */],
    "costs": [/* predicted cost values */],
    "performance": [/* predicted performance values */]
  },
  "confidence": 85,
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "reasoning": "Explanation of your analysis and predictions"
}

Focus on:
1. Identifying trends and patterns
2. Making data-driven predictions
3. Providing actionable recommendations
4. Explaining your reasoning clearly`;
  }

  /**
   * Build prompt for business insights
   */
  private static buildBusinessInsightsPrompt(data: any): string {
    const { staff, schedules, historicalData, dataType } = data;
    
    return `Please analyze the following restaurant business data and provide ${dataType === 'all' ? 'comprehensive business insights' : `${dataType} insights`}.

STAFF DATA (${staff.length} members):
${staff.map((s: any) => `- ${s.first_name} ${s.last_name}: ${s.role}, $${s.hourly_wage}/hr, Performance: ${s.performance_score}/100`).join('\n')}

SCHEDULE DATA (${schedules.length} weeks):
${schedules.slice(0, 5).map((s: any) => `- Week ${s.week_start_date}: $${s.total_labor_cost}, ${s.total_hours} hours`).join('\n')}

HISTORICAL DATA (${historicalData.length} records):
${historicalData.slice(0, 5).map((h: any) => `- ${h.date}: $${h.total_sales}, ${h.customer_count} customers`).join('\n')}

Please provide a JSON response with the following structure:
{
  "summary": "Executive summary of key findings",
  "trends": ["Trend 1", "Trend 2", "Trend 3"],
  "opportunities": ["Opportunity 1", "Opportunity 2"],
  "risks": ["Risk 1", "Risk 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "reasoning": "Detailed explanation of your analysis"
}

Focus on:
1. Key performance indicators
2. Cost optimization opportunities
3. Operational improvements
4. Risk mitigation strategies
5. Actionable next steps`;
  }

  /**
   * Calculate cost based on OpenAI pricing (GPT-4o-mini)
   */
  private static calculateCost(inputTokens: number, outputTokens: number): number {
    // GPT-4o-mini pricing (as of 2024): $0.00015 per 1K input tokens, $0.0006 per 1K output tokens
    const inputCost = (inputTokens / 1000) * 0.00015;
    const outputCost = (outputTokens / 1000) * 0.0006;
    return Math.round((inputCost + outputCost) * 1000000) / 1000000; // Round to 6 decimal places
  }

  /**
   * Test AI service connectivity
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      });
      return !!response.choices[0]?.message?.content;
    } catch (error) {
      console.error('AI service connection test failed:', error);
      return false;
    }
  }
}
