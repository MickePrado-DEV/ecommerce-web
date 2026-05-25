import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const src = join(import.meta.dirname, '..', 'src');

function toPascal(name) {
  return name
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

function exportNameFromFile(file) {
  const base = file.replace(/\.(tsx|ts)$/, '');
  if (base.startsWith('use-')) {
    const rest = base.slice(4).split('-');
    return 'use' + rest.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  }
  return toPascal(base);
}

function writeIfChanged(path, content) {
  const line = content.endsWith('\n') ? content : content + '\n';
  if (existsSync(path)) {
    const prev = readFileSync(path, 'utf8');
    if (prev === line) return false;
  }
  writeFileSync(path, line, 'utf8');
  return true;
}

let created = 0;

function barrelFromDir(baseDir, subdirs) {
  const lines = [];
  for (const sub of subdirs) {
    const dir = join(baseDir, sub);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((x) => (x.endsWith('.tsx') || x.endsWith('.ts')) && x !== 'index.ts')) {
      const stem = f.replace(/\.(tsx|ts)$/, '');
      if (sub === 'model') {
        lines.push(`export * from './model/${stem}';`);
      } else {
        const exp = exportNameFromFile(f);
        lines.push(`export { ${exp} } from './${sub}/${stem}';`);
      }
    }
  }
  return lines;
}

// views
const viewsDir = join(src, 'views');
for (const slice of readdirSync(viewsDir)) {
  const slicePath = join(viewsDir, slice);
  const lines = barrelFromDir(slicePath, ['ui']);
  if (lines.length && writeIfChanged(join(slicePath, 'index.ts'), lines.join('\n') + '\n')) created++;
}

// features (2 levels)
const featuresDir = join(src, 'features');
for (const a of readdirSync(featuresDir)) {
  const aPath = join(featuresDir, a);
  if (!statSync(aPath).isDirectory()) continue;
  for (const b of readdirSync(aPath)) {
    const slicePath = join(aPath, b);
    if (!statSync(slicePath).isDirectory()) continue;
    const lines = [
      ...barrelFromDir(slicePath, ['ui']),
      ...barrelFromDir(slicePath, ['model']),
    ];
    if (lines.length && writeIfChanged(join(slicePath, 'index.ts'), lines.join('\n') + '\n')) created++;
  }
}

// widgets
const widgetsDir = join(src, 'widgets');
for (const slice of readdirSync(widgetsDir)) {
  const slicePath = join(widgetsDir, slice);
  const lines = [
    ...barrelFromDir(slicePath, ['ui']),
    ...barrelFromDir(slicePath, ['model']),
  ];
  if (lines.length && writeIfChanged(join(slicePath, 'index.ts'), lines.join('\n') + '\n')) created++;
}

// entities
const entitiesDir = join(src, 'entities');
for (const slice of readdirSync(entitiesDir)) {
  const slicePath = join(entitiesDir, slice);
  const lines = [];
  if (existsSync(join(slicePath, 'api'))) {
    for (const f of readdirSync(join(slicePath, 'api')).filter((x) => x.endsWith('.ts') && x !== 'index.ts')) {
      lines.push(`export * from './api/${f.replace('.ts', '')}';`);
    }
  }
  if (existsSync(join(slicePath, 'model'))) {
    for (const f of readdirSync(join(slicePath, 'model')).filter((x) => x.endsWith('.ts') && x !== 'index.ts')) {
      lines.push(`export * from './model/${f.replace('.ts', '')}';`);
    }
  }
  const uiLines = barrelFromDir(slicePath, ['ui']);
  lines.push(...uiLines);
  if (lines.length && writeIfChanged(join(slicePath, 'index.ts'), lines.join('\n') + '\n')) created++;
}

// shared
const sharedExports = {
  'shared/lib': ["export * from './utils';", "export * from './format-money';", "export * from './query-keys';", "export * from './order-status';"],
  'shared/config': ["export * from './env';"],
  'shared/providers': ["export * from './app-providers';"],
  'shared/ui': [
    "export * from './button';",
    "export * from './input';",
    "export * from './label';",
    "export * from './card';",
    "export * from './skeleton';",
    "export * from './page-header';",
    "export * from './empty-state';",
    "export * from './price-tag';",
    "export * from './loading-grid';",
  ],
};
for (const [rel, lines] of Object.entries(sharedExports)) {
  if (writeIfChanged(join(src, rel, 'index.ts'), lines.join('\n') + '\n')) created++;
}

console.log(`Barrel files written/updated: ${created}`);
