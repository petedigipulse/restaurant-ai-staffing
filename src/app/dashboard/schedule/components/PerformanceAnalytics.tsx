'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  performance_score: number;
  hourly_wage: number;
  stations: string[];
  availability: any;
}

interface PerformanceAnalyticsProps {
  staffMembers: StaffMember[];
  onTeamSelection: (teamType: 'A' | 'B', staffIds: string[]) => void;
}

export default function PerformanceAnalytics({ staffMembers, onTeamSelection }: PerformanceAnalyticsProps) {
  const [selectedTeamType, setSelectedTeamType] = useState<'A' | 'B'>('A');
  const [selectedStations, setSelectedStations] = useState<string[]>(['Kitchen', 'Front of House', 'Bar', 'Host']);

  // Calculate performance tiers
  const performanceTiers = useMemo(() => {
    const sorted = [...staffMembers].sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0));
    const total = sorted.length;
    
    return {
      aTeam: sorted.slice(0, Math.ceil(total * 0.3)), // Top 30%
      bTeam: sorted.slice(Math.ceil(total * 0.3), Math.ceil(total * 0.7)), // Middle 40%
      cTeam: sorted.slice(Math.ceil(total * 0.7)) // Bottom 30%
    };
  }, [staffMembers]);

  // Calculate performance by station
  const performanceByStation = useMemo(() => {
    const stationPerformance: { [key: string]: StaffMember[] } = {};
    
    selectedStations.forEach(station => {
      stationPerformance[station] = staffMembers
        .filter(staff => staff.stations.includes(station))
        .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0));
    });
    
    return stationPerformance;
  }, [staffMembers, selectedStations]);

  // Calculate cost-benefit analysis
  const costBenefitAnalysis = useMemo(() => {
    const aTeamCost = performanceTiers.aTeam.reduce((sum, staff) => sum + (staff.hourly_wage || 0), 0);
    const bTeamCost = performanceTiers.bTeam.reduce((sum, staff) => sum + (staff.hourly_wage || 0), 0);
    const aTeamPerformance = performanceTiers.aTeam.reduce((sum, staff) => sum + (staff.performance_score || 0), 0) / performanceTiers.aTeam.length;
    const bTeamPerformance = performanceTiers.bTeam.reduce((sum, staff) => sum + (staff.performance_score || 0), 0) / performanceTiers.bTeam.length;
    
    return {
      aTeam: { cost: aTeamCost, performance: aTeamPerformance, costPerPerformance: aTeamCost / aTeamPerformance },
      bTeam: { cost: bTeamCost, performance: bTeamPerformance, costPerPerformance: bTeamCost / bTeamPerformance },
      savings: aTeamCost - bTeamCost,
      performanceDifference: aTeamPerformance - bTeamPerformance
    };
  }, [performanceTiers]);

  const handleTeamSelection = (teamType: 'A' | 'B') => {
    setSelectedTeamType(teamType);
    const selectedTeam = teamType === 'A' ? performanceTiers.aTeam : performanceTiers.bTeam;
    onTeamSelection(teamType, selectedTeam.map(staff => staff.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
          <p className="text-gray-600 mt-1">Strategic insights for team composition and cost optimization</p>
        </div>
      </div>

      {/* Team Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A-Team Analysis */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <span className="text-2xl">🏆</span>
              <span>A-Team (Top Performers)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-green-700 font-medium">Team Size</div>
                <div className="text-2xl font-bold text-green-800">{performanceTiers.aTeam.length}</div>
              </div>
              <div>
                <div className="text-green-700 font-medium">Avg Performance</div>
                <div className="text-2xl font-bold text-green-800">
                  {Math.round(performanceTiers.aTeam.reduce((sum, staff) => sum + (staff.performance_score || 0), 0) / performanceTiers.aTeam.length)}%
                </div>
              </div>
              <div>
                <div className="text-green-700 font-medium">Total Cost/Hour</div>
                <div className="text-2xl font-bold text-green-800">
                  ${performanceTiers.aTeam.reduce((sum, staff) => sum + (staff.hourly_wage || 0), 0)}
                </div>
              </div>
              <div>
                <div className="text-green-700 font-medium">Cost/Performance</div>
                <div className="text-2xl font-bold text-green-800">
                  ${costBenefitAnalysis.aTeam.costPerPerformance.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-700">A-Team Members:</div>
              <div className="grid grid-cols-1 gap-2">
                {performanceTiers.aTeam.map(staff => (
                  <div key={staff.id} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{staff.first_name} {staff.last_name}</div>
                        <div className="text-sm text-gray-600">{staff.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{staff.performance_score || 0}%</div>
                        <div className="text-sm text-gray-500">${staff.hourly_wage}/hr</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleTeamSelection('A')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                selectedTeamType === 'A'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-green-700 border-2 border-green-300 hover:bg-green-50'
              }`}
            >
              {selectedTeamType === 'A' ? '✓ A-Team Selected' : 'Select A-Team'}
            </button>
          </CardContent>
        </Card>

        {/* B-Team Analysis */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <span className="text-2xl">💰</span>
              <span>B-Team (Cost Optimized)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-blue-700 font-medium">Team Size</div>
                <div className="text-2xl font-bold text-blue-800">{performanceTiers.bTeam.length}</div>
              </div>
              <div>
                <div className="text-blue-700 font-medium">Avg Performance</div>
                <div className="text-2xl font-bold text-blue-800">
                  {Math.round(performanceTiers.bTeam.reduce((sum, staff) => sum + (staff.performance_score || 0), 0) / performanceTiers.bTeam.length)}%
                </div>
              </div>
              <div>
                <div className="text-blue-700 font-medium">Total Cost/Hour</div>
                <div className="text-2xl font-bold text-blue-800">
                  ${performanceTiers.bTeam.reduce((sum, staff) => sum + (staff.hourly_wage || 0), 0)}
                </div>
              </div>
              <div>
                <div className="text-blue-700 font-medium">Cost/Performance</div>
                <div className="text-2xl font-bold text-blue-800">
                  ${costBenefitAnalysis.bTeam.costPerPerformance.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">B-Team Members:</div>
              <div className="grid grid-cols-1 gap-2">
                {performanceTiers.bTeam.map(staff => (
                  <div key={staff.id} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{staff.first_name} {staff.last_name}</div>
                        <div className="text-sm text-gray-600">{staff.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{staff.performance_score || 0}%</div>
                        <div className="text-sm text-gray-500">${staff.hourly_wage}/hr</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleTeamSelection('B')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                selectedTeamType === 'B'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-50'
              }`}
            >
              {selectedTeamType === 'B' ? '✓ B-Team Selected' : 'Select B-Team'}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Cost-Benefit Analysis */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <span className="text-2xl">📊</span>
            <span>Cost-Benefit Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">${costBenefitAnalysis.savings}</div>
              <div className="text-sm text-purple-700">Cost Savings (B vs A)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">{costBenefitAnalysis.performanceDifference.toFixed(1)}%</div>
              <div className="text-sm text-purple-700">Performance Difference</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">${costBenefitAnalysis.aTeam.costPerPerformance.toFixed(2)}</div>
              <div className="text-sm text-purple-700">A-Team Cost/Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">${costBenefitAnalysis.bTeam.costPerPerformance.toFixed(2)}</div>
              <div className="text-sm text-purple-700">B-Team Cost/Performance</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3">Strategic Recommendations:</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 mt-1">💡</span>
                <span><strong>Use A-Team when:</strong> High demand, special events, or maximum revenue potential</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 mt-1">💡</span>
                <span><strong>Use B-Team when:</strong> Lower demand, cost optimization needed, or training opportunities</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 mt-1">💡</span>
                <span><strong>ROI Impact:</strong> A-Team costs ${costBenefitAnalysis.savings} more but delivers {costBenefitAnalysis.performanceDifference.toFixed(1)}% better performance</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance by Station */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <span>Performance by Station</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {selectedStations.map(station => (
              <div key={station} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{station}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {performanceByStation[station]?.map(staff => (
                    <div key={staff.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{staff.first_name} {staff.last_name}</div>
                          <div className="text-sm text-gray-600">{staff.role}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            (staff.performance_score || 0) >= 80 ? 'text-green-600' :
                            (staff.performance_score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {staff.performance_score || 0}%
                          </div>
                          <div className="text-sm text-gray-500">${staff.hourly_wage}/hr</div>
                        </div>
                      </div>
                      
                      {/* Training Needs Indicator */}
                      {(staff.performance_score || 0) < 70 && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          ⚠️ Training needed in {station}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
