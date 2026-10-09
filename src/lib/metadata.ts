export const TOPIC_SLUGS = [
  'application-security',
  'vulnerability-research',
  'supply-chain-security',
  'cloud-security',
  'containers-kubernetes',
  'devsecops',
  'engineering',
  'tools-automation',
] as const;

const knownTags = new Set<string>(TOPIC_SLUGS);

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function metadataIssues(post: {
  date: string;
  updated?: string | null;
  tags: readonly string[];
  security?: { reviewedOn?: string };
}): string[] {
  const issues: string[] = [];
  if (!isCalendarDate(post.date)) issues.push('date must be a real YYYY-MM-DD date');
  if (post.updated) {
    if (!isCalendarDate(post.updated)) issues.push('updated must be a real YYYY-MM-DD date');
    else if (isCalendarDate(post.date) && post.updated < post.date) issues.push('updated cannot precede date');
  }
  for (const tag of post.tags) {
    if (!knownTags.has(tag)) issues.push(`unknown tag: ${tag}`);
  }
  if (post.security?.reviewedOn && !isCalendarDate(post.security.reviewedOn)) {
    issues.push('security.reviewedOn must be a real YYYY-MM-DD date');
  }
  return issues;
}
