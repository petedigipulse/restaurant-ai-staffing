'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIProgressTrackerProps {
  isVisible: boolean;
  onComplete: () => void;
}

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: string;
}

export default function AIProgressTracker({ isVisible, onComplete }: AIProgressTrackerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    {
      id: 'data-collection',
      title: 'Data Collection',
      description: 'Gathering staff, historical data, and business rules',
      status: 'pending'
    },
    {
      id: 'weather-analysis',
      title: 'Weather Analysis',
      description: 'Analyzing weather forecasts for demand impact',
      status: 'pending'
    },
    {
      id: 'ai-optimization',
      title: 'AI Optimization',
      description: 'Running advanced algorithms for optimal scheduling',
      status: 'pending'
    },
    {
      id: 'constraint-validation',
      title: 'Constraint Validation',
      description: 'Ensuring schedule meets business rules and requirements',
      status: 'pending'
    },
    {
      id: 'cost-calculation',
      title: 'Cost Calculation',
      description: 'Computing labor costs and efficiency metrics',
      status: 'pending'
    },
    {
      id: 'finalization',
      title: 'Schedule Finalization',
      description: 'Preparing final optimized schedule',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (!isVisible) return;

    // Simulate AI progress steps
    const stepIntervals = [1000, 2000, 8000, 1500, 1000, 500]; // Different timing for each step
    
    progressSteps.forEach((step, index) => {
      setTimeout(() => {
        setProgressSteps(prev => 
          prev.map((s, i) => 
            i === index 
              ? { ...s, status: 'active' as const }
              : s
          )
        );
        setCurrentStep(index);
      }, stepIntervals.slice(0, index + 1).reduce((a, b) => a + b, 0));
    });

    // Complete all steps
    const totalTime = stepIntervals.reduce((a, b) => a + b, 0);
    setTimeout(() => {
      setProgressSteps(prev => 
        prev.map(step => ({ ...step, status: 'completed' as const }))
      );
      setTimeout(onComplete, 1000);
    }, totalTime);

  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Schedule Optimization</h2>
            <p className="text-gray-600">Creating your optimal schedule in real-time</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-6 space-y-4">
          {progressSteps.map((step, index) => (
            <Card 
              key={step.id}
              className={`transition-all duration-300 ${
                step.status === 'active' 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : step.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {step.status === 'pending' && (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                    {step.status === 'active' && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    )}
                    {step.status === 'completed' && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      step.status === 'active' ? 'text-blue-700' :
                      step.status === 'completed' ? 'text-green-700' :
                      'text-gray-600'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                    {step.status === 'active' && step.details && (
                      <p className="text-xs text-blue-600 mt-1">{step.details}</p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'active' ? 'bg-blue-500' :
                        'bg-transparent'
                      }`}
                      style={{
                        width: step.status === 'completed' ? '100%' :
                               step.status === 'active' ? '60%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Step Info */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentStep < progressSteps.length ? (
                <>
                  <span className="font-medium">Step {currentStep + 1}</span> of {progressSteps.length}:{' '}
                  <span className="text-blue-600">{progressSteps[currentStep]?.title}</span>
                </>
              ) : (
                <span className="text-green-600 font-medium">Optimization Complete! 🎉</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
