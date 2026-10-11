export interface SearchResult {
  type: 'Article' | 'Book chapter';
  href: string;
  context: string;
  title: string;
  description: string;
}

export type SearchIndexEntry = SearchResult & { body: string };

export function searchIndex(index: SearchIndexEntry[], query: string): SearchResult[] {
  const needle = query.trim().slice(0, 120).toLocaleLowerCase();
  if (!needle) return [];

  return index
    .map(({ body, ...result }) => {
      const title = result.title.toLocaleLowerCase();
      const context = result.context.toLocaleLowerCase();
      const description = result.description.toLocaleLowerCase();
      const raw = body.toLocaleLowerCase();
      const score = title.includes(needle)
        ? 4
        : context.includes(needle)
          ? 3
          : description.includes(needle)
            ? 2
            : raw.includes(needle)
              ? 1
              : 0;

      return { result, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result);
}
