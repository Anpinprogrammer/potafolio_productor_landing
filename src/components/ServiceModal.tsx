import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ExternalLink, LoaderCircle, Play, X } from "lucide-react";
import { formatServiceTitle, type Service } from "../lib/services";
import { resolveVideo } from "../lib/portfolioMedia";
import { getAutoplayUrl, shouldStartMuted } from "../lib/videoAutoplay";
import YouTubeEmbed from "./YouTubeEmbed";

type Props = {
  service: Service;
  opener: HTMLButtonElement;
  onDismiss: (quote: boolean) => void;
};

export default function ServiceModal({ service, opener, onDismiss }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const closingRef = useRef(false);
  const quoteRef = useRef(false);
  const [closing, setClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [startMuted] = useState(shouldStartMuted);
  const id = useId();
  const title = formatServiceTitle(service.title);
  const video = resolveVideo({ sourceType: "external", url: service.demoVideoUrl, durationSeconds: null });

  useLayoutEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    // Si el proveedor no confirma la carga, permite usar sus controles y el enlace externo.
    const loadingTimer = window.setTimeout(() => setLoading(false), 8000);
    return () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(loadingTimer);
      node.close();
      document.body.style.overflow = previousOverflow;
      if (!quoteRef.current && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [opener]);

  const close = (quote = false) => {
    if (closingRef.current) return;
    closingRef.current = true;
    quoteRef.current = quote;
    setClosing(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => onDismiss(quote), reduced ? 0 : 260);
  };

  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])',
    )].filter(element => element.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  };

  return createPortal(
    <dialog ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-workflow`}
      onKeyDown={trapFocus}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => { if (!panel.current?.contains(event.target as Node)) close(); }}
      className={`fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-4 text-white backdrop:bg-black/75 backdrop:backdrop-blur-md open:flex open:items-center open:justify-center sm:p-6 ${closing ? "animate-fadeout" : "animate-fadein"}`}>
      <div ref={panel} className={`relative max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl sm:max-h-[calc(100dvh-3rem)] ${closing ? "animate-modalout" : "animate-modalin"}`}>
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-zinc-900/95 p-5 backdrop-blur-md sm:p-6">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand">Conoce el servicio</p>
            <h2 id={`${id}-title`} className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</h2>
          </div>
          <button type="button" autoFocus onClick={() => close()} aria-label="Cerrar detalles del servicio"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
            <X size={22} aria-hidden />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
            {video && !failed && !closing ? video.provider === "YouTube" ? (
              <YouTubeEmbed src={video.url} title={`Demostración de ${title}`} startMuted={startMuted}
                onReveal={() => setLoading(false)} onError={() => { setLoading(false); setFailed(true); }} />
            ) : (
              <iframe src={getAutoplayUrl(video, startMuted)} title={`Demostración de ${title}`} allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setLoading(false)} onError={() => { setLoading(false); setFailed(true); }}
                className="absolute inset-0 h-full w-full border-0" />
            ) : !closing && (
              <div role="status" className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center text-sm text-zinc-400">
                <Play size={28} className="text-brand" aria-hidden />
                <p>{failed ? "No pudimos cargar la demostración. Puedes abrir el video en su plataforma." : "Pronto podrás ver una demostración de este servicio. Mientras tanto, cuéntame tu idea."}</p>
              </div>
            )}
            {video && loading && !failed && !closing && <div role="status" className="pointer-events-none absolute inset-0 grid place-content-center gap-3 bg-zinc-950/80 text-center text-sm text-zinc-300">
              <LoaderCircle size={28} aria-hidden className="mx-auto animate-spin text-emerald-400 motion-reduce:animate-none" />
              Cargando demostración…
            </div>}
          </div>
          {video && <a href={video.originalUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-400 underline underline-offset-4 hover:text-emerald-300">
            Abrir en {video.provider} <ExternalLink size={13} aria-hidden />
          </a>}
          {video && startMuted && <p className="mt-2 text-xs leading-relaxed text-zinc-400">El video inicia sin sonido. Actívalo en los controles del reproductor.</p>}
          <div className="mt-7">
            <h3 className="text-sm font-semibold text-brand">Así trabajaremos</h3>
            <p id={`${id}-workflow`} className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
              {service.workflow?.trim() || "Revisamos tu idea, los materiales y las referencias para definir el enfoque y los tiempos. Preparo una primera versión, ajustamos los detalles con tus comentarios y entrego el resultado final en el formato acordado."}
            </p>
          </div>
          <button type="button" onClick={() => close(true)} className="group mt-7 btn-primary sm:w-auto">
            Cotizar este servicio <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
          </button>
        </div>
      </div>
    </dialog>, document.body,
  );
}
