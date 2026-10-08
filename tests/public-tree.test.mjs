import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createTestDirectory} from './helpers/test-directory.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = directory => spawnSync(process.execPath, [join(root, 'scripts/check-public-tree.mjs'), directory], {encoding: 'utf8', windowsHide: true});

test('public checkout guard rejects forced internal files and links to local-only notes while retaining application guides', async t => {
  const {directory} = await createTestDirectory(t, 'public-tree');
  const git = args => execFileSync('git', ['-C', directory, ...args], {encoding: 'utf8', windowsHide: true});
  const put = async (path, text = 'local fixture') => { await mkdir(dirname(join(directory, path)), {recursive: true}); await writeFile(join(directory, path), text); };
  await put('.gitignore', await readFile(join(root, '.gitignore'), 'utf8'));
  await put('README.md', '# App\n\n[Usage](docs/USAGE.md)\n');
  const allowed = ['docs/USAGE.md', 'docs/WORKBUDDY.md', 'docs/ACCEPTANCE.md', 'public/art/craft.svg', 'workbench/skills/creativity-project/SKILL.md', '.env.example'];
  const internal = ['AGENTS.md', 'nested/agent.md', '.workbuddy/memory/session.md', '.codex/config.toml', 'docs/meeting.md', 'work/data/project.json', 'tmp/session.json', 'logs/runtime.log', 'outputs/result.png', 'public/theme-assets/test.png', 'asset.blend', 'asset.glb', 'clip.mp4', 'report.docx', 'website-source.zip'];
  for (const path of [...allowed, ...internal]) await put(path);
  git(['init', '--quiet']);
  git(['add', '.']);
  const tracked = git(['ls-files', '-z']).split('\0').filter(Boolean);
  for (const path of allowed) assert.ok(tracked.includes(path), path);
  for (const path of internal) assert.ok(!tracked.includes(path), path);
  assert.equal(check(directory).status, 0);
  git(['add', '--force', '--', 'AGENTS.md', 'asset.blend']);
  const blocked = check(directory);
  assert.equal(blocked.status, 1);
  assert.match(blocked.stderr, /AGENTS\.md/);
  assert.match(blocked.stderr, /asset\.blend/);
  git(['rm', '--cached', '--quiet', '--', 'AGENTS.md', 'asset.blend']);
  assert.equal(await readFile(join(directory, 'AGENTS.md'), 'utf8'), 'local fixture');
  await put('README.md', '# App\n\n[Local notes](docs/meeting.md)\n');
  const broken = check(directory);
  assert.equal(broken.status, 1);
  assert.match(broken.stderr, /docs\/meeting\.md/);
});
