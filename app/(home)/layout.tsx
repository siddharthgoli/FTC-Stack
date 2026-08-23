import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.shared";
import { Footer } from "@/components/footer";

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <div className="flex min-h-dvh flex-col">
            <div className="flex-1">
                <HomeLayout {...baseOptions()}>{children}</HomeLayout>
            </div>
            <Footer />
        </div>
    );
}
