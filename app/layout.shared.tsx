import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const appName = "FTC Stack";
export const appDescription =
    "A step-by-step guide to FTC programming, from your first lines of code to competition-ready software.";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";
export const logoSrc = "/db-logo.png";
export const socialImageSize = { width: 1200, height: 630 };
export const homeSocialImage = "/og/home";

export const gitConfig = {
    user: "siddharthgoli",
    repo: "ftcstack",
    branch: "main",
};

export function baseOptions(): BaseLayoutProps {
    return {
        nav: {
            title: (
                <>
                    <img
                        className="size-8"
                        src={logoSrc}
                        alt="Don't Blink Logo"
                    />
                    <span>{appName}</span>
                </>
            ),
        },
        githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    };
}
