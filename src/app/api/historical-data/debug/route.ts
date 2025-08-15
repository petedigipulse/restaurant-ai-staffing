import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }

    console.log('🔍 Debug API called for org:', organizationId);

    // Check all records for this organization
    const { data: allRecords, error: allError } = await supabase
      .from('historical_sales_data')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Error fetching all records:', allError);
      return NextResponse.json({ error: `Database error: ${allError.message}` }, { status: 500 });
    }

    // Check recent records (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentRecords, error: recentError } = await supabase
      .from('historical_sales_data')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false });

    if (recentError) {
      console.error('❌ Error fetching recent records:', recentError);
      return NextResponse.json({ error: `Database error: ${recentError.message}` }, { status: 500 });
    }

    // Check organization details
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    console.log('🔍 Debug results:', {
      totalRecords: allRecords?.length || 0,
      recentRecords: recentRecords?.length || 0,
      organization: orgData,
      sampleRecentRecords: recentRecords?.slice(0, 3)
    });

    return NextResponse.json({
      success: true,
      totalRecords: allRecords?.length || 0,
      recentRecords: recentRecords?.length || 0,
      organization: orgData,
      sampleRecentRecords: recentRecords?.slice(0, 3),
      allRecordsCount: allRecords?.length || 0
    });

  } catch (error) {
    console.error('❌ Debug API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
