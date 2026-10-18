type SectionBadgeProps = {
  text: string;
  theme: "dark" | "light";
  showDot?: boolean;
  className?: string;
};

export default function SectionBadge({ text, theme, showDot = true, className = "" }: SectionBadgeProps) {
  return (
    <p className={`inline-flex w-fit items-center gap-2.5 rounded-full border px-4 py-2 text-xs uppercase tracking-wider backdrop-blur-md ${theme === "light" ? "border-slate-300 bg-slate-100 font-semibold text-slate-800" : "border-zinc-800 bg-zinc-900/80 font-medium text-zinc-300"} ${className}`}>
      {showDot && <span aria-hidden="true" className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-brand motion-reduce:animate-none" />}
      {text}
    </p>
  );
}
