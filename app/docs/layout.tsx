import { ChatCircleIcon } from "@phosphor-icons/react/ssr";
import { source } from "@/lib/source";
import { DocsLayoutWithSidebar } from "@/components/docs-sidebar";
import { baseOptions } from "@/app/layout.shared";
import {
    AISearch,
    AISearchPanel,
    AISearchTrigger,
} from "@/components/ai/search";
import { cn } from "cnfast";
import { buttonVariants } from "fumadocs-ui/components/ui/button";

export default function Layout({ children }: LayoutProps<"/docs">) {
    return (
        <DocsLayoutWithSidebar tree={source.pageTree} {...baseOptions()}>
            <AISearch>
                <AISearchPanel />
                <AISearchTrigger
                    position="float"
                    className={cn(
                        buttonVariants({
                            variant: "secondary",
                            className: "text-fd-muted-foreground rounded-2xl",
                        }),
                    )}
                >
                    <ChatCircleIcon aria-hidden="true" className="size-4.5" />
                    Ask AI
                </AISearchTrigger>
            </AISearch>
            {children}
        </DocsLayoutWithSidebar>
    );
}
