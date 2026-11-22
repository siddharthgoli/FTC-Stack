import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();
const devPreviewHostname = process.env.FTC_STACK_DEV_PREVIEW_HOST?.trim();

// Specific lessons come before the redirects for their former sections.
const movedDocs = [
  ...['project-structure', 'robot-config', 'opmodes'].map((lesson) => [
    `learn/sdk-basics/${lesson}`, `start-here/${lesson}`,
  ]),
  ...['hardwaremap', 'motors', 'servos', 'lynx-modules'].map((lesson) => [
    `learn/sdk-basics/${lesson}`, `sdk-hardware/devices/${lesson}`,
  ]),
  ['learn/sdk-basics/sensors/:path*', 'sdk-hardware/devices/sensors/:path*'],
  ['program/auto/pid-movement', 'autonomous/feedback-pid/pid-movement'],
  ['program/dashboards', 'code-organization/dashboards'],
  ['learn/getting-started/:path*', 'start-here/:path*'],
  ['learn/sdk-basics/:path*', 'sdk-hardware/:path*'],
  ['program/teleop/:path*', 'teleop/:path*'],
  ['program/auto/:path*', 'autonomous/:path*'],
  ['program/control-flow/:path*', 'code-organization/control-flow/:path*'],
  ['program/code-structure/:path*', 'code-organization/code-structure/:path*'],
  ['control-theory/:path*', 'autonomous/feedback-pid/:path*'],
  ['snippets', 'reference/snippets'],
];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  allowedDevOrigins: devPreviewHostname ? [devPreviewHostname] : [],
  async redirects() {
    return [
      { source: '/docs', destination: '/docs/start-here', permanent: true },
      ...movedDocs.map(([from, to]) => ({
        source: `/docs/${from}`,
        destination: `/docs/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default withMDX(config);
