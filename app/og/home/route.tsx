import { appDescription, appName } from "@/app/layout.shared";
import { renderSocialImage } from "@/lib/social-image";

export const dynamic = "force-static";

export function GET() {
    return renderSocialImage({
        title: appName,
        subtitle: appDescription,
    });
}
