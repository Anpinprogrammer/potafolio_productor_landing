import type { premiumServices } from "../data";
import type { PortfolioProject } from "./portfolio";
import { coverUrl, coverSizes, resolveVideo, type PlayableVideo } from "./portfolioMedia.ts";

type CardPreset = (typeof premiumServices)[number];
export type PortfolioCard = Omit<CardPreset, "duration" | "image" | "video"> & {
  id: string;
  duration: string | null;
  image: string | null;
  imageAlt: string;
  imageSources: { media: string; url: string }[];
  poster: string | null;
  video: PlayableVideo | null;
  services: string[];
  featured: boolean;
  publishedAt: string | null;
  publishedDate: string | null;
};

const normalize = (value: string) => value.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const categoryKey = (value: string) => normalize(value).replace(/s$/, "");

export function formatDuration(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) return null;
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Sanity aporta el contenido y los medios; los iconos y colores siguen siendo locales. */
export function toPortfolioCards(
  projects: PortfolioProject[],
  presets: readonly CardPreset[],
): PortfolioCard[] {
  if (!presets.length) return [];
  return projects.map((project, index) => {
    const category = categoryKey(project.category?.title ?? "");
    const preset = presets.find((item) => categoryKey(item.category) === category)
      ?? presets.find((item) => normalize(item.title) === normalize(project.slug))
      ?? presets[index % presets.length];
    const services = [...new Set(project.serviceTitles.length ? project.serviceTitles : project.legacyServices)];
    const claim = project.tagline?.trim();
    return {
      ...preset,
      id: project._id,
      title: project.title,
      category: project.category?.title || "Proyecto",
      description: project.description,
      keywords: claim ? claim.split("·").map((word) => word.trim()).filter(Boolean) : [],
      pills: project.tags,
      duration: formatDuration(project.video?.durationSeconds ?? null),
      image: coverUrl(project.coverImage, 960, 800),
      imageAlt: project.coverImage?.alt || project.title,
      imageSources: coverSizes.flatMap(({ media, width, height }) => {
        const url = coverUrl(project.coverImage, width, height);
        return url ? [{ media, url }] : [];
      }),
      poster: coverUrl(project.coverImage, 1280, 720),
      position: "50% 50%", // El CDN ya aplica el hotspot para cada proporción.
      video: resolveVideo(project.video),
      services,
      featured: project.featured,
      publishedAt: project.publishedAt,
      publishedDate: project.publishedAt && Number.isFinite(Date.parse(project.publishedAt))
        ? new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Bogota" }).format(new Date(project.publishedAt))
        : null,
    };
  });
}
