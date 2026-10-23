import type { MetadataRoute } from "next"
import { projects } from "@/lib/projects"
import { team } from "@/lib/team"

const BASE_URL = "https://northbrook.com.gh"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date("2026-05-14"), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date("2026-05-14"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: new Date("2026-05-14"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/projects`, lastModified: new Date("2026-05-14"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/qhse`, lastModified: new Date("2026-05-14"), changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/partners`, lastModified: new Date("2026-05-14"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date("2026-05-14"), changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date("2026-05-14"),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }))

  const teamRoutes: MetadataRoute.Sitemap = team.map((member) => ({
    url: `${BASE_URL}/team/${member.slug}`,
    lastModified: new Date("2026-05-14"),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...teamRoutes]
}
