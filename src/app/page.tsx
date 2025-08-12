export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Restaurant AI Staffing</h1>
        <p className="text-gray-600 mb-4">Intelligent scheduling and staff management</p>
        <div className="animate-pulse">
          <p className="text-blue-600">Loading...</p>
        </div>
        <div className="mt-6">
          <a 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
