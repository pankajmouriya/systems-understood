import assert from 'node:assert/strict';
import test from 'node:test';
import { metadataIssues } from '../../src/lib/metadata.ts';
import { estimateReadingMinutes } from '../../src/lib/reading-time.ts';

test('rejects impossible dates rather than accepting Date rollover', () => {
  assert.deepEqual(metadataIssues({ date: '2026-02-30', tags: ['engineering'] }), [
    'date must be a real YYYY-MM-DD date',
  ]);
});

test('rejects an update date before publication', () => {
  assert.deepEqual(metadataIssues({ date: '2026-10-10', updated: '2026-10-09', tags: ['engineering'] }), [
    'updated cannot precede date',
  ]);
});

test('rejects uncontrolled tags', () => {
  assert.deepEqual(metadataIssues({ date: '2026-10-10', tags: ['eng', 'cloud-security'] }), [
    'unknown tag: eng',
  ]);
});

test('rejects impossible security review dates', () => {
  assert.deepEqual(metadataIssues({ date: '2026-10-10', tags: [], security: { reviewedOn: '2026-02-30' } }), [
    'security.reviewedOn must be a real YYYY-MM-DD date',
  ]);
});

test('reading time has a one minute floor and scales with words', () => {
  assert.equal(estimateReadingMinutes('short note'), 1);
  assert.equal(estimateReadingMinutes(Array(441).fill('word').join(' ')), 3);
});
