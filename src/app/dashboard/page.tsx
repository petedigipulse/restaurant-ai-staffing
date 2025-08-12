import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant AI Staffing</h1>
        <p className="text-muted-foreground">
          Intelligent scheduling and staff management powered by AI
        </p>
      </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/onboarding"
                className="group p-6 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold">Setup Wizard</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete onboarding and configure your system
                  </p>
                </div>
              </Link>
              
              <Link
                href="/dashboard/schedule"
                className="group p-6 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold">Schedule Management</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered staff scheduling and optimization
                  </p>
                </div>
              </Link>
              
              <Link
                href="/dashboard/analytics"
                className="group p-6 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold">Analytics & Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Performance metrics, cost analysis, and AI insights
                  </p>
                </div>
              </Link>
              
              <Link
                href="/dashboard/staff"
                className="group p-6 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold">Staff Directory</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage staff profiles, performance, and availability
                  </p>
                </div>
              </Link>


      </div>

      <div className="p-6 border rounded-lg bg-primary/5">
        <h3 className="font-semibold mb-2">Quick Start</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get started with AI-powered staff scheduling in just a few clicks.
        </p>
        <Link 
          href="/dashboard/schedule"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Create Your First Schedule
        </Link>
      </div>
    </div>
  );
}

// Force dynamic rendering and disable static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;


