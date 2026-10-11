import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');

test('CI validates and uploads the static Pages artifact', async () => {
  const workflow = await read('.github/workflows/ci.yml');

  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /push:[\s\S]*branches:\s*\[main\]/);
  assert.match(workflow, /permissions:\s*\n\s+contents:\s+read/);
  assert.match(workflow, /pnpm\/action-setup@v6/);
  assert.match(workflow, /version:\s+10\.18\.3/);
  assert.match(workflow, /node-version:\s+24/);
  for (const command of ['pnpm lint', 'pnpm typecheck', 'pnpm test', 'pnpm build', 'pnpm verify:export', 'pnpm test:browser']) {
    assert.ok(workflow.includes(command), `CI must run ${command}`);
  }
  assert.match(workflow, /name:\s+cloudflare-pages-out/);
  assert.match(workflow, /path:\s+out/);
});

test('production deploys only the successful main CI artifact', async () => {
  const workflow = await read('.github/workflows/deploy.yml');

  assert.match(workflow, /workflow_run:[\s\S]*workflows:\s*\[CI\][\s\S]*types:\s*\[completed\]/);
  assert.match(workflow, /github\.event\.workflow_run\.conclusion\s*==\s*'success'/);
  assert.match(workflow, /github\.event\.workflow_run\.event\s*==\s*'push'/);
  assert.match(workflow, /github\.event\.workflow_run\.head_branch\s*==\s*'main'/);
  assert.match(workflow, /environment:\s+production/);
  assert.match(workflow, /run-id:\s+\$\{\{ github\.event\.workflow_run\.id \}\}/);
  assert.match(workflow, /CLOUDFLARE_API_TOKEN:\s+\$\{\{ secrets\.CLOUDFLARE_API_TOKEN \}\}/);
  assert.match(workflow, /CLOUDFLARE_ACCOUNT_ID:\s+\$\{\{ vars\.CLOUDFLARE_ACCOUNT_ID \}\}/);
  assert.match(workflow, /CLOUDFLARE_PROJECT_NAME:\s+\$\{\{ vars\.CLOUDFLARE_PROJECT_NAME \}\}/);
  assert.match(workflow, /pages project create/);
  assert.match(workflow, /pages deploy out/);
  assert.match(workflow, /--branch main/);
});

test('Dependabot tracks package and workflow dependencies', async () => {
  const config = await read('.github/dependabot.yml');
  assert.match(config, /package-ecosystem:\s*['"]pnpm['"]/);
  assert.match(config, /package-ecosystem:\s*['"]github-actions['"]/);
});
