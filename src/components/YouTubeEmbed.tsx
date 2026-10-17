import { useEffect, useRef } from "react";

interface Player {
  destroy(): void;
  getIframe(): HTMLIFrameElement;
  mute(): void;
  playVideo(): void;
}
interface YouTubeApi {
  Player: new (element: HTMLElement, options: {
    videoId: string;
    host: string;
    width: string;
    height: string;
    playerVars: Record<string, string | number>;
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
  const callbacks = useRef({ onReveal, onError });
  callbacks.current = { onReveal, onError };

  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let active = true;
    let player: Player | undefined;
    let fallback: number | undefined;
    const reveal = () => {
      window.clearTimeout(fallback);
      if (active) callbacks.current.onReveal();
    };
    const fail = () => {
      window.clearTimeout(fallback);
      if (active) callbacks.current.onError();
    };
    void loadYouTubeApi().then((api) => {
      if (!active) return;
      const url = new URL(src);
      const mount = document.createElement("div");
      host.append(mount);
      // Permite iniciar manualmente si no llega ningún evento de reproducción.
      fallback = window.setTimeout(reveal, 8000);
      player = new api.Player(mount, {
        videoId: url.pathname.split("/").pop()!,
        host: url.origin,
        width: "100%", height: "100%",
        playerVars: {
          autoplay: startMuted ? 0 : 1, controls: 1, playsinline: 1, rel: 0,
          origin: window.location.origin,
          start: Number(url.searchParams.get("start") || 0),
        },
        events: {
          onReady: ({ target }) => {
            if (!active || !startMuted) return;
            // Silencia antes del primer intento de reproducción para respetar la política móvil.
            target.mute();
            target.playVideo();
          },
          onStateChange: ({ data }) => { if (data === 1 || data === 2) reveal(); },
          onAutoplayBlocked: reveal,
          onError: fail,
        },
      });
      const iframe = player.getIframe();
      iframe.title = title;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
    }).catch(fail);
    return () => {
      active = false;
      window.clearTimeout(fallback);
      player?.destroy();
      host.replaceChildren();
    };
  }, [src, title, startMuted]);

  return <div ref={container} className="absolute inset-0 h-full w-full" />;
}
