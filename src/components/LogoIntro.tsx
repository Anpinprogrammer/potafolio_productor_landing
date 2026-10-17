import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import BrandLogo from "./BrandLogo";
import "./LogoIntro.css";

type Props = {
  targetRef: RefObject<HTMLSpanElement>;
  onReveal: () => void;
  onComplete: () => void;
  duration?: number;
  intensity?: number;
  travelDuration?: number;
  play?: boolean;
};

export default function LogoIntro({ targetRef, onReveal, onComplete, duration = 2.2, intensity = 0.85, travelDuration = 0.8, play = true }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const flight = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const context = useRef<gsap.Context | null>(null);
  const moving = useRef(false);
  const completed = useRef(false);
  const callbacks = useRef({ onReveal, onComplete });
  callbacks.current = { onReveal, onComplete };
  const [docking, setDocking] = useState(false);

  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    const restoreFocus = document.activeElement === skip.current;
    callbacks.current.onComplete();
    if (restoreFocus) requestAnimationFrame(() => targetRef.current?.closest("a")?.focus({ preventScroll: true }));
  }, [targetRef]);

  useLayoutEffect(() => {
    if (!play) return;
    completed.current = false;
    moving.current = false;
    context.current = gsap.context(() => {
      gsap.set(flight.current, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1 });
    }, root);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (media.matches) finish(); };
    media.addEventListener("change", reduce);
    // Una descarga fallida nunca debe dejar el proyecto detrás de una pantalla de carga.
    const safety = window.setTimeout(finish, (Math.max(duration, 0.1) + travelDuration + 5) * 1000);
    return () => {
      window.clearTimeout(safety);
      media.removeEventListener("change", reduce);
      context.current?.revert();
      context.current = null;
    };
  }, [play, duration, travelDuration, finish]);

  const dock = useCallback(() => {
    if (moving.current || completed.current) return;
    moving.current = true;
    const node = flight.current;
    if (!node || !targetRef.current || !root.current) { finish(); return; }
    setDocking(true);
    callbacks.current.onReveal();
    const driver = { progress: 0 };
    context.current?.add(() => {
      gsap.to(backdrop.current, { opacity: 0, duration: travelDuration * 0.88, delay: travelDuration * 0.1, ease: "power2.inOut" });
      gsap.to(driver, {
        progress: 1, duration: travelDuration, ease: "power3.inOut",
        onUpdate: () => {
          const target = targetRef.current?.getBoundingClientRect();
          const bounds = root.current?.getBoundingClientRect();
          if (!target || !bounds) return;
          gsap.set(node, {
            x: (target.left + target.width / 2 - bounds.left - bounds.width / 2) * driver.progress,
            y: (target.top + target.height / 2 - bounds.top - bounds.height / 2) * driver.progress,
            scale: 1 + (target.width / node.offsetWidth - 1) * driver.progress,
          });
        },
        onComplete: finish,
      });
    });
  }, [targetRef, finish, travelDuration]);

  if (!play) return null;
  return (
    <div ref={root} className={`logo-intro ${docking ? "logo-intro--docking" : ""}`} role="dialog" aria-modal="true" aria-label="Presentación de Yamamoto">
      <div ref={backdrop} className="logo-intro__backdrop" />
      <div ref={flight} className="logo-intro__flight">
        <BrandLogo className="h-full w-full" play duration={duration} intensity={intensity} onComplete={dock} />
      </div>
      {/**
      <button ref={skip} type="button" onClick={finish} className="logo-intro__skip">Omitir introducción</button> */}
    </div>
  );
}
