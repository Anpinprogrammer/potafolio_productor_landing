import { useEffect, useRef, useState, type ReactNode } from "react";
type Dir = "up" | "left" | "right" | "zoom";
const hidden: Record<Dir, string> = {
  up: "translate-y-12", left: "-translate-x-12", right: "translate-x-12", zoom: "scale-90",
};
export default function Reveal({ children, delay = 0, dir = "up", className = "" }:
  { children: ReactNode; delay?: number; dir?: Dir; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${on ? "opacity-100 translate-x-0 translate-y-0 scale-100" : `opacity-0 ${hidden[dir]}`} ${className}`}>
      {children}
    </div>
  );
}
