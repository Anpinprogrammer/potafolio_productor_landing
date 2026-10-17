import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Reveal from "./Reveal";
import YouTubeEmbed from "./YouTubeEmbed";
import VideoOpening from "./VideoOpening";
import { premiumServices } from "../data";
import { usePortfolioProjects } from "../lib/usePortfolioProjects";
import { toPortfolioCards, type PortfolioCard } from "../lib/portfolioCards";
import { getAutoplayUrl, shouldStartMuted } from "../lib/videoAutoplay";

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

type Service = PortfolioCard;

function ServiceCard({ s, clone, onPlay }: { s: Service; clone?: boolean; onPlay: (s: Service, el: HTMLElement) => void }) {
  const Icon = s.icon;
  return (
    <article className="group h-full">
      <div
        className="flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_28px_60px_-30px_rgba(0,0,0,.95)] ring-1 ring-white/10 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-32px_rgba(0,0,0,1)] motion-reduce:transition-none">
        {/* Proporciones más compactas en escritorio para evitar tarjetas demasiado altas. */}
        <div className="relative aspect-[6/5] shrink-0 overflow-hidden sm:aspect-square md:aspect-[5/4] xl:aspect-[4/3] 2xl:aspect-[3/2]">
          {s.image ? <picture>
            {s.imageSources.map(({ media, url }) => <source key={media} media={media} srcSet={url} />)}
            <img src={s.image} alt={s.imageAlt} width={960} height={800} loading="lazy" decoding="async"
              style={{ objectPosition: s.position, filter: "contrast(1.14) saturate(1.05) brightness(.92)" }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none" />
          </picture> : <div className="absolute inset-0 bg-navy" role="img" aria-label={`Sin portada: ${s.title}`} />}
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
            <div className="flex max-w-[75%] flex-wrap gap-2">
              <span className="flex items-center gap-2 rounded-full bg-black/35 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 ring-1 ring-white/15 backdrop-blur-md">
                <Icon size={13} style={{ color: s.accent }} aria-hidden /> {s.category}
              </span>
              {/*s.featured && <span className="rounded-full bg-black/45 px-2.5 py-1.5 text-[10px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md">Destacado</span>*/}
            </div>
            {s.duration && <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-white ring-1 ring-white/15 backdrop-blur-md">
              {s.duration}
            </span>}
          </div>

          {/* Fila inferior: título + play */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <h3 className="max-w-[68%] hyphens-auto break-words text-[27px] lg:line-clamp-3 font-extrabold leading-[0.94] tracking-tight text-white lg:text-[24px] xl:text-[27px] 2xl:text-[32px]"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,.55)" }}>
              {s.title}
            </h3>
            <button type="button" tabIndex={clone ? -1 : undefined} disabled={!s.video}
              title={s.video ? undefined : "Video no disponible"}
              onClick={(e) => onPlay(s, e.currentTarget)}
              aria-label={s.video ? `Reproducir el video de ${s.title}` : `Video no disponible para ${s.title}`}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 disabled:cursor-default disabled:opacity-40 text-white ring-1 ring-white/60 backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink group-hover:scale-105 group-hover:bg-white group-hover:text-ink motion-reduce:transition-none"
              style={{ boxShadow: `0 0 0 6px ${rgba(s.accent, 0.13)}, 0 12px 30px -10px ${rgba(s.accent, 0.7)}` }}>
              <Play size={15} fill="currentColor" aria-hidden className="translate-x-[1px]" />
            </button>
          </div>
        </div>

        {/* El contenido mantiene su altura natural, sin estirar la portada. */}
        <div className="flex flex-1 flex-col bg-[#fbfaf8] p-4">
          <p className="min-h-[24px] text-[9px] font-bold uppercase leading-[1.3] tracking-[0.2em] text-slate-500">
            {s.keywords.join(" · ")}
          </p>
          <span aria-hidden className="mt-1 h-[3px] w-9 rounded-full" style={{ background: s.accent }} />
          <p className="mt-2 line-clamp-3 text-[12px] leading-[1.45] text-slate-600">{s.description}</p>
          {s.services.length > 0 && <p className="mt-2 text-[10px] leading-relaxed text-slate-500"><span className="font-semibold">Servicios: </span>{s.services.join(" · ")}</p>}
          {s.publishedAt && s.publishedDate && <time dateTime={s.publishedAt} className="mt-2 text-[10px] text-slate-500">{s.publishedDate}</time>}
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

type Collection = "featured" | "all";

export default function PremiumServices({ collection = "featured" }: { collection?: Collection }) {
  const { projects, loading, error, retry } = usePortfolioProjects({ featuredOnly: collection === "featured" });
  const cards = useMemo(() => toPortfolioCards(projects, premiumServices), [projects]);
  return <PremiumServicesContent key={`${collection}:${cards.map((card) => card.id).join(",")}`} collection={collection} cards={cards} loading={loading} error={error} onRetry={retry} />;
}

function PremiumServicesContent({ cards, loading, error, onRetry, collection }: {
  cards: PortfolioCard[]; loading: boolean; error: boolean; onRetry: () => void; collection: Collection;
}) {
  const n = cards.length;
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE).matches);
  const carousel = mobile && collection === "featured";
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
    if (n < 2) return;
    if (locked.current) { queued.current += dir; return; } // nunca se desactivan: se encolan
    locked.current = true;
    setAnimate(true);
    apply(posRef.current + dir);
    window.setTimeout(settle, ms + 20);
  };

  const active = n > 1 ? ((pos - 1) % n + n) % n : 0;
  // En móvil se añaden clones al inicio y al final para que el bucle no tenga corte
  const slides = carousel && n > 1 ? [cards[n - 1], ...cards, cards[0]] : cards;

  /* ---------- Reproductor en ventana modal ---------- */
  const [playing, setPlaying] = useState<Service | null>(null);
  const [closing, setClosing] = useState(false); // true = animación de salida en curso
  const [videoError, setVideoError] = useState(false);
  const [videoReady, setVideoReady] = useState(false); // póster visible hasta que el video puede reproducirse
  const [startMuted, setStartMuted] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitTimer = useRef<number | null>(null);

  const openVideo = (s: Service, el: HTMLElement) => {
    if (!s.video) return;
    if (exitTimer.current) { window.clearTimeout(exitTimer.current); exitTimer.current = null; }
    openerRef.current = el;
    setStartMuted(shouldStartMuted());
    setVideoReady(false);
    setVideoError(false);
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
  // YouTube confirma la reproducción mediante su API; Vimeo y archivos conservan el respaldo temporal.
  useEffect(() => {
    if (!playing) { setVideoReady(false); return; }
    setVideoReady(false);
    if (playing.video?.provider === "YouTube") return;
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
      const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>('button, video, iframe, [href], [tabindex]:not([tabindex="-1"])')]
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
    <section id="portafolio" aria-label={collection === "all" ? "Todos los proyectos del portafolio" : "Proyectos destacados"} aria-busy={loading}
      className={`relative overflow-hidden ${collection === "all" ? "pb-20 pt-8" : "py-12 lg:py-20"}`}
      style={collection === "featured" ? { background: "radial-gradient(130% 100% at 50% 0%, #0a1420 0%, #03060c 55%, #010204 100%)" } : undefined}>
      {/* Ambiente: halos de color + grano */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={collection === "all" ? { maskImage: "linear-gradient(to bottom, transparent 0%, black 160px)" } : undefined}>
        <div className="absolute -top-40 left-1/2 h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-brand/25 blur-[140px]" />
        <div className="absolute -bottom-32 -right-24 h-[420px] w-[560px] rounded-full bg-brand2/40 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-soft-light" style={{ backgroundImage: GRAIN }} />
      </div>

      <div className="wrap relative">
        {/* Cabecera editorial */}
        {collection === "featured" && <div className="flex flex-col gap-8 border-b border-white/10 pb-9 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              <span aria-hidden className="h-px w-10 bg-brand/60" /> Proyectos destacados <span aria-hidden className="h-px w-10 bg-brand/60" />
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold leading-[1.06] text-white lg:text-5xl">
              Cada proyecto, <span className="font-script text-[2.38rem] font-normal text-brand md:text-[3.4rem]">una película</span>
            </h2>
            <p className="mt-4 max-w-xl text-slate-400">
              Una selección de mis proyectos destacados: del viaje que inspira al anuncio que convierte. Dirección, edición y color con acabado de cine.
            </p>
          </Reveal>
          <Reveal dir="left" delay={150} className="shrink-0">
            <Link to="/proyectos" className="btn-ghost">Ver todos los proyectos <ArrowRight size={16} /></Link>
          </Reveal>
        </div>}

        {/* Galería: grid en desktop, carrusel infinito de 1 card en móvil */}
        <div className={`relative ${collection === "featured" ? "mt-12" : ""}`}>
          {!n && (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center text-sm text-slate-400" role={error ? "alert" : "status"}>
              <p>{loading ? "Cargando proyectos…" : error ? "No pudimos cargar los proyectos." : collection === "featured" ? "Pronto encontrarás nuevos proyectos destacados aquí." : "Pronto encontrarás nuevos proyectos aquí."}</p>
              {error && !loading && <button type="button" onClick={onRetry} className="btn-ghost">Volver a intentar</button>}
            </div>
          )}
          <div className={collection === "all" ? "relative" : "relative mx-auto max-w-[27rem] overflow-hidden sm:max-w-none sm:overflow-visible"}>
            <ul
              className={collection === "all" ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" : carousel ? "flex" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"}
              style={carousel && n > 1 ? {
                transform: `translateX(-${pos * 100}%)`,
                transitionProperty: "transform",
                transitionTimingFunction: "ease-out",
                transitionDuration: animate ? `${ms}ms` : "0ms",
              } : undefined}>
              {slides.map((s, k) => {
                const clone = carousel && n > 1 && (k === 0 || k === slides.length - 1);
                return (
                  <li key={`${s.id}-${k}`} aria-hidden={clone || undefined} className={carousel ? "h-auto w-full shrink-0 px-11" : "min-w-0"}>
                    <Reveal delay={collection === "all" ? (k % 3) * 90 : (k % n) * 110} className="h-full">
                      <ServiceCard s={s} clone={clone} onPlay={openVideo} />
                    </Reveal>
                  </li>
                );
              })}
            </ul>

            {/* Flechas: siempre activas (el bucle es infinito en ambos sentidos) */}
            {carousel && n > 1 && (
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
          {carousel && n > 1 && (
            <div className="mt-5 flex items-center justify-center gap-1.5">
              {cards.map((s, k) => (
                <span key={s.id} aria-hidden
                  className={`h-1.5 rounded-full transition-all duration-300 ${k === active ? "w-5 bg-white/85" : "w-1.5 bg-white/25"}`} />
              ))}
              <span className="sr-only" aria-live="polite">{`Servicio ${active + 1} de ${n}`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ventana de reproducción: centrada, por encima de todo (z-100 > header z-50) */}
      {playing?.video && createPortal(
        <div onClick={closeVideo}
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-6 ${closing ? "pointer-events-none animate-fadeout" : "animate-fadein"}`}>
          {/* El reproductor se adapta al ancho disponible y conserva la orientación del dispositivo. */}
          <div className="flex w-full items-center justify-center">
            <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`Video: ${playing.title}`}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-4xl transform-gpu outline-none ${closing ? "animate-modalout" : "animate-modalin"}`}>
              <div className="relative aspect-video max-h-[70svh] overflow-hidden rounded-2xl bg-black ring-1 ring-white/15"
                style={{ boxShadow: `0 0 0 1px ${rgba(playing.accent, 0.35)}, 0 40px 120px -40px ${rgba(playing.accent, 0.55)}` }}>
                <VideoOpening key={playing.id} poster={playing.poster} title={playing.title}
                  category={playing.category} accent={playing.accent} grain={GRAIN}
                  ready={videoReady} failed={videoError} reducedMotion={reduce} />
                {playing.video.provider === "YouTube" ? (
                  <YouTubeEmbed src={playing.video.url} title={`Reproducir ${playing.title}`} startMuted={startMuted}
                    onReveal={() => setVideoReady(true)}
                    onError={() => { setVideoReady(true); setVideoError(true); }} />
                ) : playing.video.kind === "embed" ? (
                  <iframe key={playing.video.url} src={getAutoplayUrl(playing.video, startMuted)} title={`Reproducir ${playing.title}`}
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    onLoad={() => setVideoReady(true)} onError={() => { setVideoReady(true); setVideoError(true); }}
                    className="absolute inset-0 h-full w-full border-0" />
                ) : (
                  <video key={playing.video.url} ref={videoRef} src={playing.video.url} poster={playing.poster ?? undefined} controls autoPlay muted={startMuted} playsInline preload="metadata"
                    onLoadedData={() => setVideoReady(true)} onCanPlay={() => setVideoReady(true)} onPlaying={() => setVideoReady(true)}
                    onError={() => { setVideoReady(true); setVideoError(true); }}
                    className="absolute inset-0 h-full w-full bg-black object-contain" />
                )}
                {videoError && <div role="alert" className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/90 p-6 text-center text-sm text-white">
                  <p>No pudimos reproducir este video.</p>
                  <a href={playing.video.originalUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Abrir el video</a>
                </div>}
              </div>
              <div className="mt-3 flex items-start justify-between gap-4">
                <div className="text-sm leading-tight">
                  <p><span className="font-semibold text-white">{playing.title}</span>
                  <span aria-hidden className="mx-2 text-white/30">·</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">{playing.category}</span></p>
                  {playing.video.provider && <a href={playing.video.originalUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-white/70 underline underline-offset-4 hover:text-white">Ver en {playing.video.provider}</a>}
                  {startMuted && <p className="mt-2 text-xs leading-relaxed text-white/60">El video inicia sin sonido. Actívalo en los controles del reproductor.</p>}
                </div>
                <button type="button" onClick={closeVideo}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition duration-300 hover:bg-white/10 motion-reduce:transition-none">
                  <X size={14} aria-hidden /> Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>, document.body)}
    </section>
  );
}
