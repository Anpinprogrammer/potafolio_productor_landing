import { createImageUrlBuilder } from "@sanity/image-url";
import type { PortfolioCoverImage, PortfolioVideo } from "./portfolio";

export type PlayableVideo = {
  kind: "file" | "embed";
  url: string;
  originalUrl: string;
  provider: "YouTube" | "Vimeo" | null;
};

/** No pasa URLs arbitrarias a un iframe: solo admite reproductores conocidos. */
export function resolveVideo(video: PortfolioVideo | null): PlayableVideo | null {
  if (!video?.url) return null;
  let url: URL;
  try { url = new URL(video.url); } catch { return null; }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
  const file = /\.(mp4|webm)$/i.test(url.pathname);
  if (video.sourceType === "direct" || video.sourceType === "upload" || (video.sourceType === "legacy" && file)) {
    return file ? { kind: "file", url: url.href, originalUrl: url.href, provider: null } : null;
  }
  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  const youtubeHosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"];
  const youtubeId = ["youtu.be", "www.youtu.be"].includes(host) ? parts[0]
    : youtubeHosts.includes(host) ? (parts[0] === "watch" ? url.searchParams.get("v") : ["embed", "shorts", "live"].includes(parts[0]) ? parts[1] : null)
    : null;
  if (youtubeId && /^[\w-]{11}$/.test(youtubeId)) {
    const embed = new URL(`https://www.youtube-nocookie.com/embed/${youtubeId}`);
    embed.searchParams.set("autoplay", "1");
    embed.searchParams.set("playsinline", "1");
    embed.searchParams.set("rel", "0");
    const time = url.searchParams.get("start") || url.searchParams.get("t") || url.hash.match(/t=([^&]+)/)?.[1];
    const start = parseStartTime(time);
    if (start) embed.searchParams.set("start", String(start));
    return { kind: "embed", url: embed.href, originalUrl: url.href, provider: "YouTube" };
  }
  const vimeoId = ["vimeo.com", "www.vimeo.com"].includes(host) ? parts[0]
    : host === "player.vimeo.com" && parts[0] === "video" ? parts[1] : null;
  if (vimeoId && /^\d+$/.test(vimeoId)) {
    const embed = new URL(`https://player.vimeo.com/video/${vimeoId}`);
    const hash = url.searchParams.get("h") || (host !== "player.vimeo.com" ? parts[1] : null);
    if (hash && /^[a-z\d]+$/i.test(hash)) embed.searchParams.set("h", hash);
    embed.searchParams.set("autoplay", "1");
    embed.searchParams.set("playsinline", "1");
    return { kind: "embed", url: embed.href, originalUrl: url.href, provider: "Vimeo" };
  }
  return null;
}

function parseStartTime(value: string | null | undefined): number {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  return match ? Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0) : 0;
}

/** Genera derivados del CDN; el original y su recorte en Studio se conservan. */
export function coverUrl(cover: PortfolioCoverImage | null, width: number, height: number): string | null {
  if (!cover?.url) return null;
  try {
    const url = new URL(cover.url);
    const [, kind, projectId, dataset] = url.pathname.split("/");
    if (url.hostname !== "cdn.sanity.io" || kind !== "images" || url.protocol !== "https:") return null;
    return createImageUrlBuilder({ projectId, dataset })
      .image({ asset: { url: cover.url }, crop: cover.crop ?? undefined, hotspot: cover.hotspot ?? undefined })
      .width(width).height(height).fit("crop").auto("format").quality(85).url();
  } catch { return null; }
}

// Deben coincidir con las proporciones responsivas de ServiceCard.
export const coverSizes = [
  { media: "(min-width: 1536px)", width: 1200, height: 800 },
  { media: "(min-width: 1280px)", width: 960, height: 720 },
  { media: "(min-width: 768px)", width: 1000, height: 800 },
  { media: "(min-width: 640px)", width: 800, height: 800 },
] as const;
