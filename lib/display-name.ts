const ADJECTIVES = [
  'Quiet',
  'Pixel',
  'Sleepy',
  'Tiny',
  'Cosmic',
  'Wild',
  'Lucky',
  'Brave',
  'Silent',
  'Amber',
  'Gentle',
  'Swift',
  'Wandering',
  'Fuzzy',
  'Golden',
  'Mellow',
  'Curious',
  'Midnight',
  'Velvet',
  'Rustic',
];

const NOUNS = [
  'Panda',
  'Nomad',
  'Orbit',
  'Raccoon',
  'Otter',
  'Falcon',
  'Cactus',
  'Comet',
  'Willow',
  'Harbor',
  'Badger',
  'Lantern',
  'Pebble',
  'Coyote',
  'Ember',
  'Maple',
  'Pelican',
  'Raven',
  'Turtle',
  'Walrus',
];

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

/** Reddit-style fallback: `Adjective Noun` plus a 1-4 digit suffix. Not unique by design. */
export const generateDisplayName = () => `${pick(ADJECTIVES)} ${pick(NOUNS)} ${Math.floor(1 + Math.random() * 9999)}`;

export const slugifyUsername = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24) || 'user';

export const generateUsername = () => `user_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`;

if (import.meta.url === `file://${process.argv[1]}`) {
  const names = Array.from({ length: 5 }, generateDisplayName);
  const [first] = names;
  if (!/^[A-Z][a-z]+ [A-Z][a-z]+ \d{1,4}$/.test(first)) throw new Error(`bad display name: ${first}`);
  if (new Set(names).size !== names.length) throw new Error('generator returned duplicates');
  if (slugifyUsername('  MarK PeDong!! ') !== 'mark_pedong') throw new Error('slugify failed');
  if (slugifyUsername('日本語') !== 'user') throw new Error('slugify fallback failed');
  if (!/^user_[0-9a-f]{8}$/.test(generateUsername())) throw new Error('username generator failed');
  console.log(names.join('\n'));
}
