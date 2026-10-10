import type { Metadata } from 'next';
import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-29/about-us-page-29';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'About Pankaj Mouriya, a security engineer, writer, and conference speaker in Bengaluru.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <main id="main-content" className="about-page"><AboutUs /></main>;
}
