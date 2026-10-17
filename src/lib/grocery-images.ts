// Central grocery image catalog. Every place that shows a grocery photo calls getGroceryImage().
// Images are resolved from the item's name at display time, so stored/legacy image URLs never win.
import tomatoesLocal from '@/assets/tomatoes.jpg';
import milkLocal from '@/assets/milk.jpg';
import spinachLocal from '@/assets/spinach.jpg';
import carrotsLocal from '@/assets/carrots.jpg';

const files = import.meta.glob('../assets/grocery/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
const img = (key: string) => files[`../assets/grocery/${key}.jpg`] ?? '';

/** Catalog key -> aliases (all already normalized). Add new groceries here. */
export const groceryCatalog: Record<string, { category: GroceryCategory; aliases: string[] }> = {
  // Fruits
  banana: { category: 'Fruit', aliases: ['banana', 'kela', 'bananas'] },
  apple: { category: 'Fruit', aliases: ['apple', 'seb', 'red apple', 'green apple'] },
  mango: { category: 'Fruit', aliases: ['mango', 'aam', 'alphonso mango'] },
  orange: { category: 'Fruit', aliases: ['orange', 'santra', 'oranges'] },
  grapes: { category: 'Fruit', aliases: ['grapes', 'grape', 'angoor', 'green grapes'] },
  watermelon: { category: 'Fruit', aliases: ['watermelon', 'tarbooz'] },
  papaya: { category: 'Fruit', aliases: ['papaya', 'papita'] },
  pineapple: { category: 'Fruit', aliases: ['pineapple', 'ananas'] },
  guava: { category: 'Fruit', aliases: ['guava', 'amrood', 'peru'] },
  pomegranate: { category: 'Fruit', aliases: ['pomegranate', 'anar'] },
  strawberry: { category: 'Fruit', aliases: ['strawberry', 'strawberries'] },
  lemon: { category: 'Fruit', aliases: ['lemon', 'nimbu', 'lime'] },
  coconut: { category: 'Fruit', aliases: ['coconut', 'nariyal'] },
  pear: { category: 'Fruit', aliases: ['pear', 'nashpati'] },
  peach: { category: 'Fruit', aliases: ['peach', 'aadu'] },
  kiwi: { category: 'Fruit', aliases: ['kiwi', 'kiwifruit', 'kiwi fruit'] },
  // Vegetables
  tomato: { category: 'Vegetables', aliases: ['tomato', 'tamatar', 'cherry tomato'] },
  potato: { category: 'Vegetables', aliases: ['potato', 'aloo', 'alu'] },
  onion: { category: 'Vegetables', aliases: ['onion', 'pyaz', 'pyaaz', 'kanda', 'red onion'] },
  garlic: { category: 'Vegetables', aliases: ['garlic', 'lahsun', 'lehsun'] },
  ginger: { category: 'Vegetables', aliases: ['ginger', 'adrak'] },
  'green-chilli': { category: 'Vegetables', aliases: ['green chilli', 'green chili', 'green chillies', 'chilli', 'chili', 'hari mirch', 'mirchi'] },
  capsicum: { category: 'Vegetables', aliases: ['capsicum', 'bell pepper', 'shimla mirch', 'green capsicum'] },
  carrot: { category: 'Vegetables', aliases: ['carrot', 'gajar'] },
  cucumber: { category: 'Vegetables', aliases: ['cucumber', 'kheera', 'kakdi'] },
  spinach: { category: 'Vegetables', aliases: ['spinach', 'palak', 'baby spinach'] },
  cabbage: { category: 'Vegetables', aliases: ['cabbage', 'patta gobhi', 'band gobhi'] },
  cauliflower: { category: 'Vegetables', aliases: ['cauliflower', 'gobhi', 'gobi', 'phool gobhi'] },
  broccoli: { category: 'Vegetables', aliases: ['broccoli'] },
  brinjal: { category: 'Vegetables', aliases: ['brinjal', 'eggplant', 'aubergine', 'baingan'] },
  ladyfinger: { category: 'Vegetables', aliases: ['ladyfinger', 'lady finger', 'okra', 'bhindi'] },
  pumpkin: { category: 'Vegetables', aliases: ['pumpkin', 'kaddu'] },
  beetroot: { category: 'Vegetables', aliases: ['beetroot', 'beet', 'chukandar'] },
  peas: { category: 'Vegetables', aliases: ['peas', 'pea', 'green peas', 'matar', 'mutter'] },
  corn: { category: 'Vegetables', aliases: ['corn', 'sweet corn', 'maize', 'bhutta', 'makka'] },
  radish: { category: 'Vegetables', aliases: ['radish', 'mooli', 'muli'] },
  coriander: { category: 'Vegetables', aliases: ['coriander', 'coriander leaves', 'dhaniya', 'dhania', 'cilantro'] },
  // Dairy & refrigerated
  milk: { category: 'Dairy', aliases: ['milk', 'doodh', 'toned milk', 'full cream milk', 'cow milk', 'buffalo milk', 'fresh milk'] },
  curd: { category: 'Dairy', aliases: ['curd', 'dahi'] },
  yogurt: { category: 'Dairy', aliases: ['yogurt', 'yoghurt', 'greek yogurt', 'greek yoghurt'] },
  paneer: { category: 'Dairy', aliases: ['paneer', 'cottage cheese'] },
  cheese: { category: 'Dairy', aliases: ['cheese', 'cheddar', 'cheese slices'] },
  butter: { category: 'Dairy', aliases: ['butter', 'makhan', 'makkhan'] },
  cream: { category: 'Dairy', aliases: ['cream', 'fresh cream', 'malai'] },
  buttermilk: { category: 'Dairy', aliases: ['buttermilk', 'chaas', 'chhaas', 'chach'] },
  eggs: { category: 'Dairy', aliases: ['eggs', 'egg', 'anda', 'ande'] },
  // Grains, pulses & staples
  rice: { category: 'Pantry', aliases: ['rice', 'chawal', 'basmati', 'basmati rice'] },
  'wheat-flour': { category: 'Pantry', aliases: ['atta', 'wheat flour', 'whole wheat flour', 'chakki atta'] },
  maida: { category: 'Pantry', aliases: ['maida', 'all purpose flour', 'refined flour', 'plain flour'] },
  dal: { category: 'Pantry', aliases: ['dal', 'daal', 'lentils', 'lentil', 'mixed dal'] },
  'toor-dal': { category: 'Pantry', aliases: ['toor dal', 'tur dal', 'arhar dal', 'toor'] },
  'moong-dal': { category: 'Pantry', aliases: ['moong dal', 'mung dal', 'moong'] },
  'chana-dal': { category: 'Pantry', aliases: ['chana dal'] },
  rajma: { category: 'Pantry', aliases: ['rajma', 'kidney beans', 'red kidney beans'] },
  chickpeas: { category: 'Pantry', aliases: ['chickpeas', 'chickpea', 'chole', 'kabuli chana', 'chana', 'garbanzo'] },
  oats: { category: 'Pantry', aliases: ['oats', 'rolled oats', 'oatmeal'] },
  poha: { category: 'Pantry', aliases: ['poha', 'flattened rice', 'beaten rice', 'chivda'] },
  suji: { category: 'Pantry', aliases: ['suji', 'sooji', 'rava', 'semolina'] },
  bread: { category: 'Pantry', aliases: ['bread', 'white bread', 'bread loaf', 'sandwich bread'] },
  'brown-bread': { category: 'Pantry', aliases: ['brown bread', 'whole wheat bread', 'wheat bread', 'multigrain bread'] },
  wheat: { category: 'Pantry', aliases: ['wheat', 'gehun', 'gehu', 'wheat grains'] },
  // Other pantry
  sugar: { category: 'Pantry', aliases: ['sugar', 'cheeni', 'chini', 'shakkar'] },
  salt: { category: 'Pantry', aliases: ['salt', 'namak', 'table salt', 'rock salt'] },
  tea: { category: 'Pantry', aliases: ['tea', 'chai', 'tea leaves', 'chai patti'] },
  coffee: { category: 'Pantry', aliases: ['coffee', 'coffee powder', 'instant coffee', 'coffee beans'] },
  'cooking-oil': { category: 'Pantry', aliases: ['cooking oil', 'oil', 'sunflower oil', 'mustard oil', 'groundnut oil', 'vegetable oil', 'refined oil', 'olive oil'] },
  ghee: { category: 'Pantry', aliases: ['ghee', 'desi ghee'] },
  biscuits: { category: 'Pantry', aliases: ['biscuits', 'biscuit', 'cookies', 'cookie'] },
  noodles: { category: 'Pantry', aliases: ['noodles', 'instant noodles', 'maggi'] },
  pasta: { category: 'Pantry', aliases: ['pasta', 'penne', 'macaroni', 'spaghetti'] },
  ketchup: { category: 'Pantry', aliases: ['ketchup', 'tomato ketchup', 'tomato sauce'] },
  jam: { category: 'Pantry', aliases: ['jam', 'fruit jam', 'mixed fruit jam'] },
  chocolate: { category: 'Pantry', aliases: ['chocolate', 'dark chocolate', 'chocolate bar', 'milk chocolate'] },
  honey: { category: 'Pantry', aliases: ['honey', 'shahad'] },
};

export type GroceryCategory = 'Fruit' | 'Vegetables' | 'Dairy' | 'Pantry';

/** Prefer the original hand-picked photos already in the project for these items. */
const localOverrides: Record<string, string> = { tomato: tomatoesLocal, milk: milkLocal, spinach: spinachLocal, carrot: carrotsLocal };

const grainKeys = new Set(['rice', 'wheat-flour', 'maida', 'dal', 'toor-dal', 'moong-dal', 'chana-dal', 'rajma', 'chickpeas', 'oats', 'poha', 'suji', 'wheat']);

/** Brand / descriptor words that don't change what the item is. Only these are ever stripped. */
const ignorableWords = new Set(['fresh', 'organic', 'raw', 'ripe', 'local', 'desi', 'farm', 'premium', 'pack', 'packet', 'of', 'the', 'a', 'loose', 'amul', 'mother', 'dairy', 'nandini', 'aashirvaad', 'fortune', 'tata', 'britannia', 'nestle', 'india', 'gate', 'daawat', 'saffola', 'patanjali', 'kissan', 'cadbury', 'haldiram', 'kg', 'g', 'gm', 'ml', 'l', 'litre', 'liter']);

export function normalizeGroceryName(name: string) {
  return name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\b\d+(\.\d+)?\b/g, ' ').replace(/\s+/g, ' ').trim();
}

const aliasIndex = new Map<string, string>();
for (const [key, entry] of Object.entries(groceryCatalog)) for (const alias of entry.aliases) aliasIndex.set(normalizeGroceryName(alias), key);

function singular(word: string) {
  if (word.endsWith('ies') && word.length > 4) return `${word.slice(0, -3)}y`;
  if (word.endsWith('oes')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) return word.slice(0, -1);
  return word;
}

/** Whole-name match only (after removing brand/descriptor words). Never matches a word inside a longer product name. */
export function matchGroceryKey(name: string): string | null {
  const normalized = normalizeGroceryName(name);
  if (!normalized) return null;
  const candidates = [normalized];
  const stripped = normalized.split(' ').filter(w => !ignorableWords.has(w)).join(' ');
  if (stripped && stripped !== normalized) candidates.push(stripped);
  for (const c of [...candidates]) candidates.push(c.split(' ').map(singular).join(' '));
  for (const c of candidates) { const key = aliasIndex.get(c); if (key) return key; }
  return null;
}

const fallbacks: Record<string, string> = { Fruit: img('fallback-fruit'), Vegetables: img('fallback-vegetable'), Dairy: img('fallback-dairy'), Grains: img('fallback-grains'), Pantry: img('fallback-packaged') };
export const neutralGroceryImage = img('fallback-grocery');

export function categoryFallback(category?: string | null) {
  return (category && fallbacks[category]) || neutralGroceryImage;
}

export type GroceryImageResult = { src: string; key: string | null; exact: boolean; fallback: string };

/** The single image resolver used everywhere a grocery photo appears. */
export function getGroceryImage(item: { name: string; category?: string | null }): GroceryImageResult {
  const key = matchGroceryKey(item.name);
  const fallback = categoryFallback(key && grainKeys.has(key) ? 'Grains' : key ? groceryCatalog[key]?.category : item.category);
  if (key) return { src: localOverrides[key] ?? img(key) ?? fallback, key, exact: true, fallback };
  return { src: fallback, key: null, exact: false, fallback };
}
