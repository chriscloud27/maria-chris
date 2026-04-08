#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(repoRoot, 'package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const devDependencies = new Set(Object.keys(packageJson.devDependencies || {}));
const dependencies = new Set(Object.keys(packageJson.dependencies || {}));

const SCAN_TARGETS = [
  'src/app/api',
  'src/lib',
  'src/config',
  'src/middleware.ts',
];

const importRegex = /(?:import\s+(?:.+?\s+from\s+)?|export\s+.+?\s+from\s+|require\s*\()\s*["'`]([^"'`]+)["'`]/g;

function isRelativeOrInternal(specifier) {
  return (
    specifier.startsWith('.') ||
    specifier.startsWith('/') ||
    specifier.startsWith('~') ||
    specifier.startsWith('#') ||
    specifier.startsWith('node:') ||
    specifier.startsWith('next/')
  );
}

function toPackageName(specifier) {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
  }

  return specifier.split('/')[0];
}

function collectFiles(targetPath, files = []) {
  if (!fs.existsSync(targetPath)) {
    return files;
  }

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    const baseName = path.basename(targetPath);
    const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$/.test(baseName);
    if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(targetPath) && !isTestFile) {
      files.push(targetPath);
    }
    return files;
  }

  for (const entry of fs.readdirSync(targetPath)) {
    const child = path.join(targetPath, entry);
    const childStat = fs.statSync(child);

    if (childStat.isDirectory()) {
      collectFiles(child, files);
      continue;
    }

    const baseName = path.basename(child);
    const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$/.test(baseName);
    if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(child) && !isTestFile) {
      files.push(child);
    }
  }

  return files;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

const allFiles = SCAN_TARGETS.flatMap((target) => collectFiles(path.join(repoRoot, target)));
const offenders = new Map();

for (const filePath of allFiles) {
  const imports = scanFile(filePath);
  for (const specifier of imports) {
    if (isRelativeOrInternal(specifier)) {
      continue;
    }

    const pkg = toPackageName(specifier);

    if (devDependencies.has(pkg) && !dependencies.has(pkg)) {
      if (!offenders.has(pkg)) {
        offenders.set(pkg, []);
      }

      offenders.get(pkg).push(path.relative(repoRoot, filePath));
    }
  }
}

if (offenders.size > 0) {
  console.error('\nDependency drift detected: runtime/server code imports packages listed only in devDependencies.\n');

  for (const [pkg, files] of offenders) {
    console.error(`- ${pkg}`);
    for (const file of files) {
      console.error(`  - ${file}`);
    }
  }

  console.error('\nMove these packages to dependencies in package.json to avoid production runtime failures.');
  process.exit(1);
}

console.log('Dependency drift check passed.');
