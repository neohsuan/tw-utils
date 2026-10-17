import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as { name: string };

function runNode(args: string[]): string {
  return execFileSync(process.execPath, args, { cwd: root, encoding: 'utf8' }).trim();
}

describe('built package exports (ESM + CJS)', () => {
  it('has built files for both formats and their type declarations', () => {
    for (const file of ['index.js', 'index.cjs', 'index.d.ts', 'index.d.cts']) {
      expect(existsSync(resolve(root, 'dist', file)), file).toBe(true);
    }
  });

  it('can be loaded with require()', () => {
    const out = runNode([
      '-e',
      `const m = require(${JSON.stringify(pkg.name)}); console.log(typeof m.isValidBusinessNumber, m.isValidBusinessNumber('04595252'), m.rocToGregorianYear(113));`,
    ]);
    expect(out).toBe('function true 2024');
  });

  it('can be loaded with import', () => {
    const out = runNode([
      '--input-type=module',
      '-e',
      `const m = await import(${JSON.stringify(pkg.name)}); console.log(typeof m.isValidBusinessNumber, m.isValidBusinessNumber('04595252'), m.rocToGregorianYear(113));`,
    ]);
    expect(out).toBe('function true 2024');
  });

  it('exposes the same export names in both formats', () => {
    const cjs = runNode(['-e', `console.log(Object.keys(require(${JSON.stringify(pkg.name)})).sort().join(','))`]);
    const esm = runNode([
      '--input-type=module',
      '-e',
      `console.log(Object.keys(await import(${JSON.stringify(pkg.name)})).sort().join(','))`,
    ]);
    expect(cjs).toBe(esm);
    expect(cjs.length).toBeGreaterThan(0);
  });
});
