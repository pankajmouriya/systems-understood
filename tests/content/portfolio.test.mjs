import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('portfolio has current and historic employers, a maintained project, and sourced talks', () => {
  const source = readFileSync(new URL('../../src/lib/portfolio.ts', import.meta.url), 'utf8');
  for (const employer of ['Harness', 'Kong', 'DeepSource', 'InVideo', 'Appsecco Consulting']) assert.match(source, new RegExp(employer));
  assert.match(source, /The Security Diff/);
  for (const event of ['BSides Goa', 'Rootconf', 'H@cktivityCon', 'BSides Newcastle']) assert.match(source, new RegExp(event));
});
