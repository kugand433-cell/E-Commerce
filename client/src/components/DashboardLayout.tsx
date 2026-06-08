import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export default function DashboardLayout({
  title,
  nav,
  children,
}: {
  title: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <aside className="self-start rounded-xl border bg-card p-3 md:sticky md:top-32">
          <h2 className="px-2 py-2 text-sm font-semibold uppercase text-muted-foreground">{title}</h2>
          <nav className="space-y-1">
            {nav.map((n) => {
              const active = pathname === n.to;
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to as any}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-nest-orange/15 font-semibold text-nest-navy" : "hover:bg-muted"}`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}

export function StatCard({
  label, value, icon: Icon, accent = "var(--nest-orange)",
}: {
  label: string; value: string | number; icon: LucideIcon; accent?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-full p-2.5" style={{ background: `color-mix(in oklab, ${accent} 15%, transparent)`, color: accent }}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
