import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const siteUrl = "https://www.ftcstack.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const urls = new Set<string>([`${siteUrl}/`]);

    for (const page of source.getPages()) {
        const url = new URL(page.url, siteUrl);
        url.search = "";
        url.hash = "";
        urls.add(url.toString());
    }

    return Array.from(urls, (url) => ({ url }));
}
