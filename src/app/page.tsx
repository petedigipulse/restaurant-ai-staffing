import { LoginButton } from '@/components/LoginButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">R</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">RestaurantAI Staffing</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Staffing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              with Performance Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Optimize your restaurant staffing with AI-driven insights. See performance across stations, 
            build A-Team vs B-Team rosters, and make data-driven decisions that boost efficiency and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started - Free
            </a>
            <a
              href="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Strategic Staffing Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Go beyond basic scheduling. Get performance analytics, team optimization, and cost-benefit insights 
              that transform how you manage your restaurant staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Schedule Generation */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Schedule Generation</h3>
              <p className="text-gray-700 mb-6">
                Generate optimized schedules in seconds using AI that considers staff performance, 
                availability, and business rules.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Weather-aware scheduling</li>
                <li>• Performance-based optimization</li>
                <li>• Conflict detection & resolution</li>
              </ul>
            </div>

            {/* Performance Analytics */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance Analytics</h3>
              <p className="text-gray-700 mb-6">
                Track staff performance across all stations. Identify training needs and build 
                high-performing teams with data-driven insights.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Multi-station performance tracking</li>
                <li>• Training needs identification</li>
                <li>• Performance trend analysis</li>
              </ul>
            </div>

            {/* A-Team vs B-Team Rostering */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Strategic Team Building</h3>
              <p className="text-gray-700 mb-6">
                Build A-Team rosters for busy shifts and B-Team for cost optimization. 
                See the cost-benefit analysis for every team composition.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Performance-based team tiers</li>
                <li>• Cost-benefit analysis</li>
                <li>• Strategic rostering decisions</li>
              </ul>
            </div>

            {/* Cost Optimization */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200">
              <div className="w-16 h-16 bg-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cost Optimization</h3>
              <p className="text-gray-700 mb-6">
                Optimize labor costs while maintaining service quality. Get real-time insights 
                into cost per performance and ROI impact.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Labor cost analysis</li>
                <li>• Performance vs. cost metrics</li>
                <li>• ROI optimization insights</li>
              </ul>
            </div>

            {/* Multi-Station Management */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
              <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Station Management</h3>
              <p className="text-gray-700 mb-6">
                Manage staff across Kitchen, Front of House, Bar, and Host stations. 
                See who excels where and optimize assignments.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Cross-station performance</li>
                <li>• Skill gap identification</li>
                <li>• Optimal staff placement</li>
              </ul>
            </div>

            {/* Historical Data Insights */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Historical Insights</h3>
              <p className="text-gray-700 mb-6">
                Learn from past performance data. Identify patterns, optimize for busy periods, 
                and make informed staffing decisions.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sales pattern analysis</li>
                <li>• Seasonal staffing optimization</li>
                <li>• Performance trend tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Analytics Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See Your Team's Performance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant insights into who your top performers are, where training is needed, 
              and how to optimize your team composition for maximum efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                A-Team vs B-Team Analysis
              </h3>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <h4 className="text-xl font-semibold text-gray-900">A-Team (Top 30%)</h4>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Your superstar performers for high-demand shifts and special events
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Avg Performance:</span>
                      <span className="block font-semibold text-green-600">85%+</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Best For:</span>
                      <span className="block font-semibold text-green-600">Busy Shifts</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <h4 className="text-xl font-semibold text-gray-900">B-Team (Middle 40%)</h4>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Cost-optimized team for regular shifts and training opportunities
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Avg Performance:</span>
                      <span className="block font-semibold text-blue-600">70-84%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Best For:</span>
                      <span className="block font-semibold text-blue-600">Cost Optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Cost-Benefit Analysis</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-gray-700">A-Team Cost/Hour:</span>
                  <span className="font-bold text-green-600">$180</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-700">B-Team Cost/Hour:</span>
                  <span className="font-bold text-blue-600">$140</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-gray-700">Cost Savings:</span>
                  <span className="font-bold text-purple-600">$40/hour</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-gray-700">Performance Difference:</span>
                  <span className="font-bold text-yellow-600">+15%</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Strategic Insight:</strong> Use A-Team for maximum revenue potential, 
                  B-Team for cost optimization during slower periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Staffing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join restaurants that are already using AI-powered performance analytics to optimize their teams, 
            reduce costs, and boost efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Free Trial
            </a>
            <a
              href="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <span className="text-xl font-bold">RestaurantAI</span>
              </div>
              <p className="text-gray-400">
                AI-powered staffing optimization for modern restaurants.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Schedule Generation</li>
                <li>Performance Analytics</li>
                <li>A-Team vs B-Team</li>
                <li>Cost Optimization</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Restaurants</li>
                <li>Cafes</li>
                <li>Bars</li>
                <li>Food Service</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Contact</li>
                <li>Support</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RestaurantAI Staffing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
