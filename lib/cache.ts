import 'server-only';
import { redis } from './redis';
import { cacheKeys } from './cache-keys';
export async function cached<T>(scope: string, key: string, ttl: number, query: () => Promise<T>): Promise<T> {
  let fullKey: string;
  try {
    const generation = (await redis<string | null>('GET', cacheKeys.generation(scope))) ?? '0';
    fullKey = cacheKeys.entry(scope, generation, key);
    const hit = await redis<string | null>('GET', fullKey);
    if (hit !== null) return JSON.parse(hit) as T;
  } catch {
    return query();
  }
  const value = await query();
  try {
    await redis('SET', fullKey, JSON.stringify(value), 'EX', ttl);
  } catch {
    /* Database result remains usable. */
  }
  return value;
}
export async function invalidateCatalog() {
  // Generation rotation invalidates all list variants, old/new slugs and seller projections.
  // Old generations expire naturally; no KEYS or unbounded key registry.
  try {
    await redis('SET', cacheKeys.generation('catalog'), crypto.randomUUID());
  } catch {
    console.warn('Catalog cache invalidation unavailable; entries expire by TTL');
  }
}
