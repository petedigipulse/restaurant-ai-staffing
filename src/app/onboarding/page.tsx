"use client";
import { useState } from "react";
import Link from "next/link";

type OnboardingStep = 'restaurant' | 'staff' | 'business-rules' | 'historical-data' | 'goals' | 'complete';

import RestaurantStep from "./components/RestaurantStep";
import StaffStep from "./components/StaffStep";
import BusinessRulesStep from "./components/BusinessRulesStep";
import HistoricalDataStep from "./components/HistoricalDataStep";
import GoalsStep from "./components/GoalsStep";
import CompleteStep from "./components/CompleteStep";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('restaurant');
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
    staff: [],
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
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as OnboardingStep);
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
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
