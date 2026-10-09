import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/shell/ThemeProvider';
import { SiteHeader } from '@/components/shell/SiteHeader';
import { SiteFooter } from '@/components/shell/SiteFooter';
import { siteName, siteOrigin } from '@/lib/site';
import './globals.css';

const bodyFont = localFont({ src: './fonts/dm-sans-latin.woff2', variable: '--font-body', display: 'swap', weight: '400 700' });
const displayFont = localFont({ src: './fonts/newsreader-latin.woff2', variable: '--font-display', display: 'swap', weight: '400 700' });

export const metadata: Metadata = {
  metadataBase: siteOrigin(),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: 'Engineering and security writing by Pankaj Mouriya.',
  openGraph: { type: 'website', siteName, title: siteName, description: 'Engineering, security, and writing by Pankaj Mouriya.' },
  twitter: { card: 'summary_large_image', title: siteName, description: 'Engineering, security, and writing by Pankaj Mouriya.' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <ThemeProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
