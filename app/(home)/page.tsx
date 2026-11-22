import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { appDescription } from "@/app/layout.shared";
import { GuidePicker } from "@/components/guide-picker";
import { getGuideRecommendations } from "@/lib/source";
import styles from "../landing.module.css";
import motion from "../page-motion.module.css";

const sections = [
    {
        title: "Start Here",
        description: "Install the FTC SDK, configure your robot, and run your first OpMode.",
        href: "/docs/start-here",
    },
    {
        title: "FTC SDK & Hardware",
        description: "Work with motors, servos, sensors, gamepads, and telemetry.",
        href: "/docs/sdk-hardware",
    },
    {
        title: "TeleOp",
        description: "Write driver controls for tank, arcade, and mecanum drives.",
        href: "/docs/teleop",
    },
    {
        title: "Autonomous",
        description: "Track your robot’s position, follow paths, and tune PID.",
        href: "/docs/autonomous",
    },
    {
        title: "Vision",
        description: "Use cameras, AprilTags, Limelight, and OpenCV.",
        href: "/docs/vision",
    },
    {
        title: "Code Organization & Tools",
        description: "Structure subsystems, organize control flow, and debug with dashboards.",
        href: "/docs/code-organization/code-structure",
    },
];

export default async function HomePage() {
    const guides = await getGuideRecommendations();

    return (
        <div className="lg:flex lg:flex-1">
            <div className={styles.homeContent}>
                <div className={`${styles.heroGrid} grid items-center`}>
                    <section aria-labelledby="home-title" className={`${styles.heroCopy} ${motion.stagger}`}>
                        <h1
                            id="home-title"
                            className={`${styles.heroTitle} font-semibold leading-[1.04] tracking-[-0.05em] text-balance`}
                        >
                            Your foundation for FTC software.
                        </h1>
                        <p className={`${styles.heroDescription} max-w-md text-lg leading-relaxed text-fd-muted-foreground md:text-xl`}>
                            {appDescription}
                        </p>
                        <p className="text-base font-normal leading-relaxed text-fd-foreground">
                            Created by Siddharth Goli{" "}
                            <span className="text-fd-primary">•</span>{" "}
                            14481 Don&apos;t Blink
                        </p>
                    </section>

                    <nav aria-label="Documentation" className="mx-auto w-full max-w-3xl">
                        <ul className={`${motion.stagger} ${styles.homeCards} grid gap-3 sm:grid-cols-2`}>
                            {sections.map(({ title, description, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={`${styles.curriculumCard} group block h-full bg-fd-secondary transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring`}
                                    >
                                        <span className={`${styles.curriculumTitle} flex items-center justify-between gap-3 text-sm font-semibold`}>
                                            {title}
                                            <ArrowRightIcon aria-hidden="true" className="size-4 shrink-0 text-fd-muted-foreground group-hover:text-fd-primary" />
                                        </span>
                                        <span className={`${styles.curriculumDescription} mt-1 block text-sm leading-5 text-fd-muted-foreground`}>{description}</span>
                                    </Link>
                                </li>
                            ))}
                            <li className={`${styles.referenceCard} flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-fd-secondary px-4 py-2.5 text-sm sm:col-span-2`}>
                                <span className="font-semibold">Reference</span>
                                <Link href="/docs/reference/libraries" className="text-fd-muted-foreground underline-offset-4 hover:underline">
                                    Libraries
                                </Link>
                                <Link href="/docs/reference/resources" className="text-fd-muted-foreground underline-offset-4 hover:underline">
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <GuidePicker {...guides} className={`${styles.homeGuides} ${motion.enter} mx-auto w-full max-w-3xl`} />
            </div>
        </div>
    );
}
