import { describe, expect, it } from 'vitest';
import { getGroceryImage, matchGroceryKey } from '../lib/grocery-images';

describe('grocery image matching', () => {
  it.each([['Banana', 'banana'], ['Apple', 'apple'], ['Tomato', 'tomato'], ['Milk', 'milk'], ['Potato', 'potato'], ['Mango', 'mango']])('%s resolves to its own photo', (name, key) => {
    expect(matchGroceryKey(name)).toBe(key);
  });
  it('ignores case and surrounding spaces', () => { expect(matchGroceryKey('  BANANA ')).toBe('banana'); });
  it('maps synonyms', () => {
    expect(matchGroceryKey('Bhindi')).toBe('ladyfinger');
    expect(matchGroceryKey('okra')).toBe('ladyfinger');
    expect(matchGroceryKey('dahi')).toBe('curd');
    expect(matchGroceryKey('green chili')).toBe('green-chilli');
    expect(matchGroceryKey('bell pepper')).toBe('capsicum');
    expect(matchGroceryKey('eggplant')).toBe('brinjal');
    expect(matchGroceryKey('dhaniya')).toBe('coriander');
    expect(matchGroceryKey('wheat flour')).toBe('wheat-flour');
    expect(matchGroceryKey('Atta')).toBe('wheat-flour');
  });
  it('prefers the specific item over the generic one', () => {
    expect(matchGroceryKey('Brown Bread')).toBe('brown-bread');
    expect(matchGroceryKey('Tomato Ketchup')).toBe('ketchup');
  });
  it('treats a brand name as the generic product', () => { expect(matchGroceryKey('Amul Milk')).toBe('milk'); });
  it('does not match a word inside an unrelated product', () => {
    expect(matchGroceryKey('Apple cider vinegar')).toBeNull();
    expect(matchGroceryKey('Pineapple')).toBe('pineapple');
  });
  it('uses the category fallback for unknown items', () => {
    const r = getGroceryImage({ name: 'Dragonfruit', category: 'Fruit' });
    expect(r.exact).toBe(false);
    expect(r.src).toBe(r.fallback);
  });
  it('changes photo when the name changes', () => {
    expect(getGroceryImage({ name: 'Banana' }).src).not.toBe(getGroceryImage({ name: 'Mango' }).src);
  });
  it('ignores a stored legacy image', () => {
    const legacy = { name: 'Banana', category: 'Fruit', image: 'https://example.com/random.jpg' };
    expect(getGroceryImage(legacy).key).toBe('banana');
  });
});
