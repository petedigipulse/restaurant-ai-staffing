"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useSession, SessionProvider } from "next-auth/react";
import { DatabaseService } from "@/lib/services/database";
import { TransformationService } from "@/lib/services/transformation";
import { UnifiedBusinessData } from "@/lib/types/unified";

type OnboardingStep = 'restaurant' | 'staff' | 'business-rules' | 'historical-data' | 'goals' | 'complete';

// Legacy interface for backward compatibility during transition
interface OnboardingStaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  hourlyWage: number;
  guaranteedHours: number;
  employmentType: 'full-time' | 'part-time' | 'casual';
  performanceScore: number;
  stations: string[];
  availability: {
    monday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    tuesday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    wednesday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    thursday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    friday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    saturday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
    sunday: { available: boolean; startTime?: string; endTime?: string; preferred: boolean };
  };
  phone: string;
  emergencyContact: string;
  startDate: string;
}

import RestaurantStep from "./components/RestaurantStep";
import StaffStep from "./components/StaffStep";
import BusinessRulesStep from "./components/BusinessRulesStep";
import HistoricalDataStep from "./components/HistoricalDataStep";
import GoalsStep from "./components/GoalsStep";
import CompleteStep from "./components/CompleteStep";

function OnboardingPageContent() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('restaurant');
  const [isLoading, setIsLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [unifiedData, setUnifiedData] = useState<UnifiedBusinessData>({
    organization: {
      name: '',
      type: 'restaurant',
      timezone: 'America/New_York',
      operating_hours: {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '23:00', closed: false },
        saturday: { open: '09:00', close: '23:00', closed: false },
        sunday: { open: '10:00', close: '21:00', closed: false }
      }
    },
    staff: [],
    business_rules: {
      min_staffing: { kitchen: 2, front_of_house: 3, bar: 1, host: 1 },
      max_overtime: 40,
      target_labor_cost: 25,
      break_requirements: { meal: 30, rest: 10 },
      consecutive_days: 6,
      min_shift_length: 4,
      max_shift_length: 12,
      weekend_rotation: true,
      holiday_pay: true,
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
      average_daily_sales: 0,
      peak_hours: [],
      seasonal_patterns: [],
      sales_data: [],
      customer_patterns: {
        weekday: 0,
        weekend: 0,
        lunch: 0,
        dinner: 0
      }
    },
    goals: {
      priority: 'cost-optimization',
      staff_satisfaction: 8,
      customer_service: 9,
      cost_optimization: 8,
      flexibility: 7,
      training: 6,
      special_events: [],
      scheduling_preferences: []
    }
  });

  // Legacy form data for backward compatibility during transition
  const [formData, setFormData] = useState({
    restaurant: {
      name: '',
      type: '',
      timezone: '',
      operatingHours: {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '23:00', closed: false },
        saturday: { open: '09:00', close: '23:00', closed: false },
        sunday: { open: '10:00', close: '21:00', closed: false }
      }
    },
    staff: [] as OnboardingStaffMember[],
    businessRules: {
      minStaffing: { kitchen: 2, foh: 3, bar: 1 },
      maxOvertime: 40,
      breakRequirements: { meal: 30, rest: 10 },
      targetLaborCost: 25,
      consecutiveDays: 6,
      minShiftLength: 4,
      maxShiftLength: 12,
      weekendRotation: true,
      holidayPay: true
    },
    historicalData: {
      averageDailySales: 0,
      peakHours: [],
      seasonalPatterns: [],
      salesData: [],
      customerPatterns: {
        weekday: 0,
        weekend: 0,
        lunch: 0,
        dinner: 0
      }
    },
    goals: {
      priority: 'cost-optimization',
      staffSatisfaction: 8,
      customerService: 9,
      costOptimization: 8,
      flexibility: 7,
      training: 6,
      specialEvents: [],
      schedulingPreferences: []
    }
  });

  const steps = [
    { id: 'restaurant', title: 'Restaurant Basics', description: 'Basic information about your restaurant' },
    { id: 'staff', title: 'Staff Setup', description: 'Add your team members and their details' },
    { id: 'business-rules', title: 'Business Rules', description: 'Set constraints and requirements' },
    { id: 'historical-data', title: 'Historical Data', description: 'Import sales and customer data' },
    { id: 'goals', title: 'Goals & Preferences', description: 'Define your scheduling priorities' },
    { id: 'complete', title: 'Complete Setup', description: 'Review and finish setup' }
  ];

  // Load existing data when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      if (!session?.user?.email) return;

      try {
        const orgId = await DatabaseService.getCurrentUserOrganizationId();
        if (orgId) {
          setOrganizationId(orgId);
          await loadAndTransformData(orgId);
        }
      } catch (error) {
        console.log('No existing organization found, starting fresh onboarding');
      }
    };

    loadExistingData();
  }, [session]);

  const loadAndTransformData = async (orgId: string) => {
    try {
      // Load organization data
      const organization = await DatabaseService.getOrganizationById(orgId);
      if (organization) {
        const transformedOrg = TransformationService.databaseToUnified({ organization });
        if (transformedOrg.organization) {
          setUnifiedData(prev => ({
            ...prev,
            organization: { ...prev.organization, ...transformedOrg.organization }
          }));
        }
      }

      // Load business rules
      const businessRules = await DatabaseService.getBusinessRules(orgId);
      if (businessRules) {
        const transformedRules = TransformationService.databaseToUnified({ business_rules: businessRules });
        if (transformedRules.business_rules) {
          setUnifiedData(prev => ({
            ...prev,
            business_rules: { ...prev.business_rules, ...transformedRules.business_rules }
          }));
        }
      }

      // Load staff data
      const staff = await DatabaseService.getStaffMembers(orgId);
      if (staff && staff.length > 0) {
        const transformedStaff = staff.map(member => ({
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          role: member.role,
          hourly_wage: member.hourly_wage,
          guaranteed_hours: member.guaranteed_hours,
          employment_type: member.employment_type,
          performance_score: member.performance_score,
          stations: member.stations,
          availability: member.availability,
          contact_info: member.contact_info,
          start_date: member.start_date,
          status: member.status
        }));
        
        setUnifiedData(prev => ({
          ...prev,
          staff: transformedStaff
        }));
      }

      // Update legacy form data for backward compatibility
      updateLegacyFormData();
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const updateLegacyFormData = () => {
    // Transform unified data back to legacy format for existing components
    const legacyData = TransformationService.unifiedToOnboarding(unifiedData);
    setFormData(legacyData);
  };

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => {
      if (section === 'staff') {
        // For staff, replace the entire array
        return { ...prev, [section]: data };
      } else {
        // For other sections, merge the data
        return { ...prev, [section]: { ...prev[section as keyof typeof prev], ...data } };
      }
    });

    // Also update unified data structure
    setUnifiedData(prev => {
      const updatedUnified = TransformationService.onboardingToUnified({
        ...formData,
        [section]: section === 'staff' ? data : { ...formData[section as keyof typeof formData], ...data }
      });
      return updatedUnified;
    });
  };

  const nextStep = async () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    console.log('🔄 nextStep called');
    console.log('📊 currentStep:', currentStep);
    console.log('📊 currentIndex:', currentIndex);
    
    // Save data to database before moving to next step
    if (currentStep === 'restaurant') {
      console.log('💾 Saving restaurant data...');
      await saveRestaurantData();
    } else if (currentStep === 'staff') {
      console.log('💾 Saving staff data...');
      await saveStaffData();
    } else if (currentStep === 'historical-data') {
      console.log('💾 Saving historical data...');
      await saveHistoricalData();
    } else if (currentStep === 'business-rules') {
      console.log('💾 Saving business rules...');
      await saveBusinessRulesData();
    }
    
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      console.log(`➡️ Moving from ${currentStep} to ${nextStepId}`);
      setCurrentStep(nextStepId as OnboardingStep);
    }
  };

  const saveRestaurantData = async () => {
    try {
      setIsLoading(true);
      
      // Get the current user's email from the session or localStorage
      const userEmail = localStorage.getItem('userEmail') || 'user@restaurant.com';
      const userName = userEmail.split('@')[0];
      
      console.log('Creating organization with user:', { userEmail, userName });
      
      // Use unified data structure
      const orgData = unifiedData.organization;
      
      // Create user and organization using the database function
      const org = await DatabaseService.createOrganizationWithUser({
        name: orgData.name,
        type: orgData.type,
        timezone: orgData.timezone,
        operating_hours: {
          ...orgData.operating_hours,
          address: orgData.address,
          phone: orgData.phone,
          email: orgData.email,
          cuisine_type: orgData.cuisine_type,
          capacity: orgData.capacity
        },
        user_email: userEmail,
        user_name: userName
      });
      
      setOrganizationId(org.id);
      console.log('Restaurant data saved successfully:', org.id);
      
      // Verify the organization was created by trying to fetch it
      await DatabaseService.getOrganizationById(org.id);
      console.log('Organization verified in database');
      
    } catch (error) {
      console.error('Error saving restaurant data:', error);
      throw error; // Don't fall back to mock ID - let the error propagate
    } finally {
      setIsLoading(false);
    }
  };

  const saveStaffData = async () => {
    try {
      setIsLoading(true);
      if (!organizationId) {
        console.error('No organization ID available');
        return;
      }
      
      // Verify the organization exists before creating staff
      console.log('Verifying organization exists before creating staff...');
      const org = await DatabaseService.getOrganizationById(organizationId);
      if (!org) {
        throw new Error('Organization not found in database');
      }
      console.log('Organization verified, proceeding with staff creation');
      
      // Create staff members one by one since createStaffMember only handles single records
      for (let i = 0; i < formData.staff.length; i++) {
        const staff = formData.staff[i];
        console.log('Processing staff member:', staff);
        console.log('Staff email:', staff.email);
        
        // Generate unique email if none provided
        const uniqueEmail = staff.email || `staff-${i + 1}-${Date.now()}@example.com`;
        
        // Debug logging to see the exact values
        console.log('🔍 Staff member data before transformation:', {
          firstName: staff.firstName,
          lastName: staff.lastName,
          startDate: staff.startDate,
          emergencyContact: staff.emergencyContact,
          phone: staff.phone
        });
        
        const staffData = {
          organization_id: organizationId,
          first_name: staff.firstName || '',
          last_name: staff.lastName || '',
          email: uniqueEmail,
          role: staff.role || 'Staff',
          hourly_wage: staff.hourlyWage || 0,
          guaranteed_hours: staff.guaranteedHours || 0,
          employment_type: staff.employmentType || 'part-time',
          performance_score: staff.performanceScore || 80,
          stations: staff.stations || [],
          availability: staff.availability || {},
          contact_info: {
            phone: staff.phone || '',
            emergency_contact: staff.emergencyContact || ''
          },
          start_date: staff.startDate || new Date().toISOString().split('T')[0],
          status: 'active' as const
        };
        
        console.log('🔍 Staff data after transformation:', staffData);
        console.log('🔍 start_date value being sent:', staffData.start_date);
        console.log('🔍 emergency_contact value being sent:', staffData.contact_info.emergency_contact);
        console.log('Sending staff data:', staffData);
        await DatabaseService.createStaffMember(staffData);
      }
      console.log('Staff data saved successfully');
    } catch (error) {
      console.error('Error saving staff data:', error);
      throw error; // Let the error propagate to show user
    } finally {
      setIsLoading(false);
    }
  };

  const saveHistoricalData = async () => {
    try {
      console.log('🔄 saveHistoricalData called');
      console.log('📊 organizationId:', organizationId);
      console.log('📊 formData.historicalData:', formData.historicalData);
      
      setIsLoading(true);
      if (!organizationId) {
        console.error('❌ No organization ID available');
        return;
      }
      
      if (!formData.historicalData || !formData.historicalData.salesData || formData.historicalData.salesData.length === 0) {
        console.log('⚠️ No historical data to save');
        return;
      }
      
      console.log(`💾 Saving ${formData.historicalData.salesData.length} historical data records...`);
      
      // Save historical data to database
      const result = await DatabaseService.saveHistoricalDataFromOnboarding(organizationId, formData.historicalData);
      console.log('✅ Historical data saved successfully to database:', result);
      
      // Create initial performance metrics for staff members
      console.log('📊 Creating initial performance metrics...');
      await DatabaseService.createInitialPerformanceMetrics(organizationId);
      console.log('✅ Initial performance metrics created');
    } catch (error) {
      console.error('❌ Error saving historical data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBusinessRulesData = async () => {
    try {
      setIsLoading(true);
      if (!organizationId) {
        console.error('No organization ID available');
        return;
      }
      
      // Use unified data structure
      const businessRulesData = unifiedData.business_rules;
      
      // Transform to database format
      const dbFormat = {
        organization_id: organizationId,
        min_staffing_requirements: {
          min_staff_per_shift: Math.max(...Object.values(businessRulesData.min_staffing)),
          station_requirements: businessRulesData.min_staffing
        },
        labor_cost_management: {
          max_hours_per_week: businessRulesData.max_overtime,
          target_labor_cost: businessRulesData.target_labor_cost,
          overtime_threshold: businessRulesData.max_overtime
        },
        break_requirements: {
          break_requirements: `${businessRulesData.break_requirements.meal}-minute meal break, ${businessRulesData.break_requirements.rest}-minute rest break`,
          meal_break_minutes: businessRulesData.break_requirements.meal,
          rest_break_minutes: businessRulesData.break_requirements.rest
        },
        shift_constraints: {
          consecutive_days_limit: businessRulesData.consecutive_days,
          preferred_shift_length: businessRulesData.min_shift_length,
          max_shift_length: businessRulesData.max_shift_length,
          weekend_rotation: businessRulesData.weekend_rotation,
          holiday_pay: businessRulesData.holiday_pay
        },
        additional_policies: businessRulesData.additional_policies
      };
      
      console.log('Saving business rules:', dbFormat);
      
      // Check if business rules already exist
      const existingRules = await DatabaseService.getBusinessRules(organizationId);
      
      if (existingRules) {
        // Update existing rules
        await DatabaseService.updateBusinessRulesByOrganization(organizationId, dbFormat);
        console.log('Business rules updated successfully');
      } else {
        // Create new rules
        await DatabaseService.createBusinessRules(dbFormat);
        console.log('Business rules created successfully');
      }
      
    } catch (error) {
      console.error('Error saving business rules data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as OnboardingStep);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'restaurant':
        return <RestaurantStep data={formData.restaurant} updateData={(data) => updateFormData('restaurant', data)} />;
      case 'staff':
        return <StaffStep data={formData.staff} updateData={(data) => updateFormData('staff', data)} />;
      case 'business-rules':
        return <BusinessRulesStep data={formData.businessRules} updateData={(data) => updateFormData('businessRules', data)} />;
      case 'historical-data':
        return <HistoricalDataStep data={formData.historicalData} updateData={(data) => updateFormData('historicalData', data)} />;
      case 'goals':
        return <GoalsStep data={formData.goals} updateData={(data) => updateFormData('goals', data)} />;
      case 'complete':
        return <CompleteStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <span className="font-semibold text-lg">Restaurant Staffing</span>
            </Link>
            <div className="text-sm text-muted-foreground">
              Setup Wizard
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  steps.findIndex(s => s.id === currentStep) >= index 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    steps.findIndex(s => s.id === currentStep) > index ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{steps.find(s => s.id === currentStep)?.title}</h2>
            <p className="text-muted-foreground">{steps.find(s => s.id === currentStep)?.description}</p>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {renderStepContent()}
      </main>

      {/* Navigation */}
      <div className="border-t bg-background/95">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 'restaurant'}
              className="px-4 py-2 border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
                               <div className="text-sm text-muted-foreground">
                     Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
                   </div>

            {currentStep === 'complete' ? (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={nextStep}
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <SessionProvider>
      <OnboardingPageContent />
    </SessionProvider>
  );
}
