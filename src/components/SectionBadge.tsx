import type { ReactNode } from "react";

export default function SectionBadge({ children, light = false, className = "" }: {
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <p className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] shadow-sm ${light ? "border-emerald-800/20 bg-emerald-50 text-emerald-800" : "border-emerald-800/40 bg-emerald-950/50 text-emerald-400"} ${className}`}>
      {children}
    </p>
  );
}
