import { books, getBookChapters, getPublishedPages } from '@/lib/source';
import { searchIndex, type SearchIndexEntry, type SearchResult } from '@/lib/search-client';

let indexPromise: Promise<SearchIndexEntry[]> | undefined;

export function getSearchIndex() {
  indexPromise ??= Promise.all([
    ...getPublishedPages().map(async (page): Promise<SearchIndexEntry> => ({
      type: 'Article',
      href: `/blog/${page.data.slug}`,
      context: page.data.tags.join(' · '),
      title: page.data.title,
      description: page.data.description,
      body: await page.data.getText('raw'),
    })),
    ...books.flatMap((book) => getBookChapters(book.slug).map(async (page): Promise<SearchIndexEntry> => ({
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
  return searchIndex(await getSearchIndex(), query);
}
