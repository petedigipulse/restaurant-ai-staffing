import { UnifiedBusinessData, UnifiedStaffMember, UnifiedBusinessRules } from '../types/unified';

/**
 * Transformation service to convert data between different formats
 * This ensures consistency between onboarding wizard and Business Rules pages
 */
export class TransformationService {
  
  /**
   * Convert onboarding data to unified format
   */
  static onboardingToUnified(onboardingData: any): UnifiedBusinessData {
    return {
      organization: {
        name: onboardingData.restaurant?.name || '',
        type: onboardingData.restaurant?.type || 'restaurant',
        timezone: onboardingData.restaurant?.timezone || 'America/New_York',
        operating_hours: onboardingData.restaurant?.operatingHours || {
          monday: { open: '09:00', close: '22:00', closed: false },
          tuesday: { open: '09:00', close: '22:00', closed: false },
          wednesday: { open: '09:00', close: '22:00', closed: false },
          thursday: { open: '09:00', close: '22:00', closed: false },
          friday: { open: '09:00', close: '23:00', closed: false },
          saturday: { open: '09:00', close: '23:00', closed: false },
          sunday: { open: '10:00', close: '21:00', closed: false }
        }
      },
      
      staff: (onboardingData.staff || []).map((staff: any) => ({
        first_name: staff.firstName || '',
        last_name: staff.lastName || '',
        email: staff.email || '',
        role: staff.role || 'Staff',
        hourly_wage: staff.hourlyWage || 25,
        guaranteed_hours: staff.guaranteedHours || 0,
        employment_type: staff.employmentType || 'part-time',
        performance_score: staff.performanceScore || 80,
        stations: staff.stations || [],
        availability: this.transformAvailability(staff.availability),
        contact_info: {
          phone: staff.phone || '',
          emergency_contact: staff.emergencyContact || ''
        },
        start_date: staff.startDate || new Date().toISOString().split('T')[0],
        status: 'active' as const
      })),
      
      business_rules: {
        min_staffing: {
          kitchen: onboardingData.businessRules?.minStaffing?.kitchen || 2,
          front_of_house: onboardingData.businessRules?.minStaffing?.foh || 3,
          bar: onboardingData.businessRules?.minStaffing?.bar || 1,
          host: 1
        },
        max_overtime: onboardingData.businessRules?.maxOvertime || 40,
        target_labor_cost: onboardingData.businessRules?.targetLaborCost || 25,
        break_requirements: {
          meal: onboardingData.businessRules?.breakRequirements?.meal || 30,
          rest: onboardingData.businessRules?.breakRequirements?.rest || 10
        },
        consecutive_days: onboardingData.businessRules?.consecutiveDays || 6,
        min_shift_length: onboardingData.businessRules?.minShiftLength || 4,
        max_shift_length: onboardingData.businessRules?.maxShiftLength || 12,
        weekend_rotation: onboardingData.businessRules?.weekendRotation || true,
        holiday_pay: onboardingData.businessRules?.holidayPay || true,
        additional_policies: {
          staffing_guidelines: [
            'Ensure adequate coverage for all stations during peak hours',
            'Balance workload across staff members',
            'Consider staff performance and experience levels'
          ],
          cost_optimization: [
            'Monitor overtime costs and minimize excessive hours',
            'Balance staff costs with service quality'
          ],
          compliance_requirements: [
            'Follow local labor laws and regulations',
            'Ensure proper break and rest periods'
          ],
          custom_policies: []
        }
      },
      
      historical_data: {
        average_daily_sales: onboardingData.historicalData?.averageDailySales || 0,
        peak_hours: onboardingData.historicalData?.peakHours || [],
        seasonal_patterns: onboardingData.historicalData?.seasonalPatterns || [],
        sales_data: onboardingData.historicalData?.salesData || [],
        customer_patterns: {
          weekday: onboardingData.historicalData?.customerPatterns?.weekday || 0,
          weekend: onboardingData.historicalData?.customerPatterns?.weekend || 0,
          lunch: onboardingData.historicalData?.customerPatterns?.lunch || 0,
          dinner: onboardingData.historicalData?.customerPatterns?.dinner || 0
        }
      },
      
      goals: {
        priority: onboardingData.goals?.priority || 'cost-optimization',
        staff_satisfaction: onboardingData.goals?.staffSatisfaction || 8,
        customer_service: onboardingData.goals?.customerService || 9,
        cost_optimization: onboardingData.goals?.costOptimization || 8,
        flexibility: onboardingData.goals?.flexibility || 7,
        training: onboardingData.goals?.training || 6,
        special_events: onboardingData.goals?.specialEvents || [],
        scheduling_preferences: onboardingData.goals?.schedulingPreferences || []
      }
    };
  }

  /**
   * Convert unified data to onboarding format
   */
  static unifiedToOnboarding(unifiedData: UnifiedBusinessData): any {
    return {
      restaurant: {
        name: unifiedData.organization.name,
        type: unifiedData.organization.type,
        timezone: unifiedData.organization.timezone,
        operatingHours: unifiedData.organization.operating_hours
      },
      
      staff: unifiedData.staff.map(staff => ({
        firstName: staff.first_name,
        lastName: staff.last_name,
        email: staff.email,
        role: staff.role,
        hourlyWage: staff.hourly_wage,
        guaranteedHours: staff.guaranteed_hours,
        employmentType: staff.employment_type,
        performanceScore: staff.performance_score,
        stations: staff.stations,
        availability: this.reverseTransformAvailability(staff.availability),
        phone: staff.contact_info.phone,
        emergencyContact: staff.contact_info.emergency_contact,
        startDate: staff.start_date
      })),
      
      businessRules: {
        minStaffing: {
          kitchen: unifiedData.business_rules.min_staffing.kitchen,
          foh: unifiedData.business_rules.min_staffing.front_of_house,
          bar: unifiedData.business_rules.min_staffing.bar
        },
        maxOvertime: unifiedData.business_rules.max_overtime,
        breakRequirements: {
          meal: unifiedData.business_rules.break_requirements.meal,
          rest: unifiedData.business_rules.break_requirements.rest
        },
        targetLaborCost: unifiedData.business_rules.target_labor_cost,
        consecutiveDays: unifiedData.business_rules.consecutive_days,
        minShiftLength: unifiedData.business_rules.min_shift_length,
        maxShiftLength: unifiedData.business_rules.max_shift_length,
        weekendRotation: unifiedData.business_rules.weekend_rotation,
        holidayPay: unifiedData.business_rules.holiday_pay
      },
      
      historicalData: {
        averageDailySales: unifiedData.historical_data.average_daily_sales,
        peakHours: unifiedData.historical_data.peak_hours,
        seasonalPatterns: unifiedData.historical_data.seasonal_patterns,
        salesData: unifiedData.historical_data.sales_data,
        customerPatterns: unifiedData.historical_data.customer_patterns
      },
      
      goals: {
        priority: unifiedData.goals.priority,
        staffSatisfaction: unifiedData.goals.staff_satisfaction,
        customerService: unifiedData.goals.customer_service,
        costOptimization: unifiedData.goals.cost_optimization,
        flexibility: unifiedData.goals.flexibility,
        training: unifiedData.goals.training,
        specialEvents: unifiedData.goals.special_events,
        schedulingPreferences: unifiedData.goals.scheduling_preferences
      }
    };
  }

  /**
   * Convert unified data to database format
   */
  static unifiedToDatabase(unifiedData: UnifiedBusinessData, organizationId: string): any {
    return {
      organization: {
        name: unifiedData.organization.name,
        type: unifiedData.organization.type,
        timezone: unifiedData.organization.timezone,
        operating_hours: {
          ...unifiedData.organization.operating_hours,
          address: unifiedData.organization.address,
          phone: unifiedData.organization.phone,
          email: unifiedData.organization.email,
          cuisine_type: unifiedData.organization.cuisine_type,
          capacity: unifiedData.organization.capacity
        }
      },
      
      business_rules: {
        organization_id: organizationId,
        min_staffing_requirements: {
          min_staff_per_shift: Math.max(...Object.values(unifiedData.business_rules.min_staffing)),
          station_requirements: unifiedData.business_rules.min_staffing
        },
        labor_cost_management: {
          max_hours_per_week: unifiedData.business_rules.max_overtime,
          target_labor_cost: unifiedData.business_rules.target_labor_cost,
          overtime_threshold: unifiedData.business_rules.max_overtime
        },
        break_requirements: {
          break_requirements: `${unifiedData.business_rules.break_requirements.meal}-minute meal break, ${unifiedData.business_rules.break_requirements.rest}-minute rest break`,
          meal_break_minutes: unifiedData.business_rules.break_requirements.meal,
          rest_break_minutes: unifiedData.business_rules.break_requirements.rest
        },
        shift_constraints: {
          consecutive_days_limit: unifiedData.business_rules.consecutive_days,
          preferred_shift_length: unifiedData.business_rules.min_shift_length,
          max_shift_length: unifiedData.business_rules.max_shift_length,
          weekend_rotation: unifiedData.business_rules.weekend_rotation,
          holiday_pay: unifiedData.business_rules.holiday_pay
        },
        additional_policies: unifiedData.business_rules.additional_policies
      }
    };
  }

  /**
   * Convert database data to unified format
   */
  static databaseToUnified(dbData: any): Partial<UnifiedBusinessData> {
    const result: Partial<UnifiedBusinessData> = {};
    
    if (dbData.organization) {
      result.organization = {
        id: dbData.organization.id,
        name: dbData.organization.name,
        type: dbData.organization.type,
        timezone: dbData.organization.timezone,
        operating_hours: dbData.organization.operating_hours,
        address: dbData.organization.operating_hours?.address,
        phone: dbData.organization.operating_hours?.phone,
        email: dbData.organization.operating_hours?.email,
        cuisine_type: dbData.organization.operating_hours?.cuisine_type,
        capacity: dbData.organization.operating_hours?.capacity
      };
    }
    
    if (dbData.business_rules) {
      result.business_rules = {
        min_staffing: {
          kitchen: dbData.business_rules.min_staffing_requirements?.station_requirements?.kitchen || 2,
          front_of_house: dbData.business_rules.min_staffing_requirements?.station_requirements?.front_of_house || 3,
          bar: dbData.business_rules.min_staffing_requirements?.station_requirements?.bar || 1,
          host: dbData.business_rules.min_staffing_requirements?.station_requirements?.host || 1
        },
        max_overtime: dbData.business_rules.labor_cost_management?.max_hours_per_week || 40,
        target_labor_cost: dbData.business_rules.labor_cost_management?.target_labor_cost || 25,
        break_requirements: {
          meal: dbData.business_rules.break_requirements?.meal_break_minutes || 30,
          rest: dbData.business_rules.break_requirements?.rest_break_minutes || 10
        },
        consecutive_days: dbData.business_rules.shift_constraints?.consecutive_days_limit || 6,
        min_shift_length: dbData.business_rules.shift_constraints?.preferred_shift_length || 4,
        max_shift_length: dbData.business_rules.shift_constraints?.max_shift_length || 12,
        weekend_rotation: dbData.business_rules.shift_constraints?.weekend_rotation || true,
        holiday_pay: dbData.business_rules.shift_constraints?.holiday_pay || true,
        additional_policies: dbData.business_rules.additional_policies || {
          staffing_guidelines: [],
          cost_optimization: [],
          compliance_requirements: [],
          custom_policies: []
        }
      };
    }
    
    return result;
  }

  /**
   * Transform availability from onboarding format to unified format
   */
  private static transformAvailability(availability: any): any {
    if (!availability) return {};
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const result: any = {};
    
    days.forEach(day => {
      if (availability[day]) {
        result[day] = {
          available: availability[day].available || false,
          start_time: availability[day].startTime,
          end_time: availability[day].endTime,
          preferred: availability[day].preferred || false
        };
      } else {
        result[day] = {
          available: false,
          start_time: '09:00',
          end_time: '17:00',
          preferred: false
        };
      }
    });
    
    return result;
  }

  /**
   * Reverse transform availability from unified format to onboarding format
   */
  private static reverseTransformAvailability(availability: any): any {
    if (!availability) return {};
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const result: any = {};
    
    days.forEach(day => {
      if (availability[day]) {
        result[day] = {
          available: availability[day].available || false,
          startTime: availability[day].start_time,
          endTime: availability[day].end_time,
          preferred: availability[day].preferred || false
        };
      } else {
        result[day] = {
          available: false,
          startTime: '09:00',
          endTime: '17:00',
          preferred: false
        };
      }
    });
    
    return result;
  }
}
