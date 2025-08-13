import { NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai";

export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function GET() {
  try {
    console.log('🧪 Testing AI service connectivity...');
    
    // Test basic connection
    const isConnected = await AIService.testConnection();
    
    if (!isConnected) {
      return NextResponse.json({ 
        success: false,
        error: "AI service connection failed. Please check your OPENAI_API_KEY.",
        message: "Make sure you have set OPENAI_API_KEY in your .env.local file"
      }, { status: 500 });
    }

    // Test with a simple prompt
    const testResult = await AIService.generateBusinessInsights(
      'test-org-123',
      'summary'
    );

    return NextResponse.json({
      success: true,
      message: "AI service is working correctly! 🎉",
      connection: "Connected to OpenAI API",
      model: "GPT-4o-mini",
      testResult: testResult.success ? "Business insights generation successful" : "Business insights generation failed",
      cost: testResult.cost ? `$${testResult.cost.totalCost}` : "N/A",
      nextSteps: [
        "Add your OpenAI API key to .env.local",
        "Test AI-powered schedule generation",
        "Explore predictive analytics features"
      ]
    });

  } catch (error: any) {
    console.error('AI service test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: error?.message || 'Unknown error occurred',
      message: "AI service test failed. Check your configuration and try again."
    }, { status: 500 });
  }
}
