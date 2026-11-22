"use client";

import type { Folder, Item } from "fumadocs-core/page-tree";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "fumadocs-ui/components/ui/collapsible";
import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { useTreePath } from "fumadocs-ui/contexts/tree";
import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
    type SidebarProps,
} from "fumadocs-ui/layouts/docs/slots/sidebar";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";

const ExpandedPath = createContext<{
    folders: Folder[];
    expand: (folders: Folder[]) => void;
}>({ folders: [], expand: () => {} });

const FolderAncestors = createContext<Folder[]>([]);

function SidebarPage({ item }: { item: Item }) {
    const pathname = usePathname();
    const { mode, setOpen } = useSidebar();
    const active = item.url === pathname;

    return (
        <Link
            href={item.url}
            aria-current={active ? "page" : undefined}
            className="flex min-h-11 items-center rounded-lg p-2 text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 active:bg-fd-accent aria-[current=page]:bg-fd-accent aria-[current=page]:text-fd-primary md:min-h-0"
            onNavigate={() => {
                if (mode === "drawer") setOpen(false);
            }}
        >
            {item.name}
        </Link>
    );
}

function SidebarFolder({ item, children }: { item: Folder; children: ReactNode }) {
    const pathname = usePathname();
    const path = useTreePath();
    const { mode, closeOnRedirect: closeOnRedirectRef } = useSidebar();
    const { folders, expand } = useContext(ExpandedPath);
    const ancestors = useContext(FolderAncestors);
    const folderPath = [...ancestors, item];
    const mobile = mode === "drawer";
    const [desktopOpen, setDesktopOpen] = useState(() => path.includes(item));
    const [previousPathname, setPreviousPathname] = useState(pathname);
    if (pathname !== previousPathname) {
        setPreviousPathname(pathname);
        if (!mobile && path.includes(item)) setDesktopOpen(true);
    }
    const open = mobile ? folders[ancestors.length] === item : desktopOpen;
    const active = item.index?.url === pathname;

    function setOpen(next: boolean) {
        if (mobile) expand(next ? folderPath : ancestors);
        else setDesktopOpen(next);
    }

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <div
                data-active={active}
                className="flex items-stretch rounded-lg text-fd-muted-foreground transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 active:bg-fd-accent data-[active=true]:bg-fd-accent data-[active=true]:text-fd-primary"
            >
                {item.index && (
                    <Link
                        href={item.index.url}
                        aria-current={active ? "page" : undefined}
                        className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-s-lg py-2 ps-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fd-ring md:min-h-0"
                        onClick={(event) => {
                            if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                                if (active) event.preventDefault();
                                setOpen(true);
                            }
                        }}
                        onNavigate={() => {
                            if (mobile && !active) closeOnRedirectRef.current = false;
                        }}
                    >
                        {item.name}
                    </Link>
                )}
                <CollapsibleTrigger
                    type="button"
                    aria-label={item.index ? `${open ? "Collapse" : "Expand"} ${item.name}` : undefined}
                    className={`flex min-h-11 shrink-0 items-center gap-2 p-2 text-start focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fd-ring md:min-h-0 ${item.index ? "w-11 justify-end rounded-e-lg md:w-8" : "w-full justify-between rounded-lg"}`}
                >
                    {!item.index && item.name}
                    <CaretDownIcon aria-hidden="true" className={`size-4 shrink-0 motion-safe:transition-transform ${open ? "" : "-rotate-90"}`} />
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="motion-reduce:transition-none">
                <FolderAncestors.Provider value={folderPath}>
                    <div className="ms-2 flex flex-col gap-0.5 border-s border-fd-border ps-3 pt-0.5">
                        {children}
                    </div>
                </FolderAncestors.Provider>
            </CollapsibleContent>
        </Collapsible>
    );
}

function DocsSidebar(props: SidebarProps) {
    const pathname = usePathname();
    const path = useTreePath();
    const [selection, setSelection] = useState<{ pathname: string; folders: Folder[] }>();
    const folders = selection?.pathname === pathname
        ? selection.folders
        : path.filter((item): item is Folder => item.type === "folder");

    return (
        <ExpandedPath.Provider value={{ folders, expand: (folders) => setSelection({ pathname, folders }) }}>
            <Sidebar {...props} components={{ ...props.components, Folder: SidebarFolder, Item: SidebarPage }} />
        </ExpandedPath.Provider>
    );
}

const docsSidebar = {
    provider: SidebarProvider,
    root: DocsSidebar,
    trigger: SidebarTrigger,
    useSidebar,
};

export function DocsLayoutWithSidebar(props: DocsLayoutProps) {
    return <DocsLayout {...props} slots={{ ...props.slots, sidebar: docsSidebar }} />;
}
