import { useLayoutEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { getYouTubeAutoplayUrl } from "../lib/videoAutoplay";

interface Player {
  destroy(): void;
  getIframe(): HTMLIFrameElement;
  mute(): void;
  playVideo(): void;
  getPlayerState(): number;
}
interface YouTubeApi {
  Player: new (element: HTMLElement, options: {
    events: {
      onReady(event: { target: Player }): void;
      onStateChange(event: { data: number }): void;
      onAutoplayBlocked(): void;
      onError(): void;
    };
  }) => Player;
}

let apiPromise: Promise<YouTubeApi> | undefined;
function loadYouTubeApi(): Promise<YouTubeApi> {
  const getApi = () => (window as Window & { YT?: YouTubeApi }).YT;
  if (getApi()?.Player) return Promise.resolve(getApi()!);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    const created = !script;
    script ??= document.createElement("script");
    const cleanup = () => { window.clearInterval(poll); window.clearTimeout(timeout); script.removeEventListener("error", fail); };
    const fail = () => {
      cleanup();
      if (created) script.remove();
      apiPromise = undefined;
      reject(new Error("No se pudo cargar el reproductor de YouTube."));
    };
    const poll = window.setInterval(() => {
      const api = getApi();
      if (api?.Player) { cleanup(); resolve(api); }
    }, 50);
    const timeout = window.setTimeout(fail, 10000);
    script.addEventListener("error", fail, { once: true });
    if (created) {
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.append(script);
    }
  });
  return apiPromise;
}

/** Retira la portada cuando comienza la reproducción, no al cargar el iframe. */
export default function YouTubeEmbed({ src, title, onReveal, onError, startMuted = false }: {
  src: string; title: string; onReveal: () => void; onError: () => void; startMuted?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const controls = useRef<Player | null>(null);
  const [blocked, setBlocked] = useState(false);
  const callbacks = useRef({ onReveal, onError });
  callbacks.current = { onReveal, onError };

  useLayoutEffect(() => {
    const host = container.current;
    if (!host) return;
    let active = true;
    let player: Player | undefined;
    let fallback: number | undefined;
    controls.current = null;
    setBlocked(false);
    const reveal = () => {
      window.clearTimeout(fallback);
      if (active) callbacks.current.onReveal();
    };
    const fail = () => {
      window.clearTimeout(fallback);
      if (active) callbacks.current.onError();
    };
    const showManualPlay = () => {
      reveal();
      if (active && controls.current) setBlocked(true);
    };
    // Se inserta con todos sus permisos y parámetros antes de que termine el gesto del usuario.
    // La API se conecta después, únicamente para controlar y observar el reproductor existente.
    const iframe = document.createElement("iframe");
    iframe.title = title;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.className = "absolute inset-0 h-full w-full border-0";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.src = getYouTubeAutoplayUrl(src, startMuted, window.location.origin);
    host.append(iframe);
    fallback = window.setTimeout(showManualPlay, 8000);
    void loadYouTubeApi().then((api) => {
      if (!active) return;
      player = new api.Player(iframe, {
        events: {
          onReady: ({ target }) => {
            if (!active) return;
            controls.current = target;
            if (startMuted) target.mute();
            const state = target.getPlayerState();
            if (state === 1 || state === 2) reveal();
            else target.playVideo();
          },
          onStateChange: ({ data }) => {
            if (!active) return;
            if (data === 1) setBlocked(false);
            if (data === 1 || data === 2) reveal();
          },
          onAutoplayBlocked: showManualPlay,
          onError: fail,
        },
      });
    }).catch(() => {
      // Un fallo del SDK no impide usar el iframe oficial que ya está cargado.
      reveal();
    });
    return () => {
      active = false;
      window.clearTimeout(fallback);
      player?.destroy();
      controls.current = null;
      host.replaceChildren();
    };
  }, [src, title, startMuted]);

  return <>
    <div ref={container} className="absolute inset-0 h-full w-full" />
    {blocked && <button type="button" onClick={() => {
      // Este gesto explícito permite reproducir cuando iOS bloquea el autoplay por ahorro.
      controls.current?.playVideo();
      setBlocked(false);
    }} className="absolute left-1/2 top-1/2 z-30 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink shadow-xl hover:bg-zinc-100">
      <Play size={18} aria-hidden /> Reproducir video
    </button>}
  </>;
}
