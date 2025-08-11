export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-7xl p-6">{children}</div>
    </div>
  );
}


