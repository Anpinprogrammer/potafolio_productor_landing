import type { PlayableVideo } from "./portfolioMedia";

export function shouldStartMuted(): boolean {
  return window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
}

/** Vimeo necesita su propio parámetro; los archivos conservan sus URLs firmadas. */
export function getAutoplayUrl(video: PlayableVideo, muted: boolean): string {
  if (video.provider !== "Vimeo") return video.url;
  const url = new URL(video.url);
  url.searchParams.set("muted", muted ? "1" : "0");
  return url.href;
}
