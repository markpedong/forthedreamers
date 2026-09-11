// Run the TS seed scripts without adding a TS runner dependency.
// Next ships SWC (@next/swc-darwin-arm64); use its transformSync + a tiny loader.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');

// lib/*.ts imports go through '@/...' too, so the loader has to cover every module
// the transpiled seed pulls in — not just the entry file.
register(
  'data:text/javascript,' +
    encodeURIComponent(`
      const { existsSync } = await import('node:fs');
      const { join } = await import('node:path');
      const { pathToFileURL, fileURLToPath } = await import('node:url');
      const ROOT = ${JSON.stringify(ROOT)};
      const EXTS = ['.ts', '.tsx', '.mjs', '.js', '.cjs', '/index.ts', '/index.tsx', '/index.js', '/index.mjs'];
      // Specifiers that already end in a real file extension must not be suffixed again.
      const HAS_EXT = /\\.(ts|tsx|mjs|cjs|js|json)$/;
      // Repo TS uses extensionless relative imports (./database-url), which Node ESM rejects.
      const RELATIVE = /^\\.{1,2}\\//;
      export function resolve(specifier, context, next) {
        let target = null;
        if (specifier.startsWith('@/')) {
          target = join(ROOT, specifier.slice(2));
        } else if (RELATIVE.test(specifier) && context.parentURL?.startsWith('file:')) {
          target = fileURLToPath(new URL(specifier, context.parentURL));
          // Relative imports that already carry an existing file path resolve normally.
          if (EXTS.some(ext => ext.startsWith('/') && existsSync(target))) next(specifier, context);
        }
        if (target) {
          const hit = HAS_EXT.test(target) ? '' : EXTS.find(ext => existsSync(target + ext));
          if (hit === undefined) throw new Error('Unresolved import: ' + specifier);
          specifier = pathToFileURL(target + hit).href;
        }
        return next(specifier, context);
      }
    `),
  import.meta.url
);
const swcPath = execFileSync(
  'node',
  [
    '-e',
    `console.log(require.resolve('@next/swc-darwin-arm64/next-swc.darwin-arm64.node',{paths:['${ROOT}/node_modules/.pnpm/@next+swc-darwin-arm64@16.3.4/node_modules/@next/swc-darwin-arm64']}))`,
  ],
  { encoding: 'utf8' }
).trim();

const swc = createRequire(import.meta.url)(swcPath);
// Inside the repo so bare specifiers (@prisma/adapter-pg) still resolve.
const BUILD = join(ROOT, 'node_modules', '.cache', 'ftd-ts-build');

// ponytail: naive regex rewrite of the '@/' alias, not a resolver. Escalate to esbuild/tsx if a script ever uses `export * from` or a dynamic '@/...' import.
// Next's binding takes (src, isModule, Buffer of JSON options) — not a plain options object.
const transform = source => {
  const options = {
    filename: 'seed.ts',
    jsc: { parser: { syntax: 'typescript', decorators: true }, target: 'es2022' },
    module: { type: 'es6' },
  };
  const code = swc.transformSync(source, false, Buffer.from(JSON.stringify(options))).code;
  const rewritten = code.replace(/(from\s*|import\s*\()\s*(['"])@\/([^'"]+)\2/g, (_, lead, q, p) => {
    const base = join(ROOT, p);
    // ponytail: try the extensions the repo uses; the generated Prisma dir is CommonJS so it needs an explicit .js.
    const hit = ['', '.ts', '.tsx', '.mjs', '.js', '.cjs', '/index.ts', '/index.tsx', '/index.js', '/index.mjs'].find(ext =>
      existsSync(base + ext)
    );
    if (hit === undefined) throw new Error(`Unresolved '@/${p}' — add its extension to run-ts.mjs`);
    return `${lead}${q}${pathToFileURL(base + hit).href}${q}`;
  });
  if (rewritten.includes('@/')) throw new Error(`A '@/' alias survived the rewrite in ${process.argv[2]} — check the import syntax.`);
  return rewritten;
};

let source = readFileSync(process.argv[2], 'utf8');
if (process.argv[3] === '--rebase') {
  // seed scripts hardcode ids from the old seed; point them at the linked store instead.
  source = source
    .replace(/^import prisma from '@\/lib\/prisma';$/m, "import prisma from './_seed-client.mjs';")
    .replace(/\bid: 'test-seller-001',\n/g, '')
    .replace(/\bid: `test-product-\$\{products\.indexOf\(productData\) \+ 1\}`,/, '')
    .replace(/sellerId: seller\.id/, 'sellerId: ownerSeller.id');

  // The seed re-creates its own seller/user; reuse the linked store instead.
  const sellerBlock = source.match(/  \/\/ Step 2: Create a test seller\n[\s\S]*?console\.log\(`Created seller: \$\{seller\.storeName\}`\);\n/);
  if (!sellerBlock) throw new Error('--rebase: could not find the Step 2 seller block in seed-products.ts');
  source = source.replace(sellerBlock[0], `  const ownerSeller = await prisma.seller.findFirstOrThrow({ select: { id: true } });
`);

  if (!source.includes('ownerSeller')) {
    throw new Error('--rebase patches did not apply; seed-products.ts changed. Re-read it before running.');
  }
}

mkdirSync(BUILD, { recursive: true });
const client = join(BUILD, '_seed-client.mjs');
writeFileSync(
  client,
  transform(`import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client.js';
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }),
});
export default prisma;`)
);

const out = join(BUILD, 'seed.mjs');
writeFileSync(out, transform(source).replace(/from\s*(['"])\.\/_seed-client\.mjs\1/, `from ${JSON.stringify(pathToFileURL(client).href)}`));
await import(pathToFileURL(out).href);
rmSync(BUILD, { recursive: true, force: true });
console.log(`\n${dirname(process.argv[2])} script ran: ${process.argv[2]}`);
