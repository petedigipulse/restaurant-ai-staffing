"use client";
import { useState } from "react";
import Link from "next/link";

export default function AITestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAIService = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const response = await fetch('/api/ai/test');
      const result = await response.json();
      
      if (response.ok) {
        setTestResult(result);
      } else {
        setError(result.error || 'Test failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">AI Service Test</h1>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Testing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">🤖 AI Service Connectivity Test</h2>
            <p className="text-gray-600">
              This page tests the connection to OpenAI's API and verifies that the AI service is working correctly.
            </p>
          </div>

          {/* Test Button */}
          <div className="mb-6">
            <button
              onClick={testAIService}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <span>🧪</span>
                  <span>Test AI Service</span>
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">❌</span>
                <span className="text-red-700 font-medium">Error: {error}</span>
              </div>
              <div className="mt-2 text-sm text-red-600">
                Make sure you have set your <code className="bg-red-100 px-1 rounded">OPENAI_API_KEY</code> in your <code className="bg-red-100 px-1 rounded">.env.local</code> file.
              </div>
            </div>
          )}

          {/* Test Results */}
          {testResult && (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-green-700 font-medium">{testResult.message}</span>
                </div>
              </div>

              {/* Connection Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Connection Status</h3>
                  <div className="text-sm text-blue-700">
                    <div>Status: <span className="font-medium">{testResult.connection}</span></div>
                    <div>Model: <span className="font-medium">{testResult.model}</span></div>
                    <div>Test Result: <span className="font-medium">{testResult.testResult}</span></div>
                    <div>Cost: <span className="font-medium">{testResult.cost}</span></div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">Next Steps</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    {testResult.nextSteps?.map((step: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Features Overview */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">🚀 Available AI Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl mb-2">📅</div>
                    <h4 className="font-medium text-gray-900">AI Schedule Generation</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Generate optimal schedules using AI analysis of staff, weather, and historical data
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl mb-2">🔮</div>
                    <h4 className="font-medium text-gray-900">Predictive Analytics</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Get AI-powered insights and predictions for demand, costs, and performance
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl mb-2">💡</div>
                    <h4 className="font-medium text-gray-900">Business Intelligence</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive actionable recommendations and business insights from AI analysis
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-4">
                <Link
                  href="/dashboard/schedule"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🧠 Try AI Schedule Generation
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📊 View Analytics Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Setup Instructions */}
          {!testResult && !error && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">🔑 Setup Required</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>To use the AI features, you need to:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Get an OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></li>
                  <li>Add <code className="bg-yellow-100 px-1 rounded">OPENAI_API_KEY=your-key-here</code> to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file</li>
                  <li>Restart your development server</li>
                  <li>Click "Test AI Service" above</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
