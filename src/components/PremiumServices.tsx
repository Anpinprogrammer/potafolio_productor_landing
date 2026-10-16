import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Reveal from "./Reveal";
import { premiumServices } from "../data";

// Textura de grano cinematográfico muy sutil (SVG inline, sin peticiones extra).
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")";
const MOBILE = "(max-width: 639px)";
const DURATION = 450; // ms de la transición del carrusel
// EXIT debe coincidir con la duración de la animación `modalout` en tailwind.config.js
const EXIT = 260;     // ms que se espera antes de desmontar el reproductor

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

type Service = typeof premiumServices[number];

function ServiceCard({ s, clone, onPlay }: { s: Service; clone?: boolean; onPlay: (s: Service, el: HTMLElement) => void }) {
  const Icon = s.icon;
  return (
    <article className="group h-full">
      <div
        className="flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_28px_60px_-30px_rgba(0,0,0,.95)] ring-1 ring-white/10 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-32px_rgba(0,0,0,1)] motion-reduce:transition-none">
        {/* Portada visual (~70%) */}
        <div className="relative aspect-[6/5] overflow-hidden sm:aspect-square md:aspect-[5/4] lg:aspect-[5/7] xl:aspect-[4/5] 2xl:aspect-[10/9] 3xl:aspect-[7/6]">
          <img src={s.image} alt={`${s.title}: ${s.description}`} width={800} height={1000} loading="lazy" decoding="async"
            style={{ objectPosition: s.position, filter: "contrast(1.14) saturate(1.05) brightness(.92)" }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none" />
          {/* Tinte de color por card (look cinematográfico unificado) */}
          {s.tint > 0 && <div aria-hidden className="absolute inset-0 mix-blend-color" style={{ background: s.accent, opacity: s.tint }} />}
          {/* Fuga de luz del color de acento */}
          <div aria-hidden className="absolute inset-0 mix-blend-screen opacity-60"
            style={{ background: `radial-gradient(120% 70% at 8% 0%, ${rgba(s.accent, 0.28)} 0%, transparent 60%)` }} />
          {/* Scrim para legibilidad */}
          <div aria-hidden className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(2,3,6,.96) 0%, rgba(2,3,6,.7) 24%, rgba(2,3,6,.16) 54%, rgba(2,3,6,.42) 100%)" }} />

          {/* Fila superior: categoría + duración */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
            <span className="flex items-center gap-2 rounded-full bg-black/35 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 ring-1 ring-white/15 backdrop-blur-md">
              <Icon size={13} style={{ color: s.accent }} aria-hidden /> {s.category}
            </span>
            <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-white ring-1 ring-white/15 backdrop-blur-md">
              {s.duration}
            </span>
          </div>

          {/* Fila inferior: título + play */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <h3 className="max-w-[68%] hyphens-auto break-words text-[27px] font-extrabold leading-[0.94] tracking-tight text-white lg:text-[24px] xl:text-[27px] 2xl:text-[32px]"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,.55)" }}>
              {s.title}
            </h3>
            <button type="button" tabIndex={clone ? -1 : undefined}
              onClick={(e) => onPlay(s, e.currentTarget)}
              aria-label={`Reproducir el video de ${s.title}`}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/60 backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink group-hover:scale-105 group-hover:bg-white group-hover:text-ink motion-reduce:transition-none"
              style={{ boxShadow: `0 0 0 6px ${rgba(s.accent, 0.13)}, 0 12px 30px -10px ${rgba(s.accent, 0.7)}` }}>
              <Play size={15} fill="currentColor" aria-hidden className="translate-x-[1px]" />
            </button>
          </div>
        </div>

        {/* Bloque editorial blanco (~30%) */}
        <div className="flex flex-1 flex-col bg-[#fbfaf8] p-4">
          <p className="min-h-[24px] text-[9px] font-bold uppercase leading-[1.3] tracking-[0.2em] text-slate-500">
            {s.keywords.join(" · ")}
          </p>
          <span aria-hidden className="mt-1 h-[3px] w-9 rounded-full" style={{ background: s.accent }} />
          <p className="mt-2 line-clamp-3 text-[12px] leading-[1.45] text-slate-600">{s.description}</p>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2.5">
            {s.pills.map(p => (
              <li key={p} className="rounded-full bg-slate-900/[0.06] px-2 py-[1px] text-[9.5px] font-medium text-slate-700 ring-1 ring-slate-900/[0.06] sm:px-2.5 sm:py-[2px] sm:text-[10px] lg:px-2 lg:text-[9.5px]">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function PremiumServices() {
  const n = premiumServices.length;
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE).matches);
  const [reduce] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  // pos: 1..n = cards reales; 0 y n+1 = clones (para el salto continuo)
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const posRef = useRef(1);
  const locked = useRef(false);
  const queued = useRef(0);
  const ms = reduce ? 0 : DURATION;

  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const f = () => setMobile(mq.matches);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  const apply = (p: number) => { posRef.current = p; setPos(p); };

  // Al terminar, si estamos en un clon se salta en silencio a la card equivalente
  const settle = () => {
    const p = posRef.current;
    if (p > n) { setAnimate(false); apply(p - n); }
    else if (p < 1) { setAnimate(false); apply(p + n); }
    window.setTimeout(() => {
      setAnimate(true);
      locked.current = false;
      // Clics rápidos: se reproducen uno a uno, uno por toque
      const q = queued.current;
      if (q !== 0) { queued.current = q - Math.sign(q); move(Math.sign(q) as 1 | -1); }
    }, 60);
  };

  const move = (dir: 1 | -1) => {
    if (locked.current) { queued.current += dir; return; } // nunca se desactivan: se encolan
    locked.current = true;
    setAnimate(true);
    apply(posRef.current + dir);
    window.setTimeout(settle, ms + 20);
  };

  const active = ((pos - 1) % n + n) % n;
  // En móvil se añaden clones al inicio y al final para que el bucle no tenga corte
  const slides = mobile ? [premiumServices[n - 1], ...premiumServices, premiumServices[0]] : premiumServices;

  /* ---------- Reproductor en ventana modal ---------- */
  const [playing, setPlaying] = useState<Service | null>(null);
  const [closing, setClosing] = useState(false); // true = animación de salida en curso
  const [videoReady, setVideoReady] = useState(false); // póster visible hasta que el video puede reproducirse
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitTimer = useRef<number | null>(null);

  const openVideo = (s: Service, el: HTMLElement) => {
    if (exitTimer.current) { window.clearTimeout(exitTimer.current); exitTimer.current = null; }
    openerRef.current = el;
    setClosing(false);
    setPlaying(s);
  };

  const closeVideo = () => {
    setClosing(true);                            // dispara la animación de salida
    openerRef.current?.focus();                  // devuelve el foco ya mismo
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {   // desmonta al terminar (corta el video)
      setPlaying(null); setClosing(false); exitTimer.current = null;
    }, EXIT);
  };

  // Limpia el temporizador si el componente se desmonta
  useEffect(() => () => { if (exitTimer.current) window.clearTimeout(exitTimer.current); }, []);

  // El póster (la portada de la card) se funde cuando el video ya puede reproducirse.
  // Con red de seguridad a 1,5 s para que el marco nunca se quede tapado.
  useEffect(() => {
    if (!playing) { setVideoReady(false); return; }
    setVideoReady(false);
    const t = window.setTimeout(() => setVideoReady(true), 1500);
    return () => window.clearTimeout(t);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    videoRef.current?.play().catch(() => { /* el usuario tiene los controles */ });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // sin scroll de fondo mientras se reproduce
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeVideo(); return; }
      if (e.key !== "Tab" || !dialogRef.current) return;
      // Foco encerrado dentro de la ventana
      const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>('button, video, [href], [tabindex]:not([tabindex="-1"])')]
        .filter(el => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [playing]);

  // Al abrir, el foco entra en la ventana
  useEffect(() => { if (playing) dialogRef.current?.focus(); }, [playing]);

  return (
    <section id="portafolio" className="relative overflow-hidden py-12 lg:py-20"
      style={{ background: "radial-gradient(130% 100% at 50% 0%, #0a1420 0%, #03060c 55%, #010204 100%)" }}>
      {/* Ambiente: halos de color + grano */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-brand/25 blur-[140px]" />
        <div className="absolute -bottom-32 -right-24 h-[420px] w-[560px] rounded-full bg-brand2/40 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-soft-light" style={{ backgroundImage: GRAIN }} />
      </div>

      <div className="wrap relative">
        {/* Cabecera editorial */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-9 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              <span aria-hidden className="h-px w-10 bg-brand/60" /> Portafolio de servicios <span aria-hidden className="h-px w-10 bg-brand/60" />
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.06] text-white md:text-5xl">
              Cada proyecto, <span className="font-script text-[2.6rem] font-normal text-brand md:text-[3.4rem]">una película</span>
            </h2>
            <p className="mt-4 max-w-xl text-slate-400">
              Cuatro formas de contar tu historia: del viaje que inspira al anuncio que convierte. Dirección, edición y color con acabado de cine.
            </p>
          </Reveal>
          <Reveal dir="left" delay={150} className="shrink-0">
            <a href="#contacto" className="btn-ghost">Reserva tu fecha <ArrowRight size={16} /></a>
          </Reveal>
        </div>

        {/* Galería: grid en desktop, carrusel infinito de 1 card en móvil */}
        <div className="relative mt-12">
          <div className="relative mx-auto max-w-[27rem] overflow-hidden sm:max-w-none sm:overflow-visible">
            <ul
              className={mobile ? "flex" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"}
              style={mobile ? {
                transform: `translateX(-${pos * 100}%)`,
                transitionProperty: "transform",
                transitionTimingFunction: "ease-out",
                transitionDuration: animate ? `${ms}ms` : "0ms",
              } : undefined}>
              {slides.map((s, k) => {
                const clone = mobile && (k === 0 || k === slides.length - 1);
                return (
                  <li key={`${s.title}-${k}`} aria-hidden={clone || undefined} className={mobile ? "h-auto w-full shrink-0 px-11" : ""}>
                    <Reveal delay={(k % n) * 110} className="h-full">
                      <ServiceCard s={s} clone={clone} onPlay={openVideo} />
                    </Reveal>
                  </li>
                );
              })}
            </ul>

            {/* Flechas: siempre activas (el bucle es infinito en ambos sentidos) */}
            {mobile && (
              <>
                <button type="button" onClick={() => move(-1)} aria-label="Ver el servicio anterior"
                  className="absolute left-0 top-[38%] z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/25 backdrop-blur-md transition duration-300 hover:bg-black/75 active:scale-90 motion-reduce:transition-none">
                  <ChevronLeft size={18} aria-hidden />
                </button>
                <button type="button" onClick={() => move(1)} aria-label="Ver el siguiente servicio"
                  className="absolute right-0 top-[38%] z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/25 backdrop-blur-md transition duration-300 hover:bg-black/75 active:scale-90 motion-reduce:transition-none">
                  <ChevronRight size={18} aria-hidden />
                </button>
              </>
            )}
          </div>

          {/* Indicador de posición (solo móvil) */}
          {mobile && (
            <div className="mt-5 flex items-center justify-center gap-1.5">
              {premiumServices.map((s, k) => (
                <span key={s.title} aria-hidden
                  className={`h-1.5 rounded-full transition-all duration-300 ${k === active ? "w-5 bg-white/85" : "w-1.5 bg-white/25"}`} />
              ))}
              <span className="sr-only" aria-live="polite">{`Servicio ${active + 1} de ${n}`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ventana de reproducción: centrada, por encima de todo (z-100 > header z-50) */}
      {playing && createPortal(
        <div onClick={closeVideo}
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-6 ${closing ? "pointer-events-none animate-fadeout" : "animate-fadein"}`}>
          <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`Video: ${playing.title}`}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-4xl transform-gpu outline-none ${closing ? "animate-modalout" : "animate-modalin"}`}>
            <div className="relative overflow-hidden rounded-2xl bg-black ring-1 ring-white/15"
              style={{ boxShadow: `0 0 0 1px ${rgba(playing.accent, 0.35)}, 0 40px 120px -40px ${rgba(playing.accent, 0.55)}` }}>
              {/* La portada de la card hace de póster: el marco nunca queda en negro y el video entra con un fundido cruzado */}
              <img src={playing.image} alt="" aria-hidden
                className={`pointer-events-none absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-700 ease-out ${videoReady ? "opacity-0" : "opacity-100"}`} />
              <video ref={videoRef} src={playing.video} poster={playing.image} controls autoPlay playsInline preload="metadata"
                onLoadedData={() => setVideoReady(true)} onCanPlay={() => setVideoReady(true)} onPlaying={() => setVideoReady(true)}
                onError={() => setVideoReady(false)}
                className="aspect-video max-h-[70svh] w-full bg-black object-contain" />
            </div>
            <div className="mt-3 flex items-start justify-between gap-4">
              <p className="text-sm leading-tight">
                <span className="font-semibold text-white">{playing.title}</span>
                <span aria-hidden className="mx-2 text-white/30">·</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">{playing.category}</span>
              </p>
              <button type="button" onClick={closeVideo}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition duration-300 hover:bg-white/10 motion-reduce:transition-none">
                <X size={14} aria-hidden /> Cerrar
              </button>
            </div>
          </div>
        </div>, document.body)}
    </section>
  );
}
