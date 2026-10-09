export const siteName = 'Pankaj Mouriya';

export function siteOrigin(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_URL;
  return new URL(configured ?? (vercel ? `https://${vercel}` : 'http://localhost:3000'));
}
