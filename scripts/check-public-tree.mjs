import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {dirname, join, posix} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = process.argv[2] || fileURLToPath(new URL('../', import.meta.url));
const git = args => execFileSync('git', ['-C', root, ...args], {encoding: 'utf8', windowsHide: true, maxBuffer: 16 * 1024 * 1024});
const files = git(['ls-files', '-z']).split('\0').filter(Boolean);
const published = new Set(files);
const ignored = git(['ls-files', '--cached', '--ignored', '--exclude-standard', '-z']).split('\0').filter(Boolean);
const issues = ignored.map(path => `被忽略的本机或生成文件仍在跟踪：${path}`);

for (const file of files.filter(path => path.toLowerCase().endsWith('.md'))) {
  const source = readFileSync(join(root, file), 'utf8');
  for (const match of source.matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const link = match[1];
    if (link.startsWith('#') || link.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(link)) continue;
    const path = decodeURIComponent(link.split(/[?#]/)[0]);
    if (!path) continue;
    const target = posix.normalize(path.startsWith('/') ? path.slice(1) : posix.join(dirname(file).replaceAll('\\', '/'), path));
    if (!published.has(target) && !files.some(name => name.startsWith(target.replace(/\/$/, '') + '/'))) issues.push(`公开文档引用未发布文件：${file} -> ${link}`);
  }
}

if (issues.length) {
  console.error(issues.join('\n'));
  process.exitCode = 1;
} else console.log(`公开文件检查通过：${files.length} 个跟踪文件，无被忽略文件或失效的本地文档链接。`);
