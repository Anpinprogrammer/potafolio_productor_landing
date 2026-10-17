import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { YAMAMOTO_LOGO } from "../lib/brand";
import "./BrandLogo.css";

export type BrandLogoProps = {
  src?: string;
  className?: string;
  /** Segundos del barrido completo; 3,2 respeta las cuatro fases de la identidad. */
  duration?: number;
  intensity?: number;
  play?: boolean;
  /** Cambiar esta clave permite una reproducción explícita, sin bucles automáticos. */
  replayKey?: string | number;
  flarePoint?: { x: number; y: number };
  onComplete?: () => void;
};

const BrandLogo = forwardRef<HTMLSpanElement, BrandLogoProps>(function BrandLogo({
  src = YAMAMOTO_LOGO.src, className = "", duration = 3.2, intensity = 0.85,
  play = false, replayKey = 0, flarePoint = YAMAMOTO_LOGO.flare, onComplete,
}, forwardedRef) {
  const root = useRef<HTMLSpanElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const [readySource, setReadySource] = useState<string | null>(null);
  useImperativeHandle(forwardedRef, () => root.current!, []);

  useLayoutEffect(() => {
    if (image.current?.complete && image.current.naturalWidth > 0) setReadySource(src);
  }, [src]);

  useLayoutEffect(() => {
    if (!play || readySource !== src || !root.current) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) { complete.current?.(); return; }
    let active = true;
    let timeline: gsap.core.Timeline;
    const strength = Math.min(1.5, Math.max(0, intensity));
    const context = gsap.context(() => {
      const sheen = root.current!.querySelector(".brand-logo__sheen");
      const traveler = root.current!.querySelector(".brand-logo__traveler");
      const bloom = root.current!.querySelector(".brand-logo__bloom");
      const glass = root.current!.querySelector(".brand-logo__glass");
      // Porcentajes sobre la propia capa: la trayectoria escala con el logo sin lecturas por frame.
      gsap.set(traveler, { xPercent: 0.035 / 0.18 * 100 - 50, yPercent: flarePoint.y / 0.54 * 100 - 50, opacity: 0 });
      gsap.set(sheen, { xPercent: -150, opacity: 0 });
      gsap.set(bloom, { xPercent: -50, yPercent: -50, scale: 0.5, opacity: 0 });
      gsap.set(glass, { opacity: 0 });
      timeline = gsap.timeline({ onComplete: () => { if (active) complete.current?.(); } });
      timeline
        .to(traveler, { opacity: 0.18 * strength, duration: 0.2 }, 0.2)
        .to(sheen, { opacity: 0.65 * strength, duration: 0.2 }, 0.4)
        .to(sheen, { xPercent: 400, duration: 1.7, ease: "power2.inOut" }, 0.4)
        .to(traveler, { xPercent: flarePoint.x / 0.18 * 100 - 50, opacity: 0.7 * strength, duration: 1.7, ease: "power2.inOut" }, 0.4)
        .to(sheen, { opacity: 0, duration: 0.2 }, 2)
        .to(traveler, { opacity: 0, duration: 0.25 }, 2.1)
        .to(bloom, { opacity: strength, scale: 1.05, duration: 0.25, ease: "power2.out" }, 2.1)
        .to(glass, { opacity: 0.22 * strength, duration: 0.25 }, 2.1)
        .to(bloom, { opacity: 0.25 * strength, scale: 0.85, duration: 0.25, ease: "sine.inOut" }, 2.35)
        .to(bloom, { opacity: 0, scale: 0.72, duration: 0.6, ease: "sine.out" }, 2.6)
        .to(glass, { opacity: 0, duration: 0.6 }, 2.6);
      timeline.timeScale(3.2 / Math.max(0.1, duration));
    }, root);
    const onMotion = () => { if (motion.matches) timeline.progress(1); };
    motion.addEventListener("change", onMotion);
    return () => { active = false; motion.removeEventListener("change", onMotion); context.revert(); };
  }, [play, replayKey, readySource, src, duration, intensity, flarePoint.x, flarePoint.y]);

  return (
    <span ref={root} className={`brand-logo ${className}`} role="img" aria-label="Yamamoto"
      style={{ "--logo-source": `url("${src}")`, "--logo-flare-x": `${flarePoint.x * 100}%`, "--logo-flare-y": `${flarePoint.y * 100}%` } as CSSProperties}>
      <img ref={image} src={src} alt="" aria-hidden="true" width={YAMAMOTO_LOGO.width} height={YAMAMOTO_LOGO.height}
        draggable={false} decoding="async" onLoad={() => setReadySource(src)} onError={() => { if (play) complete.current?.(); }} />
      {play && <span aria-hidden="true" className="brand-logo__light">
        <span className="brand-logo__sheen" />
        <span className="brand-logo__traveler" />
        <span className="brand-logo__glass" />
        <span className="brand-logo__bloom" />
      </span>}
    </span>
  );
});

export default BrandLogo;
