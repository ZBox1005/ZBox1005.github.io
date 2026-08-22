#!/usr/bin/env node
/**
 * Build gate for travel photographs.
 *
 * A page whose thesis is "the data is real" cannot ship 3 MB JPEGs. This runs
 * as `prebuild` and fails the build rather than warning, because a warning in
 * a build log is a rule nobody follows.
 */
import { readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = 'public/travel';
const MAX_BYTES = 300 * 1024;
const MAX_EDGE = 1600;
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const ORIGINAL_QUALITY_MARKER = '.original-quality';

if (!existsSync(ROOT)) process.exit(0);

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        return entry.isDirectory() ? walk(path) : IMAGE.test(entry.name) ? [path] : [];
    });
}

function pixelWidth(path) {
    if (process.platform !== 'darwin') return null;
    try {
        const out = execFileSync('sips', ['-g', 'pixelWidth', path], { encoding: 'utf8' });
        const match = out.match(/pixelWidth:\s*(\d+)/);
        return match ? Number(match[1]) : null;
    } catch {
        return null;
    }
}

/**
 * A gallery may explicitly opt into serving the camera originals. The marker
 * is deliberately local to that directory so one personal gallery cannot
 * silently disable the size guard for every other travel image.
 */
function keepsOriginalQuality(path) {
    let directory = dirname(path);
    while (directory.startsWith(ROOT)) {
        if (existsSync(join(directory, ORIGINAL_QUALITY_MARKER))) return true;
        if (directory === ROOT) break;
        directory = dirname(directory);
    }
    return false;
}

const failures = [];
const warnings = [];
let originals = 0;

for (const file of walk(ROOT)) {
    if (keepsOriginalQuality(file)) {
        originals += 1;
        continue;
    }

    const bytes = statSync(file).size;
    if (bytes > MAX_BYTES) {
        failures.push(`${file} — ${(bytes / 1024).toFixed(0)} KB (limit ${MAX_BYTES / 1024} KB)`);
    }

    const width = pixelWidth(file);
    if (width && width > MAX_EDGE) {
        warnings.push(`${file} — ${width}px wide (target ≤ ${MAX_EDGE}px)`);
    }
}

warnings.forEach((line) => console.warn(`  warn  ${line}`));

if (failures.length > 0) {
    console.error('\n  Travel images exceed the size budget:\n');
    failures.forEach((line) => console.error(`    ${line}`));
    console.error('\n  Fix with:  sips -Z 1600 <file> && sips -s formatOptions 70 <file>\n');
    process.exit(1);
}

console.log(`  travel images ok${originals ? ` (${originals} camera originals preserved)` : ''}`);
