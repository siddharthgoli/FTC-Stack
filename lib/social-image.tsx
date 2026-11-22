import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { appName, logoSrc, socialImageSize } from "@/app/layout.shared";

export async function renderSocialImage({
    title,
    section,
    subtitle,
}: {
    title: string;
    section?: string;
    subtitle?: string;
}) {
    const logo = await readFile(join(process.cwd(), "public", logoSrc));
    const logoUrl = `data:image/png;base64,${logo.toString("base64")}`;
    const titleSize = subtitle ? 128 : title.length > 35 ? 72 : title.length > 24 ? 86 : 104;

    return new ImageResponse(
        <div
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                padding: "56px 72px 58px",
                backgroundColor: "#0b1223",
                color: "#faf8f5",
            }}
        >
            {Array.from({ length: 19 }, (_, column) => (
                <div key={`column-${column}`} style={{
                    position: "absolute", left: 24 + column * 64, top: 0,
                    width: 1, height: 630, backgroundColor: "#1c2a40",
                }} />
            ))}
            {Array.from({ length: 10 }, (_, row) => (
                <div key={`row-${row}`} style={{
                    position: "absolute", left: 0, top: 28 + row * 64,
                    width: 1200, height: 1, backgroundColor: "#1c2a40",
                }} />
            ))}

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* ImageResponse embeds the logo directly in the generated PNG. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} width={62} height={62} alt="" />
                {section && <span style={{ fontSize: 30, fontWeight: 700 }}>{appName}</span>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                {section && (
                    <div style={{ display: "flex", marginBottom: 16, color: "#a6b5c9", fontSize: 26, letterSpacing: 4, fontWeight: 700 }}>
                        {section.toUpperCase()}
                    </div>
                )}
                <div style={{ display: "flex", maxWidth: 1040, fontSize: titleSize, fontWeight: 700, lineHeight: 1.06, letterSpacing: subtitle ? -6 : -3 }}>
                    {title}
                </div>
                {subtitle && (
                    <div style={{ display: "flex", maxWidth: 920, marginTop: 24, fontSize: 36, color: "#b3c1d7" }}>
                        {subtitle}
                    </div>
                )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#b3c1d7", fontSize: 22 }}>
                <span style={{ width: 48, height: 3, backgroundColor: "#a6b5c9" }} />
                ftcstack.com
            </div>
        </div>,
        socialImageSize,
    );
}
