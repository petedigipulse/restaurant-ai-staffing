import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          type: string
          timezone: string
          operating_hours: Json
          created_at: string
          updated_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          timezone: string
          operating_hours: Json
          created_at?: string
          updated_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          timezone?: string
          operating_hours?: Json
          created_at?: string
          updated_at?: string
          owner_id?: string
        }
      }
      staff_members: {
        Row: {
          id: string
          organization_id: string
          first_name: string
          last_name: string
          email: string
          role: string
          hourly_wage: number
          guaranteed_hours: number
          employment_type: 'full-time' | 'part-time' | 'casual'
          performance_score: number
          stations: string[]
          availability: Json
          contact_info: Json
          start_date: string
          status: 'active' | 'inactive' | 'on-leave'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          first_name: string
          last_name: string
          email: string
          role: string
          hourly_wage: number
          guaranteed_hours: number
          employment_type: 'full-time' | 'part-time' | 'casual'
          performance_score: number
          stations: string[]
          availability: Json
          contact_info: Json
          start_date: string
          status?: 'active' | 'inactive' | 'on-leave'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          first_name?: string
          last_name?: string
          email?: string
          role?: string
          hourly_wage?: number
          guaranteed_hours?: number
          employment_type?: 'full-time' | 'part-time' | 'casual'
          performance_score?: number
          stations?: string[]
          availability?: Json
          contact_info?: Json
          start_date?: string
          status?: 'active' | 'inactive' | 'on-leave'
          created_at?: string
          updated_at?: string
        }
      }
      business_rules: {
        Row: {
          id: string
          organization_id: string
          min_staffing_requirements: Json
          labor_cost_management: Json
          break_requirements: Json
          shift_constraints: Json
          additional_policies: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          min_staffing_requirements: Json
          labor_cost_management: Json
          break_requirements: Json
          shift_constraints: Json
          additional_policies: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          min_staffing_requirements?: Json
          labor_cost_management?: Json
          break_requirements?: Json
          shift_constraints?: Json
          additional_policies?: Json
          created_at?: string
          updated_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          organization_id: string
          week_start_date: string
          shifts: Json
          total_labor_cost: number
          total_hours: number
          ai_generated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          week_start_date: string
          shifts: Json
          total_labor_cost: number
          total_hours: number
          ai_generated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          week_start_date?: string
          shifts?: Json
          total_labor_cost?: number
          total_hours?: number
          ai_generated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      performance_metrics: {
        Row: {
          id: string
          organization_id: string
          staff_member_id: string
          date: string
          attendance: boolean
          performance_score: number
          hours_worked: number
          overtime_hours: number
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          staff_member_id: string
          date: string
          attendance: boolean
          performance_score: number
          hours_worked: number
          overtime_hours: number
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          staff_member_id?: string
          date?: string
          attendance?: boolean
          performance_score?: number
          hours_worked?: number
          overtime_hours?: number
          notes?: string
          created_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          organization_id: string
          type: 'pos' | 'accounting' | 'hr' | 'weather'
          name: string
          config: Json
          is_active: boolean
          last_sync: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          type: 'pos' | 'accounting' | 'hr' | 'weather'
          name: string
          config: Json
          is_active?: boolean
          last_sync?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          type?: 'pos' | 'accounting' | 'hr' | 'weather'
          name?: string
          config?: Json
          is_active?: boolean
          last_sync?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Organization = Database['public']['Tables']['organizations']['Row']
export type StaffMember = Database['public']['Tables']['staff_members']['Row']
export type BusinessRules = Database['public']['Tables']['business_rules']['Row']
export type Schedule = Database['public']['Tables']['schedules']['Row']
export type PerformanceMetric = Database['public']['Tables']['performance_metrics']['Row']
export type Integration = Database['public']['Tables']['integrations']['Row']
