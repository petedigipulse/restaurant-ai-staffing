"use client";
import { useState } from "react";

interface BusinessRules {
  minStaffing: {
    kitchen: number;
    foh: number;
    bar: number;
  };
  maxOvertime: number;
  breakRequirements: {
    meal: number;
    rest: number;
  };
  targetLaborCost: number;
  consecutiveDays: number;
  minShiftLength: number;
  maxShiftLength: number;
  weekendRotation: boolean;
  holidayPay: boolean;
}

interface Props {
  data: BusinessRules;
  updateData: (data: Partial<BusinessRules>) => void;
}

export default function BusinessRulesStep({ data, updateData }: Props) {
  const [localData, setLocalData] = useState(data);

  const handleChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const handleMinStaffingChange = (area: string, value: number) => {
    const newMinStaffing = { ...localData.minStaffing, [area]: value };
    const newData = { ...localData, minStaffing: newMinStaffing };
    setLocalData(newData);
    updateData(newData);
  };

  const handleBreakRequirementsChange = (type: string, value: number) => {
    const newBreakRequirements = { ...localData.breakRequirements, [type]: value };
    const newData = { ...localData, breakRequirements: newBreakRequirements };
    setLocalData(newData);
    updateData(newData);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Set your business rules</h1>
        <p className="text-muted-foreground">
          Define constraints and requirements for your AI scheduling system
        </p>
      </div>

      <div className="space-y-8">
        {/* Minimum Staffing Requirements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Minimum Staffing Requirements</h2>
          <p className="text-sm text-muted-foreground">
            Set the minimum number of staff required in each area during operating hours
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Kitchen Staff</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={localData.minStaffing.kitchen}
                  onChange={(e) => handleMinStaffingChange('kitchen', parseInt(e.target.value) || 0)}
                  className="w-20 p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <span className="text-sm text-muted-foreground">people minimum</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Includes chefs, cooks, prep staff
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Front of House</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={localData.minStaffing.foh}
                  onChange={(e) => handleMinStaffingChange('foh', parseInt(e.target.value) || 0)}
                  className="w-20 p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <span className="text-sm text-muted-foreground">people minimum</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Includes servers, hosts, cashiers
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Bar Staff</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={localData.minStaffing.bar}
                  onChange={(e) => handleMinStaffingChange('bar', parseInt(e.target.value) || 0)}
                  className="w-20 p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <span className="text-sm text-muted-foreground">people minimum</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Includes bartenders, baristas
              </p>
            </div>
          </div>
        </div>

        {/* Labor Cost Targets */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Labor Cost Management</h2>
          <p className="text-sm text-muted-foreground">
            Set targets for labor costs as a percentage of revenue
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Target Labor Cost (%)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={localData.targetLaborCost}
                  onChange={(e) => handleChange('targetLaborCost', parseFloat(e.target.value) || 0)}
                  className="w-24 p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <span className="text-sm text-muted-foreground">% of revenue</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Industry average: 25-35%
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Maximum Overtime (hours/week)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={localData.maxOvertime}
                  onChange={(e) => handleChange('maxOvertime', parseInt(e.target.value) || 0)}
                  className="w-24 p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <span className="text-sm text-muted-foreground">hours per week</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Per employee
              </p>
            </div>
          </div>
        </div>

        {/* Break Requirements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Break Requirements</h2>
          <p className="text-sm text-muted-foreground">
            Set minimum break times required by law and policy
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Meal Break (minutes)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={localData.breakRequirements.meal}
                  onChange={(e) => handleBreakRequirementsChange('meal', parseInt(e.target.value) || 0)}
                  className="w-24 p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Required for shifts over 6 hours
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Rest Break (minutes)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={localData.breakRequirements.rest}
                  onChange={(e) => handleBreakRequirementsChange('rest', parseInt(e.target.value) || 0)}
                  className="w-24 p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Required for shifts over 4 hours
              </p>
            </div>
          </div>
        </div>

        {/* Shift Constraints */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shift Constraints</h2>
          <p className="text-sm text-muted-foreground">
            Set limits on shift lengths and consecutive days
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Minimum Shift Length (hours)</label>
                              <input
                  type="number"
                  min="0"
                  value={localData.minShiftLength || 0}
                  onChange={(e) => handleChange('minShiftLength', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Maximum Shift Length (hours)</label>
                              <input
                  type="number"
                  min="0"
                  value={localData.maxShiftLength || 0}
                  onChange={(e) => handleChange('maxShiftLength', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">Max Consecutive Days</label>
                              <input
                  type="number"
                  min="0"
                  value={localData.consecutiveDays || 0}
                  onChange={(e) => handleChange('consecutiveDays', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>
          </div>
        </div>

        {/* Additional Policies */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Additional Policies</h2>
          <p className="text-sm text-muted-foreground">
            Set additional scheduling policies and preferences
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Weekend Rotation</h3>
                <p className="text-sm text-muted-foreground">
                  Rotate weekend shifts fairly among staff
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localData.weekendRotation || false}
                  onChange={(e) => handleChange('weekendRotation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Holiday Pay</h3>
                <p className="text-sm text-muted-foreground">
                  Apply holiday pay rates to major holidays
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localData.holidayPay || false}
                  onChange={(e) => handleChange('holidayPay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Templates</h2>
          <p className="text-sm text-muted-foreground">
            Apply common business rule configurations
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const template = {
                  minStaffing: { kitchen: 2, foh: 3, bar: 1 },
                  maxOvertime: 40,
                  breakRequirements: { meal: 30, rest: 10 },
                  targetLaborCost: 25,
                  consecutiveDays: 6,
                  minShiftLength: 4,
                  maxShiftLength: 12,
                  weekendRotation: true,
                  holidayPay: true
                };
                setLocalData(template);
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Standard Restaurant
            </button>

            <button
              onClick={() => {
                const template = {
                  minStaffing: { kitchen: 3, foh: 4, bar: 2 },
                  maxOvertime: 50,
                  breakRequirements: { meal: 45, rest: 15 },
                  targetLaborCost: 30,
                  consecutiveDays: 5,
                  minShiftLength: 6,
                  maxShiftLength: 10,
                  weekendRotation: true,
                  holidayPay: true
                };
                setLocalData(template);
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Fine Dining
            </button>

            <button
              onClick={() => {
                const template = {
                  minStaffing: { kitchen: 1, foh: 2, bar: 0 },
                  maxOvertime: 35,
                  breakRequirements: { meal: 20, rest: 5 },
                  targetLaborCost: 20,
                  consecutiveDays: 7,
                  minShiftLength: 3,
                  maxShiftLength: 8,
                  weekendRotation: false,
                  holidayPay: false
                };
                setLocalData(template);
                updateData(template);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Fast Casual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
