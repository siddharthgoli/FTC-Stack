import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.shared";
import { Footer } from "@/components/footer";
import styles from "../landing.module.css";

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <div data-home-layout className={`${styles.backdrop} relative isolate flex h-dvh flex-col`}>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none]">
                <HomeLayout {...baseOptions()} className="min-h-full">{children}</HomeLayout>
            </div>
            <Footer className={`${styles.homeFooter} shrink-0`} />
        </div>
    );
}
