import { getPublishedPages } from '@/lib/source';
import { siteName, siteOrigin } from '@/lib/site';

export const dynamic = 'force-static';

function xml(value: string) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;'); }

export function GET() {
  const origin = siteOrigin();
  const items = getPublishedPages().map((post) => `<item><title>${xml(post.data.title)}</title><link>${xml(new URL(`/blog/${post.data.slug}`, origin).toString())}</link><guid isPermaLink="true">${xml(new URL(`/blog/${post.data.slug}`, origin).toString())}</guid><description>${xml(post.data.description)}</description><pubDate>${new Date(`${post.data.date}T00:00:00Z`).toUTCString()}</pubDate></item>`).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(siteName)} — Writing</title><link>${xml(new URL('/blog', origin).toString())}</link><description>Engineering and security writing by Pankaj Mouriya.</description>${items}</channel></rss>`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
