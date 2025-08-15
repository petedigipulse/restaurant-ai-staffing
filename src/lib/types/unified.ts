// Unified types for business data - single source of truth
// This file bridges the gap between onboarding wizard and Business Rules pages

export interface UnifiedBusinessData {
  // Organization/Business Information
  organization: {
    id?: string;
    name: string;
    type: string;
    timezone: string;
    operating_hours: OperatingHours;
    address?: string;
    phone?: string;
    email?: string;
    cuisine_type?: string;
    capacity?: number;
  };

  // Staff Management
  staff: UnifiedStaffMember[];

  // Business Rules & Policies
  business_rules: UnifiedBusinessRules;

  // Historical Data
  historical_data: UnifiedHistoricalData;

  // Goals & Preferences
  goals: UnifiedGoals;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

export interface UnifiedStaffMember {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  hourly_wage: number;
  guaranteed_hours: number;
  employment_type: 'full-time' | 'part-time' | 'casual';
  performance_score: number;
  stations: string[];
  availability: StaffAvailability;
  contact_info: {
    phone: string;
    emergency_contact: string;
  };
  start_date: string;
  status: 'active' | 'inactive' | 'terminated';
}

export interface StaffAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface DayAvailability {
  available: boolean;
  start_time?: string;
  end_time?: string;
  preferred: boolean;
}

export interface UnifiedBusinessRules {
  // Staffing Requirements
  min_staffing: {
    kitchen: number;
    front_of_house: number;
    bar: number;
    host: number;
    [key: string]: number; // Allow custom stations
  };

  // Labor Management
  max_overtime: number;
  target_labor_cost: number;
  break_requirements: {
    meal: number; // minutes
    rest: number; // minutes
  };

  // Shift Constraints
  consecutive_days: number;
  min_shift_length: number;
  max_shift_length: number;
  weekend_rotation: boolean;
  holiday_pay: boolean;

  // Additional Policies
  additional_policies: {
    staffing_guidelines: string[];
    cost_optimization: string[];
    compliance_requirements: string[];
    custom_policies: string[];
  };
}

export interface UnifiedHistoricalData {
  average_daily_sales: number;
  peak_hours: string[];
  seasonal_patterns: string[];
  sales_data: any[];
  customer_patterns: {
    weekday: number;
    weekend: number;
    lunch: number;
    dinner: number;
  };
}

export interface UnifiedGoals {
  priority: 'cost-optimization' | 'staff-satisfaction' | 'customer-service' | 'flexibility';
  staff_satisfaction: number; // 1-10 scale
  customer_service: number; // 1-10 scale
  cost_optimization: number; // 1-10 scale
  flexibility: number; // 1-10 scale
  training: number; // 1-10 scale
  special_events: string[];
  scheduling_preferences: string[];
}

// Transformation interfaces for backward compatibility
export interface OnboardingToUnified {
  onboarding: any;
  unified: UnifiedBusinessData;
}

export interface UnifiedToDatabase {
  unified: UnifiedBusinessData;
  database: any;
}

// Utility types for form handling
export type FormSection = 'organization' | 'staff' | 'business_rules' | 'historical_data' | 'goals';

export interface FormUpdate {
  section: FormSection;
  data: Partial<UnifiedBusinessData[FormSection]>;
}
