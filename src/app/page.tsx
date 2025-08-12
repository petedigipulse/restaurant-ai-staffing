"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (!isRedirecting) {
      setIsRedirecting(true);
      // Small delay to ensure proper hydration
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    }
  }, [router, isRedirecting]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Restaurant AI Staffing</h1>
        <p className="text-gray-600 mb-4">Intelligent scheduling and staff management</p>
        <div className="animate-pulse">
          <p className="text-blue-600">Redirecting to dashboard...</p>
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering and disable static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;
