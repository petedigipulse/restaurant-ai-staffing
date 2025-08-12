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

        <div className="p-6 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <h3 className="font-semibold text-muted-foreground">Staff Directory</h3>
            <p className="text-sm text-muted-foreground">
              Manage employee profiles and availability
            </p>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <h3 className="font-semibold text-muted-foreground">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Performance insights and forecasting
            </p>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <h3 className="font-semibold text-muted-foreground">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure AI preferences and rules
            </p>
          </div>
        </div>
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


