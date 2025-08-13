import { supabase } from '../supabase';
import type { Organization, StaffMember, BusinessRules } from '../supabase';

export class DatabaseService {
  // Organization operations
  static async createOrganization(organizationData: {
    name: string;
    type: string;
    timezone: string;
    operating_hours: Record<string, any>;
    owner_id: string;
  }) {
    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        name: organizationData.name,
        type: organizationData.type,
        timezone: organizationData.timezone,
        operating_hours: organizationData.operating_hours,
        owner_id: organizationData.owner_id
      }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create organization: ${error.message}`);
    return data;
  }

  // Create organization with user during onboarding
  static async createOrganizationWithUser(organizationData: {
    name: string;
    type: string;
    timezone: string;
    operating_hours: Record<string, any>;
    user_email: string;
    user_name: string;
  }) {
    try {
      console.log('Creating organization with user:', organizationData);

      // First check if user already exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', organizationData.user_email)
        .single();

      let userId: string;

      if (existingUser) {
        // User already exists, use their ID
        console.log('User already exists, using existing user ID:', existingUser.id);
        userId = existingUser.id;
      } else {
        // Create new user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([{
            email: organizationData.user_email,
            name: organizationData.user_name,
            role: 'OWNER'
          }])
          .select()
          .single();

        if (userError) {
          console.error('Error creating user:', userError);
          throw new Error(`Failed to create user: ${userError.message}`);
        }

        console.log('User created successfully:', userData);
        userId = userData.id;
      }

      // Check if organization already exists for this user
      const { data: existingOrg, error: orgCheckError } = await supabase
        .from('organizations')
        .select('*')
        .eq('owner_id', userId)
        .single();

      if (existingOrg) {
        // Organization already exists, update it with new data
        console.log('Organization already exists, updating with new data:', existingOrg.id);
        
        const { data: updatedOrg, error: updateError } = await supabase
          .from('organizations')
          .update({
            name: organizationData.name,
            type: organizationData.type,
            timezone: organizationData.timezone,
            operating_hours: organizationData.operating_hours,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingOrg.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating organization:', updateError);
          throw new Error(`Failed to update organization: ${updateError.message}`);
        }

        console.log('Organization updated successfully:', updatedOrg);
        return updatedOrg;
      }

      // Create new organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{
          name: organizationData.name,
          type: organizationData.type,
          timezone: organizationData.timezone,
          operating_hours: organizationData.operating_hours,
          owner_id: userId,
          user_id: userId
        }])
        .select()
        .single();

      if (orgError) {
        console.error('Error creating organization:', orgError);
        throw new Error(`Failed to create organization: ${orgError.message}`);
      }

      console.log('Organization created successfully:', orgData);
      return orgData;
    } catch (error) {
      console.error('Error in createOrganizationWithUser:', error);
      throw error;
    }
  }

  static async getOrganization(ownerId: string) {
    const { data: org, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', ownerId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching organization:', error);
      throw new Error(`Failed to fetch organization: ${error.message}`);
    }

    return org;
  }

  static async getOrganizationById(organizationId: string) {
    const { data: org, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching organization by ID:', error);
      throw new Error(`Failed to fetch organization: ${error.message}`);
    }

    return org;
  }

  static async updateOrganization(id: string, updates: Partial<Organization>) {
    const { data: org, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating organization:', error);
      throw new Error(`Failed to update organization: ${error.message}`);
    }

    return org;
  }

  // Staff member operations
  static async createStaffMember(data: Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>) {
    const { data: staff, error } = await supabase
      .from('staff_members')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error creating staff member:', error);
      throw new Error(`Failed to create staff member: ${error.message}`);
    }

    return staff;
  }

  static async getStaffMembers(organizationId: string) {
    const { data: staff, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching staff members:', error);
      throw new Error(`Failed to fetch staff members: ${error.message}`);
    }

    return staff || [];
  }

  static async updateStaffMember(id: string, updates: Partial<StaffMember>) {
    const { data: staff, error } = await supabase
      .from('staff_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating staff member:', error);
      throw new Error(`Failed to update staff member: ${error.message}`);
    }

    return staff;
  }

  static async deleteStaffMember(id: string) {
    const { error } = await supabase
      .from('staff_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting staff member:', error);
      throw new Error(`Failed to delete staff member: ${error.message}`);
    }

    return true;
  }

  // Business rules operations
  static async createBusinessRules(data: Omit<BusinessRules, 'id' | 'created_at' | 'updated_at'>) {
    const { data: rules, error } = await supabase
      .from('business_rules')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error creating business rules:', error);
      throw new Error(`Failed to create business rules: ${error.message}`);
    }

    return rules;
  }

  static async getBusinessRules(organizationId: string) {
    const { data: rules, error } = await supabase
      .from('business_rules')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching business rules:', error);
      throw new Error(`Failed to fetch business rules: ${error.message}`);
    }

    return rules;
  }

  static async updateBusinessRules(id: string, updates: Partial<BusinessRules>) {
    const { data: rules, error } = await supabase
      .from('business_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating business rules:', error);
      throw new Error(`Failed to update business rules: ${error.message}`);
    }

    return rules;
  }

  // Utility functions
  static async getOrganizationByOwnerId(ownerId: string) {
    const { data: org, error } = await supabase
      .from('organizations')
      .select(`
        *,
        staff_members (*),
        business_rules (*)
      `)
      .eq('owner_id', ownerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching organization with relations:', error);
      throw new Error(`Failed to fetch organization: ${error.message}`);
    }

    return org;
  }

  // CSV import helper
  static async importStaffFromCSV(organizationId: string, csvData: any[]) {
    try {
      console.log('DatabaseService.importStaffFromCSV called with:', { organizationId, csvDataCount: csvData.length });
      console.log('First row sample:', csvData[0]);
      
      // Transform CSV data to match database schema
      const staffMembers = csvData.map(row => ({
        organization_id: organizationId,
        first_name: row['First Name'] || row.firstName || '',
        last_name: row['Last Name'] || row.lastName || '',
        email: row['Email'] || row.email || '',
        role: row['Role'] || row.role || '',
        hourly_wage: parseFloat((row['Hourly Wage'] || row.hourlyWage || '0').toString()),
        guaranteed_hours: parseInt((row['Guaranteed Hours'] || row.guaranteedHours || '0').toString()),
        employment_type: (row['Employment Type'] || row.employmentType || 'part-time').toString().toLowerCase(),
        performance_score: parseInt((row['Performance Score'] || row.performanceScore || '80').toString()),
        stations: (row['Stations'] || row.stations || '').toString().split(',').map((s: string) => s.trim()).filter(Boolean),
        availability: {
          monday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          tuesday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          wednesday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          thursday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          friday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          saturday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
          sunday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false }
        },
        contact_info: {
          phone: (row['Phone'] || row.phone || '').toString(),
          emergency_contact: (row['Emergency Contact'] || row.emergencyContact || '').toString()
        },
        start_date: (() => {
          const dateStr = row['Start Date'] || row.startDate || new Date().toISOString().split('T')[0];
          // Validate that it's a proper date format (YYYY-MM-DD)
          if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
          }
          // If invalid, use today's date
          console.warn(`Invalid start date format: "${dateStr}", using today's date instead`);
          return new Date().toISOString().split('T')[0];
        })(),
        status: 'active'
      }));

      // Validate required fields
      const invalidRows = staffMembers.filter(staff => 
        !staff.first_name || !staff.last_name || !staff.email || !staff.role
      );

      if (invalidRows.length > 0) {
        throw new Error(`Invalid data in ${invalidRows.length} rows. First Name, Last Name, Email, and Role are required.`);
      }

      console.log('About to insert staff members into database:', staffMembers.length);
      const { data, error } = await supabase
        .from('staff_members')
        .insert(staffMembers)
        .select();

      if (error) {
        console.error('Error importing staff from CSV:', error);
        throw new Error(`Failed to import staff: ${error.message}`);
      }

      console.log('Successfully inserted staff members:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error in importStaffFromCSV:', error);
      throw error;
    }
  }

  // Historical data operations
  static async importHistoricalSales(
    organizationId: string,
    rows: Array<{
      date: string; time: string; totalSales: number; customerCount: number;
      stationBreakdown: Record<string, number>;
      weatherConditions?: Record<string, any> | string | null;
      specialEvents?: string | null;
      notes?: string | null;
    }>
  ) {
    const payload = rows.map((row) => {
      const weather = typeof row.weatherConditions === 'string'
        ? { text: row.weatherConditions }
        : row.weatherConditions || null;

      return {
        organization_id: organizationId,
        date: row.date,
        time: row.time,
        total_sales: Number(row.totalSales) || 0,
        customer_count: Number(row.customerCount) || 0,
        station_breakdown: row.stationBreakdown || {},
        weather_conditions: weather,
        special_events: row.specialEvents || null,
        notes: row.notes || null,
      };
    });

    const { data, error } = await supabase
      .from('historical_sales_data')
      .insert(payload)
      .select();

    if (error) {
      console.error('Error importing historical sales:', error);
      throw new Error(`Failed to import historical sales: ${error.message}`);
    }

    return data;
  }

  // Save historical data from onboarding process
  static async saveHistoricalDataFromOnboarding(organizationId: string, historicalData: any) {
    try {
      // Get the current user's email from localStorage
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
      
      if (!userEmail) {
        throw new Error('User not authenticated');
      }

      // Ensure the user exists and is linked to the organization
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError || !user) {
        throw new Error('User not found in database');
      }

      // Verify the organization belongs to the user
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', organizationId)
        .eq('user_id', user.id)
        .single();

      if (orgError || !org) {
        throw new Error('Organization not found or access denied');
      }

      // Transform the onboarding form data to match the database schema
      if (!historicalData.salesData || !Array.isArray(historicalData.salesData)) {
        throw new Error('Invalid historical data format: salesData array is required');
      }

      const transformedData = historicalData.salesData.map((sale: any) => ({
        organization_id: organizationId,
        date: sale.date || new Date().toISOString().split('T')[0],
        time: sale.timeOfDay || '12:00',
        total_sales: Number(sale.totalSales) || 0,
        customer_count: Number(sale.customerCount) || 0,
        station_breakdown: this.parseStationSales(sale.stationSales || ''),
        weather_conditions: null, // Not provided in onboarding
        special_events: null, // Not provided in onboarding
        notes: `Onboarding data - ${sale.date || 'Unknown date'}`
      }));

      // Now save the transformed historical data
      const { data, error } = await supabase
        .from('historical_sales_data')
        .insert(transformedData)
        .select();

      if (error) throw new Error(`Failed to save historical data: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Error saving historical data from onboarding:', error);
      throw error;
    }
  }

  // Helper method to parse station sales string into object
  private static parseStationSales(stationSales: string): Record<string, number> {
    if (!stationSales) return {};
    
    try {
      const stations = stationSales.split(',').map(s => s.trim());
      const breakdown: Record<string, number> = {};
      
      stations.forEach(station => {
        if (station.includes(':')) {
          const [name, value] = station.split(':').map(s => s.trim());
          breakdown[name] = parseFloat(value) || 0;
        } else {
          breakdown[station] = 0;
        }
      });
      
      return breakdown;
    } catch (error) {
      console.warn('Failed to parse station sales:', stationSales);
      return {};
    }
  }

  // Create initial performance metrics for staff members
  static async createInitialPerformanceMetrics(organizationId: string) {
    try {
      // Get all staff members for this organization
      const { data: staffMembers, error: staffError } = await supabase
        .from('staff_members')
        .select('id, performance_score')
        .eq('organization_id', organizationId);

      if (staffError) {
        console.error('Error fetching staff members for performance metrics:', staffError);
        return;
      }

      if (!staffMembers || staffMembers.length === 0) {
        console.log('No staff members found for performance metrics');
        return;
      }

      // Create performance metrics for each staff member
      const performanceMetrics = staffMembers.map(staff => ({
        organization_id: organizationId,
        staff_member_id: staff.id,
        date: new Date().toISOString().split('T')[0],
        attendance: true,
        performance_score: staff.performance_score || 80,
        hours_worked: 0,
        overtime_hours: 0,
        notes: 'Initial performance metric from onboarding'
      }));

      const { data, error } = await supabase
        .from('performance_metrics')
        .insert(performanceMetrics)
        .select();

      if (error) {
        console.error('Error creating performance metrics:', error);
      } else {
        console.log(`Created ${data?.length || 0} performance metrics`);
      }

      return data;
    } catch (error) {
      console.error('Error in createInitialPerformanceMetrics:', error);
    }
  }

  // Get historical data for analytics and scheduling
  static async getHistoricalDataForAnalytics(organizationId: string, days: number = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('historical_sales_data')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw new Error(`Failed to fetch historical data: ${error.message}`);
      return data || [];
    } catch (error) {
      console.error('Error fetching historical data for analytics:', error);
      throw error;
    }
  }

  // Get current user's organization ID
  static async getCurrentUserOrganizationId(): Promise<string | null> {
    try {
      if (typeof window === 'undefined') return null;
      
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return null;

      // Get user by email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError || !user) {
        console.error('User not found:', userError);
        return null;
      }

      // Get organization for this user
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (orgError || !org) {
        console.error('Organization not found for user:', orgError);
        return null;
      }

      return org.id;
    } catch (error) {
      console.error('Error getting current user organization ID:', error);
      return null;
    }
  }

  // Schedule operations
  static async createSchedule(data: {
    organization_id: string;
    week_start_date: string;
    shifts: any;
    total_labor_cost: number;
    total_hours: number;
    ai_generated?: boolean;
  }) {
    // First, check if a schedule already exists for this organization and week
    const { data: existingSchedule, error: checkError } = await supabase
      .from('schedules')
      .select('id')
      .eq('organization_id', data.organization_id)
      .eq('week_start_date', data.week_start_date)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing schedule:', checkError);
      throw new Error(`Failed to check existing schedule: ${checkError.message}`);
    }

    let schedule;
    if (existingSchedule) {
      // Update existing schedule
      console.log('Updating existing schedule for week:', data.week_start_date);
      const { data: updatedSchedule, error: updateError } = await supabase
        .from('schedules')
        .update({
          shifts: data.shifts,
          total_labor_cost: data.total_labor_cost,
          total_hours: data.total_hours,
          ai_generated: data.ai_generated,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSchedule.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating schedule:', updateError);
        throw new Error(`Failed to update schedule: ${updateError.message}`);
      }
      schedule = updatedSchedule;
    } else {
      // Create new schedule
      console.log('Creating new schedule for week:', data.week_start_date);
      const { data: newSchedule, error: insertError } = await supabase
        .from('schedules')
        .insert([data])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating schedule:', insertError);
        throw new Error(`Failed to create schedule: ${insertError.message}`);
      }
      schedule = newSchedule;
    }

    return schedule;
  }

  static async getSchedules(organizationId: string) {
    try {
      console.log('🔍 DatabaseService.getSchedules called with organizationId:', organizationId);
      
      const { data: schedules, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('organization_id', organizationId)
        .order('week_start_date', { ascending: false });

      console.log('📊 Supabase response - data:', schedules, 'error:', error);

      if (error) {
        console.error('❌ Error fetching schedules:', error);
        throw new Error(`Failed to fetch schedules: ${error.message}`);
      }

      // Ensure we always return an array
      const result = schedules || [];
      console.log('✅ getSchedules returning:', result);
      return result;
    } catch (error) {
      console.error('❌ getSchedules method error:', error);
      // Return empty array instead of throwing
      return [];
    }
  }

  static async getSchedule(id: string) {
    const { data: schedule, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching schedule:', error);
      throw new Error(`Failed to fetch schedule: ${error.message}`);
    }

    return schedule;
  }

  static async updateSchedule(id: string, updates: any) {
    const { data: schedule, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating schedule:', error);
      throw new Error(`Failed to update schedule: ${error.message}`);
    }

    return schedule;
  }

  static async deleteSchedule(id: string) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting schedule:', error);
      throw new Error(`Failed to delete schedule: ${error.message}`);
    }

    return true;
  }

  // Get staff with availability and conflicts for scheduling
  static async getStaffForScheduling(organizationId: string) {
    const { data: staff, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error fetching staff for scheduling:', error);
      throw new Error(`Failed to fetch staff: ${error.message}`);
    }

    return staff || [];
  }

  // Get historical data for AI scheduling optimization
  static async getHistoricalDataForScheduling(organizationId: string, timeRange: string) {
    // Convert relative time range to actual dates
    let startDate: string;
    let endDate: string = new Date().toISOString().split('T')[0]; // Today
    
    if (timeRange === '30d' || timeRange === '30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split('T')[0];
    } else if (timeRange === '7d' || timeRange === '7') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      startDate = sevenDaysAgo.toISOString().split('T')[0];
    } else if (timeRange === '90d' || timeRange === '90') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      startDate = ninetyDaysAgo.toISOString().split('T')[0];
    } else {
      // Default to 30 days if invalid time range
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split('T')[0];
    }

    const { data: historical, error } = await supabase
      .from('historical_sales_data')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching historical data:', error);
      throw new Error(`Failed to fetch historical data: ${error.message}`);
    }

    return historical || [];
  }

}
