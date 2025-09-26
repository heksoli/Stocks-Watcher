/**
 * Tests for app/globals.css
 * Framework: Node.js built-in test runner (node:test) + node:assert/strict
 * No external testing libraries required.
 *
 * These tests validate:
 * - Presence of key @imports, custom variants, theme blocks, and Tailwind layers
 * - Existence and structure of CSS custom properties in :root and .dark
 * - Definitions of utility and component-specific classes
 * - Scrollbar and TradingView widget overrides
 * - Syntax sanity checks (balanced braces, formatting cues)
 * - Responsive utilities usage
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cssPath = path.resolve(__dirname, 'globals.css');

const exists = fs.existsSync(cssPath);
const cssContent = exists ? fs.readFileSync(cssPath, 'utf8') : '';

test('globals.css should exist', () => {
  assert.ok(exists, `globals.css not found at ${cssPath}`);
});

test('contains required Tailwind CSS imports', () => {
  assert.match(cssContent, /@import\s+"tailwindcss";/);
  assert.match(cssContent, /@import\s+"tw-animate-css";/);
});

test('defines custom variant for dark mode', () => {
  assert.match(cssContent, /@custom-variant\s+dark\s+\(&:is\(.dark \*\)\);/);
});

test('contains theme configuration blocks', () => {
  assert.match(cssContent, /@theme inline\s*\{/);
  assert.match(cssContent, /\/\*\s*=== CUSTOM COLOR THEME ===\s*\*\//);
  assert.match(cssContent, /@theme\s*\{/);
});

test('contains Tailwind layers (base, utilities)', () => {
  assert.match(cssContent, /@layer base\s*\{/);
  assert.match(cssContent, /@layer utilities\s*\{/);
});

test(':root defines key CSS custom properties', () => {
  const rootMatch = cssContent.match(/:root\s*\{([\s\S]*?)\}\s*/);
  assert.ok(rootMatch, ':root block not found');
  const root = rootMatch?.[1] ?? '';
  const expected = [
    '--radius',
    '--background',
    '--foreground',
    '--card',
    '--card-foreground',
    '--popover',
    '--popover-foreground',
    '--primary',
    '--primary-foreground',
    '--secondary',
    '--secondary-foreground',
    '--muted',
    '--muted-foreground',
    '--accent',
    '--accent-foreground',
    '--destructive',
    '--border',
    '--input',
    '--ring',
    '--chart-1',
    '--chart-2',
    '--chart-3',
    '--chart-4',
    '--chart-5',
    '--sidebar',
    '--sidebar-foreground',
    '--sidebar-primary',
    '--sidebar-primary-foreground',
    '--sidebar-accent',
    '--sidebar-accent-foreground',
    '--sidebar-border',
    '--sidebar-ring'
  ];
  for (const prop of expected) {
    assert.ok(
      root.includes(`${prop}:`) || root.includes(`${prop} :`),
      `Missing ${prop} in :root`
    );
  }
  assert.match(root, /oklch\(/, 'Expected OKLCH color usage in :root');
});

test('dark mode overrides variables', () => {
  const darkMatch = cssContent.match(/\.dark\s*\{([\s\S]*?)\}\s*/);
  assert.ok(darkMatch, '.dark block not found');
  const dark = darkMatch?.[1] ?? '';
  const darkPatterns = [
    /--background:\s*oklch\(0\.129 0\.042 264\.695\)/,
    /--foreground:\s*oklch\(0\.984 0\.003 247\.858\)/,
    /--border:\s*oklch\(1 0 0\s*\/\s*10%\)/,
    /--input:\s*oklch\(1 0 0\s*\/\s*15%\)/,
    /--ring:\s*oklch\(/
  ];
  for (const regex of darkPatterns) {
    assert.match(dark, regex, `Dark mode missing/incorrect: ${regex}`);
  }
});

test('theme inline maps variables and defines radii', () => {
  const themeInline = cssContent.match(/@theme inline\s*\{([\s\S]*?)\}\s*/)?.[1] ?? '';
  assert.ok(themeInline, '@theme inline block not found');
  assert.match(themeInline, /--color-background:\s*var\(--background\)/);
  assert.match(themeInline, /--color-foreground:\s*var\(--foreground\)/);
  assert.match(themeInline, /--font-sans:\s*var\(--font-geist-sans\)/);
  assert.match(themeInline, /--font-mono:\s*var\(--font-geist-mono\)/);
  assert.match(cssContent, /--radius-sm:\s*calc\(var\(--radius\)\s*-\s*4px\)/);
  assert.match(cssContent, /--radius-md:\s*calc\(var\(--radius\)\s*-\s*2px\)/);
  assert.match(cssContent, /--radius-lg:\s*var\(--radius\)/);
  assert.match(cssContent, /--radius-xl:\s*calc\(var\(--radius\)\s*\+\s*4px\)/);
});

test('custom color theme defines extended grayscale and vibrant colors', () => {
  const themeBlock = cssContent.match(
    /\/\*\s*=== CUSTOM COLOR THEME ===\s*\*\/[\s\S]*?@theme\s*\{([\s\S]*?)\}\s*/
  );
  assert.ok(themeBlock, 'Custom color theme block not found');
  const theme = themeBlock?.[1] ?? '';
  const grayPatterns = [
    /--color-gray-900:\s*#/i,
    /--color-gray-800:\s*#/i,
    /--color-gray-700:\s*#/i,
    /--color-gray-600:\s*#/i,
    /--color-gray-500:\s*#/i,
    /--color-gray-400:\s*#/i
  ];
  for (const regex of grayPatterns) {
    assert.match(theme, regex);
  }
  const vibrantPatterns = [
    { name: 'blue-600', regex: /--color-blue-600:\s*#5862FF/i },
    { name: 'yellow-400', regex: /--color-yellow-400:\s*#FDD458/i },
    { name: 'yellow-500', regex: /--color-yellow-500:\s*#E8BA40/i },
    { name: 'teal-400', regex: /--color-teal-400:\s*#0FEDBE/i },
    { name: 'red-500', regex: /--color-red-500:\s*#FF495B/i },
    { name: 'orange-500', regex: /--color-orange-500:\s*#FF8243/i },
    { name: 'purple-500', regex: /--color-purple-500:\s*#D13BFF/i }
  ];
  for (const { name, regex } of vibrantPatterns) {
    assert.match(theme, regex, `Missing vibrant color --color-${name}`);
  }
});

test('base layer applies expected utilities', () => {
  const base = cssContent.match(/@layer base\s*\{([\s\S]*?)\}\s*/)?.[1] ?? '';
  assert.ok(base, '@layer base not found');
  assert.match(base, /\*\s*\{[\s\S]*?@apply\s+border-border\s+outline-ring\/50/s);
  assert.match(base, /body\s*\{[\s\S]*?@apply\s+bg-gray-900\s+text-foreground/s);
});

test('utility classes are defined', () => {
  const requiredClasses = [
    '.container',
    '.yellow-btn',
    '.home-wrapper',
    '.home-section',
    '.header',
    '.header-wrapper',
    '.auth-layout',
    '.auth-logo',
    '.auth-left-section',
    '.auth-right-section',
    '.form-title',
    '.form-label',
    '.form-input',
    '.select-trigger'
  ];
  for (const cls of requiredClasses) {
    assert.ok(
      cssContent.includes(`${cls}{`) || cssContent.includes(`${cls} {`),
      `Missing utility class ${cls}`
    );
  }
});

test('component-specific classes (search, watchlist, news, alert) exist', () => {
  const classes = [
    '.search-text',
    '.search-btn',
    '.search-dialog',
    '.search-field',
    '.search-list',
    '.search-input',
    '.watchlist-btn',
    '.watchlist-remove',
    '.watchlist-empty-container',
    '.watchlist-container',
    '.watchlist-table',
    '.watchlist-icon-btn',
    '.watchlist-news',
    '.news-item',
    '.news-tag',
    '.news-title',
    '.news-meta',
    '.news-summary',
    '.news-cta',
    '.alert-dialog',
    '.alert-title',
    '.alert-list',
    '.alert-item',
    '.alert-name',
    '.alert-actions'
  ];
  for (const cls of classes) {
    assert.ok(
      cssContent.includes(`${cls}{`) || cssContent.includes(`${cls} {`),
      `Missing component class ${cls}`
    );
  }
});

test('scrollbar customization classes exist and hide behavior is defined', () => {
  assert.match(cssContent, /\.scrollbar-hide\s*\{/);
  assert.match(cssContent, /-ms-overflow-style:\s*none;/);
  assert.match(cssContent, /scrollbar-width:\s*none;/);
  assert.match(cssContent, /\.scrollbar-hide::\-webkit\-scrollbar\s*\{\s*display:\s*none;/);
  assert.match(cssContent, /\.scrollbar-hide-default\s*\{/);
  assert.match(cssContent, /scrollbar-width:\s*thin;/);
  assert.match(cssContent, /scrollbar-color:\s*transparent\s+transparent;/);
  assert.match(cssContent, /\.scrollbar-hide-default:hover::\-webkit\-scrollbar-thumb\s*\{\s*background-color:\s*#30333A;/);
});

test('TradingView widget styles are overridden appropriately', () => {
  assert.match(cssContent, /\.tradingview-widget-container\s*\{/);
  assert.match(cssContent, /background-color:\s*#141414\s*\!important;/);
  assert.match(cssContent, /border-radius:\s*8px\s*\!important;/);
  assert.match(cssContent, /\.tv-embed-widget-wrapper__body\s*\{\s*background-color:\s*#141414\s*\!important;/);
  const expectedBgSelectors = [
    '.tradingview-widget-container__widget',
    '.widget-stock-heatmap-container .screenerMapWrapper-BBVfGP0b',
    '.canvasContainer-tyaAU8aH',
    '.tv-embed-widget-wrapper .tv-embed-widget-wrapper__body',
    '.tradingview-widget-container iframe'
  ];
  for (const sel of expectedBgSelectors) {
    assert.ok(cssContent.includes(sel), `Missing selector ${sel}`);
    assert.match(cssContent, /#141414/, `Expected #141414 usage in ${sel}`);
  }
});

test('syntax sanity: balanced braces', () => {
  const opens = (cssContent.match(/\{/g) ?? []).length;
  const closes = (cssContent.match(/\}/g) ?? []).length;
  assert.equal(opens, closes, 'Unbalanced number of { and }');
});

test('formatting sanity: properties appear with indentation and colons', () => {
  const properties = cssContent.split('\n').filter(l =>
    l.includes(':') && !l.trim().startsWith('@') && !l.includes('{') && !l.includes('}')
  );
  assert.ok(properties.length > 50, 'Expected many CSS property lines');
  const indented = properties.filter(l => /^\s{2,}/.test(l));
  assert.ok(indented.length / properties.length > 0.5, 'Expected majority of properties to be indented');
});

test('responsive utilities are present in @apply chains', () => {
  assert.match(cssContent, /md:/);
  assert.match(cssContent, /lg:/);
  assert.match(cssContent, /xl:/);
  assert.match(cssContent, /sm:/);
  assert.match(cssContent, /px-4\s+md:px-6\s+lg:px-8/);
  assert.match(cssContent, /grid-cols-1\s+md:grid-cols-2/);
});

test('color semantics are consistently defined', () => {
  const colorVars = cssContent.match(/--[\w-]*color[\w-]*:/g) ?? [];
  assert.ok(colorVars.length > 20, 'Expected many color-related custom properties');
  const vars = [
    '--primary-foreground',
    '--secondary-foreground',
    '--accent-foreground',
    '--card-foreground',
    '--popover-foreground'
  ];
  for (const v of vars) {
    assert.ok(
      cssContent.includes(`${v}:`) || cssContent.includes(`${v} :`),
      `Missing ${v}`
    );
  }
});

test('avoid overly complex selectors and excessive !important usage', () => {
  const complex = cssContent.match(/(\s+>){3,}|\s+\+\s+\+/g);
  assert.equal(complex, null, 'Avoid overly complex combinators');
  const importantCount = (cssContent.match(/!important/g) ?? []).length;
  assert.ok(importantCount < 50, 'Too many !important declarations');
});

test('no empty CSS blocks', () => {
  assert.equal((cssContent.match(/\{\s*\}/g) ?? []).length, 0, 'Found empty CSS blocks');
});

test('browser-specific prefixes present where expected', () => {
  assert.match(cssContent, /-webkit-scrollbar/);
  assert.match(cssContent, /-ms-overflow-style/);
});