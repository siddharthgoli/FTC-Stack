import { getPageImage, getPageMarkdownUrl, source } from "@/lib/source";
import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
    MarkdownCopyButton,
    ViewOptionsPopover,
    PageFooter,
} from "fumadocs-ui/layouts/docs/page";
import { Feedback } from "@/components/feedback/client";
import { type PageFeedback } from "@/components/feedback/schema";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { gitConfig } from "@/app/layout.shared";
import { createClient } from "@/utils/supabase/server";
import { Footer } from "@/components/footer";

async function submitPageFeedback(feedback: PageFeedback) {
    "use server";

    const supabase = await createClient();
    const resourcePath = (() => {
        try {
            return new URL(feedback.url).pathname;
        } catch {
            return feedback.url;
        }
    })();

    const { error } = await supabase.from("feedback").insert({
        resource_path: resourcePath,
        opinion: feedback.opinion === "good",
        solved: feedback.solved,
        learned: feedback.learned,
        improved: feedback.improved,
        team_number: feedback.teamNumber,
        message: feedback.message,
    });

    if (error) {
        console.error("Failed to save feedback", error);
        return { success: false };
    }

    return { success: true };
}

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    const MDX = page.data.body;
    const markdownUrl = getPageMarkdownUrl(page).url;

    return (
        <>
            <DocsPage
                toc={page.data.toc}
                full={page.data.full}
                tableOfContent={{
                    footer: (
                        <div className="mt-4 border-t pt-4">
                            <Feedback onSendAction={submitPageFeedback} />
                        </div>
                    ),
                }}
            >
                <DocsTitle>{page.data.title}</DocsTitle>
                <DocsDescription className="mb-0">
                    {page.data.description}
                </DocsDescription>
                <div className="flex flex-row gap-2 items-center border-b">
                    {/* <MarkdownCopyButton markdownUrl={markdownUrl} />
                <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        /> */}
                </div>
                <DocsBody>
                    <MDX
                        components={getMDXComponents({
                            // this allows you to link to other pages with relative file paths
                            a: createRelativeLink(source, page),
                        })}
                    />
                </DocsBody>
                <div className="xl:hidden max-xl:col-start-3 max-xl:col-end-4 px-4 pt-4 md:px-6">
                    <div className="border-t pt-4">
                        <Feedback onSendAction={submitPageFeedback} />
                    </div>
                </div>
            </DocsPage>
            <Footer className="row-start-4 col-start-3 col-end-5 xl:col-end-6" />
        </>
    );
}

export async function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata(
    props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
        openGraph: {
            images: getPageImage(page).url,
        },
    };
}
