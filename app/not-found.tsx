import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { GuidePicker } from "@/components/guide-picker";
import { getGuideRecommendations } from "@/lib/source";
import styles from "./landing.module.css";

export default async function NotFound() {
    const guides = await getGuideRecommendations();

    return (
        <main className={`${styles.backdrop} relative isolate min-h-dvh overflow-hidden`}>
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-10 md:py-16 lg:px-12">
                <section aria-labelledby="not-found-title" className="mx-auto max-w-xl text-center">
                    <h1 id="not-found-title" className="font-semibold tracking-tight">
                        <span className="block text-8xl leading-none tracking-[-0.07em] text-fd-primary sm:text-[10rem]">
                            404
                        </span>
                        <span className="mt-4 block text-3xl sm:text-5xl">Page not found</span>
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-fd-muted-foreground">
                        This page may have moved. Pick a guide below to get back on track.
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-4 py-2.5 text-sm font-medium hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
                    >
                        <ArrowLeftIcon aria-hidden="true" className="size-4" />
                        Back to home
                    </Link>
                </section>
                <GuidePicker {...guides} className="mt-8 sm:mt-10 lg:mt-12" />
            </div>
        </main>
    );
}
