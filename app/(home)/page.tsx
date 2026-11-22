import {
    ArrowRightIcon,
    BookOpenTextIcon,
    CpuIcon,
    EyeIcon,
    GameControllerIcon,
    PathIcon,
    TreeStructureIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { appDescription } from "@/app/layout.shared";
import { GuidePicker } from "@/components/guide-picker";
import { getGuideRecommendations } from "@/lib/source";
import styles from "../landing.module.css";

const sections = [
    {
        title: "Start Here",
        description: "Install the FTC SDK, configure your robot, and run your first OpMode.",
        href: "/docs/start-here",
        icon: BookOpenTextIcon,
    },
    {
        title: "FTC SDK & Hardware",
        description: "Work with motors, servos, sensors, gamepads, and telemetry.",
        href: "/docs/sdk-hardware",
        icon: CpuIcon,
    },
    {
        title: "TeleOp",
        description: "Write driver controls for tank, arcade, and mecanum drives.",
        href: "/docs/teleop",
        icon: GameControllerIcon,
    },
    {
        title: "Autonomous",
        description: "Track your robot’s position, follow paths, and tune PID.",
        href: "/docs/autonomous",
        icon: PathIcon,
    },
    {
        title: "Vision",
        description: "Use cameras, AprilTags, Limelight, and OpenCV.",
        href: "/docs/vision",
        icon: EyeIcon,
    },
    {
        title: "Code Organization & Tools",
        description: "Structure subsystems, organize control flow, and debug with dashboards.",
        href: "/docs/code-organization/code-structure",
        icon: TreeStructureIcon,
    },
];

export default async function HomePage() {
    const guides = await getGuideRecommendations();

    return (
        <div className="lg:flex lg:flex-1">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 lg:flex lg:w-full lg:flex-col lg:justify-center lg:px-12 lg:py-[clamp(0.75rem,calc((100dvh_-_54rem)/7),3rem)]">
                <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_1.04fr] lg:gap-14">
                    <section aria-labelledby="home-title">
                        <h1
                            id="home-title"
                            className="max-w-xl text-5xl font-semibold leading-[1.04] tracking-[-0.05em] text-balance sm:text-6xl xl:text-7xl"
                        >
                            Your foundation for FTC software.
                        </h1>
                        <p className="mt-5 max-w-md text-lg leading-relaxed text-fd-muted-foreground md:mt-7 md:text-xl">
                            {appDescription}
                        </p>
                        <p className="mt-5 text-base font-normal leading-relaxed text-fd-foreground md:mt-6">
                            Created by Siddharth Goli{" "}
                            <span className="text-fd-primary">•</span>{" "}
                            14481 Don&apos;t Blink
                        </p>
                    </section>

                    <nav
                        aria-labelledby="curriculum-title"
                        className={`${styles.curriculum} border border-fd-border bg-fd-card`}
                    >
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <h2 id="curriculum-title" className="text-sm font-semibold tracking-[0.16em] text-fd-primary uppercase">
                                Documentation
                            </h2>
                            <Link href="/docs/start-here" className="text-sm text-fd-muted-foreground underline-offset-4 hover:underline">
                                Open docs
                            </Link>
                        </div>
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {sections.map(({ title, description, href, icon: Icon }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={`${styles.curriculumCard} group block h-full border border-fd-border bg-fd-secondary transition-colors hover:border-fd-primary/45 hover:bg-fd-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring`}
                                    >
                                        <span className={`${styles.cardHeading} grid grid-cols-[1fr_auto] items-center`}>
                                            <span className={`${styles.curriculumIcon} grid size-8 place-items-center bg-fd-primary/10 text-fd-primary`}>
                                                <Icon aria-hidden="true" weight="duotone" className="size-5" />
                                            </span>
                                            <ArrowRightIcon aria-hidden="true" className={`${styles.cardArrow} size-4 text-fd-muted-foreground group-hover:text-fd-primary`} />
                                            <span className={`${styles.cardTitle} col-span-2 mt-3 text-sm font-semibold`}>{title}</span>
                                        </span>
                                        <span className="mt-1 block text-sm leading-5 text-fd-muted-foreground">{description}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-fd-border pt-4 text-sm">
                            <span className="font-semibold">Reference</span>
                            <Link href="/docs/reference/libraries" className="text-fd-muted-foreground underline-offset-4 hover:underline">
                                Libraries
                            </Link>
                            <Link href="/docs/reference/resources" className="text-fd-muted-foreground underline-offset-4 hover:underline">
                                Resources
                            </Link>
                        </div>
                    </nav>
                </div>

                <GuidePicker {...guides} className={`${styles.homeGuides} mt-8 sm:mt-10 lg:mt-[clamp(0.75rem,calc((100dvh_-_52rem)/5),3.5rem)]`} />
            </div>
        </div>
    );
}
