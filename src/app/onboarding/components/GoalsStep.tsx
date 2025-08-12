"use client";
import { useState } from "react";

interface Goals {
  priority: string;
  staffSatisfaction: number;
  customerService: number;
  costOptimization: number;
  flexibility: number;
  training: number;
  specialEvents: string[];
  schedulingPreferences: string[];
}

interface Props {
  data: Goals;
  updateData: (data: Partial<Goals>) => void;
}

export default function GoalsStep({ data, updateData }: Props) {
  const [localData, setLocalData] = useState(data);

  const handleChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const handleSpecialEventsChange = (event: string, checked: boolean) => {
    const newEvents = checked
      ? [...localData.specialEvents, event]
      : localData.specialEvents.filter(e => e !== event);
    handleChange('specialEvents', newEvents);
  };

  const handleSchedulingPreferencesChange = (pref: string, checked: boolean) => {
    const newPrefs = checked
      ? [...localData.schedulingPreferences, pref]
      : localData.schedulingPreferences.filter(p => p !== pref);
    handleChange('schedulingPreferences', newPrefs);
  };

  const priorities = [
    { id: 'cost-optimization', label: 'Cost Optimization', description: 'Minimize labor costs while maintaining service quality' },
    { id: 'staff-satisfaction', label: 'Staff Satisfaction', description: 'Prioritize employee preferences and work-life balance' },
    { id: 'customer-service', label: 'Customer Service', description: 'Ensure optimal staffing for peak customer experience' },
    { id: 'flexibility', label: 'Flexibility', description: 'Adapt quickly to changing business needs' },
    { id: 'training', label: 'Training & Development', description: 'Provide opportunities for skill development' }
  ];

  const specialEvents = [
    'Holidays (Christmas, New Year, etc.)',
    'Local Events & Festivals',
    'Sports Games & Concerts',
    'Graduation & Prom Seasons',
    'Tourist Seasons',
    'Corporate Events',
    'Wedding Receptions',
    'Birthday Parties',
    'Other Special Occasions'
  ];

  const schedulingPreferences = [
    'Prefer longer shifts (8+ hours)',
    'Prefer shorter shifts (4-6 hours)',
    'Split shifts allowed',
    'No split shifts',
    'Weekend rotation required',
    'Holiday rotation required',
    'Overtime opportunities',
    'Limited overtime',
    'Cross-training encouraged',
    'Role specialization preferred'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Goals & Preferences</h1>
        <p className="text-muted-foreground">
          Tell us what matters most for your scheduling decisions
        </p>
      </div>

      <div className="space-y-8">
        {/* Primary Priority */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Primary Scheduling Priority</h2>
          <p className="text-sm text-muted-foreground">
            Select the most important factor for your AI scheduling system
          </p>

          <div className="space-y-3">
            {priorities.map((priority) => (
              <label key={priority.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={priority.id}
                  checked={localData.priority === priority.id}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="mt-1 rounded-full border-gray-300"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{priority.label}</h3>
                  <p className="text-sm text-muted-foreground">{priority.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Scoring System */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Priority Scoring (1-10)</h2>
          <p className="text-sm text-muted-foreground">
            Rate the importance of each factor on a scale of 1-10
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Staff Satisfaction
                  <span className="text-muted-foreground ml-2">(Work-life balance, preferences)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={localData.staffSatisfaction}
                    onChange={(e) => handleChange('staffSatisfaction', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-8 text-center font-medium">{localData.staffSatisfaction}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Service
                  <span className="text-muted-foreground ml-2">(Service quality, response time)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={localData.customerService}
                    onChange={(e) => handleChange('customerService', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-8 text-center font-medium">{localData.customerService}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cost Optimization
                  <span className="text-muted-foreground ml-2">(Labor cost efficiency)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={localData.costOptimization}
                    onChange={(e) => handleChange('costOptimization', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-8 text-center font-medium">{localData.costOptimization}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Flexibility
                  <span className="text-muted-foreground ml-2">(Adaptability to changes)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={localData.flexibility}
                    onChange={(e) => handleChange('flexibility', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-8 text-center font-medium">{localData.flexibility}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Training & Development
                  <span className="text-muted-foreground ml-2">(Skill building opportunities)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={localData.training}
                    onChange={(e) => handleChange('training', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-8 text-center font-medium">{localData.training}</span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Priority Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Staff Satisfaction:</span>
                    <span className="font-medium">{localData.staffSatisfaction}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Service:</span>
                    <span className="font-medium">{localData.customerService}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Optimization:</span>
                    <span className="font-medium">{localData.costOptimization}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flexibility:</span>
                    <span className="font-medium">{localData.flexibility}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training:</span>
                    <span className="font-medium">{localData.training}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Events */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Special Events & Seasons</h2>
          <p className="text-sm text-muted-foreground">
            Select events that significantly impact your business and require special scheduling
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            {specialEvents.map(event => (
              <label key={event} className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localData.specialEvents.includes(event)}
                  onChange={(e) => handleSpecialEventsChange(event, e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm">{event}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Scheduling Preferences */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Scheduling Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Choose your preferred scheduling approach and constraints
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {schedulingPreferences.map(pref => (
              <label key={pref} className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localData.schedulingPreferences.includes(pref)}
                  onChange={(e) => handleSchedulingPreferencesChange(pref, e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AI Training */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI Training Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Help us understand what makes a &quot;good&quot; schedule for your business
          </p>

          <div className="p-4 border rounded-lg space-y-4">
            <div>
              <h3 className="font-medium mb-2">What makes a good schedule?</h3>
              <textarea
                placeholder="Describe what you consider a successful schedule... (e.g., balanced workload, happy staff, efficient coverage, cost-effective)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={3}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Common scheduling problems?</h3>
              <textarea
                placeholder="What issues do you typically face? (e.g., understaffing during peak hours, overstaffing during slow periods, skill gaps)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={3}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Success indicators?</h3>
              <textarea
                placeholder="How do you measure scheduling success? (e.g., staff retention, customer satisfaction, labor cost percentage)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Templates</h2>
          <p className="text-sm text-muted-foreground">
            Apply common goal configurations
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const template = {
                  priority: 'cost-optimization',
                  staffSatisfaction: 6,
                  customerService: 8,
                  costOptimization: 9,
                  flexibility: 7,
                  training: 5,
                  specialEvents: ['Holidays (Christmas, New Year, etc.)', 'Local Events & Festivals'],
                  schedulingPreferences: ['Weekend rotation required', 'Holiday rotation required', 'Cross-training encouraged']
                };
                setLocalData(prev => ({ ...prev, ...template }));
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Cost-Focused
            </button>

            <button
              onClick={() => {
                const template = {
                  priority: 'staff-satisfaction',
                  staffSatisfaction: 9,
                  customerService: 7,
                  costOptimization: 6,
                  flexibility: 8,
                  training: 8,
                  specialEvents: ['Holidays (Christmas, New Year, etc.)', 'Local Events & Festivals', 'Sports Games & Concerts'],
                  schedulingPreferences: ['Prefer longer shifts (8+ hours)', 'No split shifts', 'Weekend rotation required', 'Training opportunities']
                };
                setLocalData(prev => ({ ...prev, ...template }));
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Staff-Focused
            </button>

            <button
              onClick={() => {
                const template = {
                  priority: 'customer-service',
                  staffSatisfaction: 7,
                  customerService: 9,
                  costOptimization: 7,
                  flexibility: 8,
                  training: 6,
                  specialEvents: ['Holidays (Christmas, New Year, etc.)', 'Local Events & Festivals', 'Tourist Seasons'],
                  schedulingPreferences: ['Prefer shorter shifts (4-6 hours)', 'Split shifts allowed', 'Weekend rotation required', 'Role specialization preferred']
                };
                setLocalData(prev => ({ ...prev, ...template }));
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Customer-Focused
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
