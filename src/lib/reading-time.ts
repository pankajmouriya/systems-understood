export function estimateReadingMinutes(text: string, wordsPerMinute = 220): number {
  const words = text.trim().match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
