"use client";
import { useState } from "react";

export default function SchedulePage() {
  const [jobId, setJobId] = useState<string | null>(null);

  async function generate() {
    const res = await fetch("/api/schedule/generate", {
      method: "POST",
      body: JSON.stringify({ tenantId: "demo", weekStart: new Date().toISOString().slice(0, 10) }),
    });
    const data = await res.json();
    setJobId(data.jobId);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <button onClick={generate} className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
        Generate AI Schedule
      </button>
      {jobId && <p className="text-sm text-muted-foreground">Job queued: {jobId}</p>}
    </div>
  );
}


