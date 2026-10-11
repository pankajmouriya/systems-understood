import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const outputDirectory = new URL('../out/', import.meta.url);
const requiredFiles = [
  ['homepage', ['index.html']],
  ['writing index', ['blog.html', 'blog/index.html']],
  ['books index', ['books.html', 'books/index.html']],
  ['RSS feed', ['rss.xml', 'rss.xml/route']],
  ['search index', ['search-index.json']],
  ['redirect rules', ['_redirects']],
  ['response headers', ['_headers']],
];

async function exists(path) {
  try {
    await access(new URL(path, outputDirectory), constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

const missing = [];
for (const [label, candidates] of requiredFiles) {
  if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
    missing.push(`${label} (${candidates.join(' or ')})`);
  }
}

if (await exists('search-index.json')) {
  try {
    const index = JSON.parse(await readFile(new URL('search-index.json', outputDirectory), 'utf8'));
    if (!Array.isArray(index.results) || index.results.length === 0) missing.push('non-empty search index');
  } catch {
    missing.push('valid search-index.json');
  }
}

if (missing.length) {
  console.error(`Static export is incomplete:\n- ${missing.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('Static export contract verified.');
}
