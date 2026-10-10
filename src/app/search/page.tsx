import { redirect } from 'next/navigation';

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchRedirect({ searchParams }: Props) {
  const params = await searchParams;
  const query = (typeof params.q === 'string' ? params.q : '').trim().slice(0, 120);
  redirect(`/?search=${encodeURIComponent(query)}`);
}
