import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import { appName, logoSrc } from "@/app/layout.shared";
import Script from "next/script";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

export const metadata: Metadata = {
    metadataBase: new URL("https://www.ftcstack.com"),
    title: appName,
    description: "A practical programming curriculum for teams that want to move beyond getting a robot to work and start building software that can compete.",
    icons: {
        icon: logoSrc,
    },
    openGraph: {
        title: appName,
        description: "A practical programming curriculum for teams that want to move beyond getting a robot to work and start building software that can compete.",
        url: "https://www.ftcstack.com",
        siteName: appName,
        type: "website",
        // images: [
        //     {
        //         url: "/og-image.png",
        //         width: 1200,
        //         height: 630,
        //         alt: appName,
        //     },
        // ],
    },
    // twitter: {
    //     card: "summary_large_image",
    //     title: appName,
    //     description:
    //         "A practical programming curriculum for teams that want to move beyond getting a robot to work and start building software that can compete.",
    //     images: ["/og-image.png"],
    // },
};

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${manrope.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning
        >
            <body className="flex flex-col min-h-screen">
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}');
                    `}
                </Script>
                <RootProvider theme={{ defaultTheme: "dark" }}>
                    {children}
                </RootProvider>
                <Analytics />
            </body>
        </html>
    );
}
