import type { PlayableVideo } from "./portfolioMedia";

export function shouldStartMuted(): boolean {
  return window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
}

/** El iframe puede empezar a cargar durante el toque, sin esperar al SDK de YouTube. */
export function getYouTubeAutoplayUrl(src: string, muted: boolean, origin: string): string {
  const url = new URL(src);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("mute", muted ? "1" : "0");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("enablejsapi", "1");
  url.searchParams.set("origin", origin);
  return url.href;
}

/** Vimeo necesita su propio parámetro; los archivos conservan sus URLs firmadas. */
export function getAutoplayUrl(video: PlayableVideo, muted: boolean): string {
  if (video.provider !== "Vimeo") return video.url;
  const url = new URL(video.url);
  url.searchParams.set("muted", muted ? "1" : "0");
  return url.href;
}
