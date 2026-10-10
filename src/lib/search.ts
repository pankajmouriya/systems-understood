import { books, getBookChapters, getPublishedPages } from '@/lib/source';

export interface SearchResult {
  type: 'Article' | 'Book chapter';
  href: string;
  context: string;
  title: string;
  description: string;
}

type IndexedResult = SearchResult & { body: string };
let indexPromise: Promise<IndexedResult[]> | undefined;

function getIndex() {
  indexPromise ??= Promise.all([
    ...getPublishedPages().map(async (page): Promise<IndexedResult> => ({
      type: 'Article',
      href: `/blog/${page.data.slug}`,
      context: page.data.tags.join(' · '),
      title: page.data.title,
      description: page.data.description,
      body: await page.data.getText('raw'),
    })),
    ...books.flatMap((book) => getBookChapters(book.slug).map(async (page): Promise<IndexedResult> => ({
      type: 'Book chapter',
      href: `/books/${book.slug}/${page.data.slug}`,
      context: book.title,
      title: page.data.title,
      description: page.data.description,
      body: await page.data.getText('raw'),
    }))),
  ]).catch((error) => {
    indexPromise = undefined;
    throw error;
  });
  return indexPromise;
}

export async function searchWriting(query: string): Promise<SearchResult[]> {
  const needle = query.trim().slice(0, 120).toLocaleLowerCase();
  if (!needle) return [];
  const index = await getIndex();
  return index.map(({ body, ...result }) => {
    const title = result.title.toLocaleLowerCase();
    const context = result.context.toLocaleLowerCase();
    const description = result.description.toLocaleLowerCase();
    const raw = body.toLocaleLowerCase();
    const score = title.includes(needle) ? 4 : context.includes(needle) ? 3 : description.includes(needle) ? 2 : raw.includes(needle) ? 1 : 0;
    return { result, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).map(({ result }) => result);
}
