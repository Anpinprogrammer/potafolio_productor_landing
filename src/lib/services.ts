import type { SanityClient } from "@sanity/client";

export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  demoVideoUrl: string | null;
  workflow: string;
}

const serviceTitles = new Map([
  ["edicion youtube", "Edición para YouTube"],
  ["edicion para youtube", "Edición para YouTube"],
  ["reels y redes sociales", "Social Media & Reels"],
  ["social media & reels", "Social Media & Reels"],
  ["color grading", "Color Grading"],
  ["motion graphics", "Motion Graphics"],
  ["mejora de audio", "Mejora de Audio"],
]);

/** Ajustes editoriales de la landing; los demás nombres de Sanity se conservan. */
export function formatServiceTitle(title: string): string {
  const key = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toLowerCase();
  return serviceTitles.get(key) ?? title;
}

export const servicesQuery = /* groq */ `
  *[
    _type == "service"
    && !(_id in path("drafts.**"))
    && !(_id in path("versions.**"))
  ]
  | order(defined(order) desc, order asc, title asc, _id asc) {
    _id,
    "title": coalesce(title, "Servicio sin título"),
    "slug": coalesce(slug.current, _id),
    "description": coalesce(description, ""),
    icon,
    "workflow": coalesce(workflow, ""),
    "demoVideoUrl": coalesce(demoVideoUrl, *[
      _type == "project"
      && references(^._id)
      && !(_id in path("drafts.**"))
      && !(_id in path("versions.**"))
      && ((video.sourceType == "external" && defined(video.externalUrl)) || defined(videoUrl))
    ] | order(coalesce(featured, false) desc, defined(order) desc, order asc, title asc, _id asc)[0]{
      "url": coalesce(select(video.sourceType == "external" => video.externalUrl), videoUrl)
    }.url, null)
  }
`;

export function fetchServices(
  client: Pick<SanityClient, "fetch">,
  signal?: AbortSignal,
): Promise<Service[]> {
  return client.fetch<Service[]>(servicesQuery, {}, {
    perspective: "published",
    signal,
  });
}
