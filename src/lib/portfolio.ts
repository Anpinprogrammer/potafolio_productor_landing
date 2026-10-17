import type { SanityClient } from "@sanity/client";
import type { SanityImageCrop, SanityImageHotspot } from "@sanity/image-url";

export interface PortfolioCoverImage {
  url: string;
  alt: string | null;
  crop: SanityImageCrop | null;
  hotspot: SanityImageHotspot | null;
}

export interface PortfolioVideo {
  sourceType: "external" | "direct" | "upload" | "legacy";
  url: string | null;
  durationSeconds: number | null;
}

export interface PortfolioProject {
  _id: string;
  title: string;
  slug: string;
  category: { title: string; slug: string } | null;
  description: string;
  tagline: string | null;
  tags: string[];
  serviceTitles: string[];
  legacyServices: string[];
  coverImage: PortfolioCoverImage | null;
  video: PortfolioVideo | null;
  featured: boolean;
  publishedAt: string | null;
}

export const portfolioQuery = /* groq */ `
  *[
    _type == "project"
    && !(_id in path("drafts.**"))
    && !(_id in path("versions.**"))
    && (!$featuredOnly || featured == true)
  ]
  | order(defined(order) desc, order asc, title asc, _id asc) {
    _id,
    "title": coalesce(title, "Proyecto sin título"),
    "slug": coalesce(slug.current, _id),
    "category": category->{title, "slug": slug.current},
    "description": coalesce(description, pt::text(synopsis), ""),
    tagline,
    "tags": coalesce(tags, []),
    "serviceTitles": coalesce((serviceReferences[]->title)[defined(@)], []),
    "legacyServices": coalesce(services, []),
    "coverImage": select(defined(coverImage.asset->url) => {
      "url": coverImage.asset->url,
      "alt": coalesce(coverImage.alt, title),
      "crop": coverImage.crop,
      "hotspot": coverImage.hotspot
    }, null),
    "video": select(
      video.sourceType in ["external", "direct", "upload"] => {
        "sourceType": video.sourceType,
        "url": select(
          video.sourceType == "upload" => video.videoFile.asset->url,
          video.externalUrl
        ),
        "durationSeconds": video.durationSeconds
      },
      defined(videoUrl) => {"sourceType": "legacy", "url": videoUrl, "durationSeconds": null},
      null
    ),
    "featured": coalesce(featured, false),
    publishedAt
  }
`;

export function fetchPortfolioProjects(
  client: Pick<SanityClient, "fetch">,
  signal?: AbortSignal,
  featuredOnly = false,
): Promise<PortfolioProject[]> {
  return client.fetch<PortfolioProject[]>(portfolioQuery, { featuredOnly }, {
    perspective: "published",
    signal,
  });
}
