import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = join(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const parts = String(pkg.version).split('.').map((n) => Number.parseInt(n, 10));
while (parts.length < 3) parts.push(0);
parts[2] = (parts[2] ?? 0) + 1;
pkg.version = `${parts[0]}.${parts[1]}.${parts[2]}`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
console.log(`version -> ${pkg.version}`);
