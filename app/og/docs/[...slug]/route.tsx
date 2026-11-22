import { notFound } from "next/navigation";
import { getPageImage, source } from "@/lib/source";
import { renderSocialImage } from "@/lib/social-image";

export const revalidate = false;

const sectionNames: Record<string, string> = {
    "start-here": "Start Here",
    "sdk-hardware": "FTC SDK & Hardware",
    teleop: "TeleOp",
    autonomous: "Autonomous",
    vision: "Vision",
    "code-organization": "Code Organization & Tools",
    reference: "Reference",
    about: "About",
};

export async function GET(_request: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
    const { slug } = await params;
    if (slug.at(-1) !== "image.png") notFound();

    const page = source.getPage(slug.slice(0, -1));
    if (!page) notFound();

    return renderSocialImage({
        title: page.data.title,
        section: sectionNames[page.slugs[0]] ?? "Documentation",
    });
}

export function generateStaticParams() {
    return source.getPages().map((page) => ({
        slug: getPageImage(page).segments,
    }));
}
