"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/AuthGuard";

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      // Suppress browser extension errors that don't affect the app
      if (error.message.includes('mce-autosize-textarea') || 
          error.message.includes('webcomponents-ce.js') ||
          error.message.includes('overlay_bundle.js')) {
        console.warn('Browser extension error suppressed:', error.message);
        return;
      }
      
      console.error('Caught app error:', error);
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress browser extension promise rejections
      if (event.reason && typeof event.reason === 'string' && 
          (event.reason.includes('mce-autosize-textarea') || 
           event.reason.includes('webcomponents-ce.js'))) {
        console.warn('Browser extension promise rejection suppressed:', event.reason);
        return;
      }
      
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-dvh bg-background text-foreground p-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
          <p className="text-muted-foreground">
            There was an error loading the dashboard. Please refresh the page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// No static generation configuration needed

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ErrorBoundary>
        <div className="min-h-dvh bg-background text-foreground">
          {/* Navigation Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">AI</span>
                    </div>
                    <span className="font-semibold text-lg">Restaurant Staffing</span>
                  </Link>
                  
                  <nav className="hidden md:flex items-center space-x-6">
                    <Link 
                      href="/dashboard" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/schedule" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Schedule
                    </Link>
                    <Link 
                      href="/dashboard/staff" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Staff
                    </Link>
                    <Link 
                      href="/dashboard/analytics" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Analytics
                    </Link>
                    <Link
                      href="/onboarding"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Onboarding
                    </Link>
                    <Link
                      href="/dashboard/ai-test"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      AI Test
                    </Link>
                    <Link
                      href="/dashboard/billing" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Billing
                    </Link>
                    <Link
                      href="/dashboard/edit-setup" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Edit Setup
                    </Link>
                    <Link
                      href="/dashboard" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Settings
                    </Link>
                  </nav>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">
                      {typeof window !== 'undefined' && localStorage.getItem('userEmail') ? 
                        localStorage.getItem('userEmail') : 'User'
                      }
                    </span>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('userEmail');
                          window.location.href = '/';
                        }
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">👤</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="mx-auto max-w-7xl p-6">
            {children}
          </main>
        </div>
      </ErrorBoundary>
    </AuthGuard>
  );
}


