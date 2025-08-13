import { NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai";

export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function POST(req: Request) {
  try {
    console.log('🔮 Starting AI-powered analytics insights generation...');
    
    const { organizationId, timeRange, dataType, insightType } = await req.json();
    
    if (!organizationId) {
      return NextResponse.json({ 
        error: "Organization ID is required" 
      }, { status: 400 });
    }

    let aiResult;

    if (insightType === 'predictive') {
      // Generate predictive insights
      aiResult = await AIService.generatePredictiveInsights({
        organizationId,
        timeRange: timeRange || '30d',
        dataType: dataType || 'all'
      });
    } else {
      // Generate business insights
      aiResult = await AIService.generateBusinessInsights(
        organizationId,
        insightType || 'all'
      );
    }

    if (!aiResult.success) {
      console.error('❌ AI insights generation failed:', aiResult.error);
      return NextResponse.json({ 
        error: `AI insights generation failed: ${aiResult.error}` 
      }, { status: 500 });
    }

    console.log('✅ AI insights generation completed successfully');

    return NextResponse.json({
      success: true,
      message: "AI-powered insights generated successfully! 🎉",
      insights: aiResult.data,
      reasoning: aiResult.reasoning,
      aiCost: aiResult.cost,
      metadata: {
        organizationId,
        timeRange: timeRange || '30d',
        dataType: dataType || 'all',
        insightType: insightType || 'business',
        generatedAt: new Date().toISOString()
      },
      nextSteps: [
        "Review AI-generated insights and recommendations",
        "Implement suggested improvements",
        "Monitor results and adjust strategies"
      ]
    });

  } catch (error: any) {
    console.error('AI analytics insights API error:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to generate AI insights' 
    }, { status: 500 });
  }
}
