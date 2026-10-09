import { createMDX } from 'fumadocs-mdx/next';
import { readFileSync } from 'node:fs';

const legacyRoutes = JSON.parse(readFileSync(new URL('./docs/migration/legacy-route-map.json', import.meta.url), 'utf8'));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/docs/sop', destination: '/books/same-origin-policy', permanent: true },
      { source: '/docs/Kubernetes/Kubernetes101', destination: '/books/kubernetes-101', permanent: true },
      ...legacyRoutes.map((route) => ({ source: route.old_url, destination: route.new_url, permanent: true })),
    ];
  },
};

export default createMDX()(config);
