import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import { appDescription, appName, homeSocialImage, logoSrc, socialImageSize } from "@/app/layout.shared";
import Script from "next/script";

const plexSans = IBM_Plex_Sans({
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
    description: appDescription,
    icons: {
        icon: logoSrc,
    },
    openGraph: {
        title: appName,
        description: appDescription,
        url: "https://www.ftcstack.com",
        siteName: appName,
        type: "website",
        images: [{ url: homeSocialImage, ...socialImageSize, alt: appName }],
    },
    twitter: {
        card: "summary_large_image",
        title: appName,
        description: appDescription,
        images: [homeSocialImage],
    },
};

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${plexSans.variable} ${jetbrainsMono.variable}`}
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
