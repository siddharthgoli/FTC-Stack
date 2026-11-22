import { connection } from "next/server";
import { pickGuides, type Guide } from "./guide-selection";
import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import {
    docsContentRoute,
    docsImageRoute,
    docsRoute,
} from "@/app/layout.shared";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
    baseUrl: docsRoute,
    source: docs.toFumadocsSource(),
    pageTree: {
        transformers: [{
            file: (page) => ({ ...page, description: undefined }),
        }],
    },
});

export async function getGuideRecommendations() {
    await connection();

    const bySection = new Map<string, Guide[]>();
    for (const page of source.getPages()) {
        const [section] = page.slugs;
        if (page.slugs.length < 2 || section === "reference" || page.path.endsWith("/index.mdx")) {
            continue;
        }

        const group = bySection.get(section) ?? [];
        group.push({ title: page.data.title, href: page.url });
        bySection.set(section, group);
    }

    const groups = [...bySection.values()];
    return { groups, initialGuides: pickGuides(groups) };
}

export function getPageImage(page: (typeof source)["$inferPage"]) {
    const segments = [...page.slugs, "image.png"];

    return {
        segments,
        url: `${docsImageRoute}/${segments.join("/")}`,
    };
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
    const segments = [...page.slugs, "content.md"];

    return {
        segments,
        url: `${docsContentRoute}/${segments.join("/")}`,
    };
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
    const processed = await page.data.getText("processed");

    return `# ${page.data.title} (${page.url})

${processed}`;
}
