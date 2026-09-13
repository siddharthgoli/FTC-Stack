import Link from "next/link";
import {
    ArrowRight,
    Blocks,
    BrainCircuit,
    BookOpenText,
    Check,
    Code2,
    Cpu,
    Eye,
    Gauge,
    Sparkles,
} from "lucide-react";

const sectionCards = [
    {
        title: "Learn",
        description:
            "FTC fundamentals, Java, the SDK, and everything you need to get started.",
        href: "/docs/learn/getting-started",
        icon: Sparkles,
    },
    {
        title: "Program",
        description:
            "Architecture, subsystems, TeleOp, autonomous, and competitive code structure.",
        href: "/docs/program/teleop",
        icon: Code2,
    },
    // {
    //     title: "Control Theory",
    //     description:
    //         "Feedback systems, PID, motion control, localization, and tuning.",
    //     href: "/docs/control-theory/open-closed",
    //     icon: Gauge,
    // },
    {
        title: "Vision",
        description:
            "AprilTags, OpenCV, Limelight, pose estimation, and vision pipelines.",
        href: "/docs/vision",
        icon: Eye,
    },
    // {
    //     title: "Reference",
    //     description:
    //         "Libraries, tools, terminology, and resources for building your robot.",
    //     href: "/docs/reference/resources",
    //     icon: BookOpenText,
    // },
];

export default function HomePage() {
    return (
        <main className="min-h-screen">
            {/* Background */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px] overflow-hidden">
                <div className="absolute left-1/2 top-[-300px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/[0.08] blur-3xl" />

                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />
            </div>

            <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10 lg:px-12 lg:pb-32 lg:pt-24">
                {/* Hero */}
                <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-fd-foreground md:text-6xl lg:text-7xl lg:leading-[1.05]">
                            Your foundation for FTC software.
                            <br />
                            {/* <span className="text-fd-muted-foreground">
                                Write better code.
                            </span> */}
                        </h1>

                        <p className="mt-7 max-w-2xl text-lg leading-8 text-fd-muted-foreground md:text-xl">
                            FTC Stack is a practical programming curriculum for
                            teams that want to move beyond getting a robot to
                            work and start building software that can compete.
                        </p>

                        <div className="mt-8 flex flex-col items-start gap-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/70 px-3.5 py-1.5 text-sm text-fd-muted-foreground backdrop-blur">
                                {" "}
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/10">
                                    {" "}
                                    <Code2 className="h-3 w-3 text-sky-400" />{" "}
                                </span>
                                Created by Siddharth Goli • 14481 Don&apos;t
                                Blink
                            </div>

                            <Link
                                href="/docs"
                                className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground transition-all hover:-translate-y-0.5"
                            >
                                Get Started
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Documentation Sections */}
                    <div className="rounded-[1.75rem] border border-fd-border bg-fd-card/60 p-6 backdrop-blur md:p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">
                                    Documentation
                                </p>
                            </div>

                            <BookOpenText className="h-5 w-5 text-fd-muted-foreground/50" />
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {sectionCards.map((section) => {
                                const Icon = section.icon;

                                return (
                                    <Link
                                        key={section.title}
                                        href={section.href}
                                        className="group rounded-2xl border border-fd-border bg-fd-card/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-fd-card"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/10">
                                                <Icon className="h-4 w-4 text-sky-400" />
                                            </div>

                                            <ArrowRight className="h-3.5 w-3.5 text-fd-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-sky-400 group-hover:opacity-100" />
                                        </div>

                                        <h3 className="mt-3 text-sm font-semibold text-fd-foreground">
                                            {section.title}
                                        </h3>

                                        <p className="mt-1.5 text-xs leading-5 text-fd-muted-foreground">
                                            {section.description}
                                        </p>
                                    </Link>
                                );
                            })}

                            {/* Future Section */}
                            <div className="flex min-h-[132px] flex-col justify-center rounded-2xl border border-dashed border-fd-border bg-fd-card/30 p-4 opacity-50">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fd-muted/10">
                                    <Blocks className="h-4 w-4 text-fd-muted-foreground" />
                                </div>

                                <h3 className="mt-3 text-sm font-semibold text-fd-muted-foreground">
                                    More coming soon
                                </h3>

                                <p className="mt-1.5 text-xs leading-5 text-fd-muted-foreground">
                                    More FTC programming resources are on the
                                    way.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="relative mt-28 overflow-hidden rounded-[2rem] border border-fd-border bg-fd-card/60 px-6 py-12 text-center md:px-12 md:py-16">
                    <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/[0.08] blur-3xl" />

                    <div className="relative">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10">
                            <Cpu className="h-6 w-6 text-sky-400" />
                        </div>

                        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-fd-foreground">
                            Ready to build better?
                        </h2>

                        <p className="mx-auto mt-3 max-w-xl text-fd-muted-foreground">
                            Start with the fundamentals, explore the curriculum,
                            and build the skills to write software that holds up
                            on competition day.
                        </p>

                        <Link
                            href="/docs"
                            className="mt-7 inline-flex items-center gap-2 rounded-full bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground transition-all hover:-translate-y-0.5"
                        >
                            Start learning
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
