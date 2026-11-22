"use client";

import { ArrowRightIcon, ShuffleIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useId, useState } from "react";
import { pickGuides, type Guide } from "@/lib/guide-selection";

export function GuidePicker({
    groups,
    initialGuides,
    className,
}: {
    groups: Guide[][];
    initialGuides: Guide[];
    className?: string;
}) {
    const titleId = useId();
    const [guides, setGuides] = useState(initialGuides);

    return (
        <section
            aria-labelledby={titleId}
            className={`border border-fd-border bg-fd-card [--guide-inset:1.25rem] rounded-[calc(var(--radius-lg)+var(--guide-inset))] p-(--guide-inset) sm:[--guide-inset:1.5rem] ${className ?? ""}`}
        >
            <div className="flex items-center justify-between gap-2 sm:gap-3">
                <h2 id={titleId} className="text-lg font-semibold tracking-tight sm:text-2xl">
                    Jump into a guide
                </h2>
                <button
                    data-guide-shuffle
                    type="button"
                    onClick={() => setGuides(pickGuides(groups))}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-fd-border px-2 py-2 text-sm font-medium hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring sm:gap-2 sm:px-3"
                >
                    <ShuffleIcon aria-hidden="true" className="size-4 text-fd-primary" />
                    <span>Shuffle<span className="sr-only sm:not-sr-only"> guides</span></span>
                </button>
            </div>
            <ul aria-live="polite" aria-atomic="true" className="mt-4 grid gap-x-6 md:grid-cols-3">
                {guides.map(({ title, href }) => (
                    <li key={href} className="border-t border-fd-border">
                        <Link
                            data-guide-row
                            href={href}
                            className="flex items-center justify-between gap-3 py-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
                        >
                            {title}
                            <ArrowRightIcon aria-hidden="true" className="size-4 shrink-0 text-fd-primary" />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
