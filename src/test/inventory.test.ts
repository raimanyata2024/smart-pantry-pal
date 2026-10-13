import { describe, expect, it } from 'vitest';
import { initialInventory, useFirst, wasteTotal, daysUntil } from '../lib/inventory';
describe('confirmed expiry prioritization', () => {
 it('excludes an unconfirmed date from use-first ingredients', () => {
   const first = initialInventory[0];
   if (!first) throw new Error('Expected sample ingredient');
   const item = { ...first, confirmed: false };
   expect(useFirst([item])).toEqual([]);
 });
 it('orders confirmed ingredients by earliest expiry', () => {
   expect(useFirst([...initialInventory].reverse()).map(item => item.id)).toEqual(['spinach', 'milk', 'tomatoes']);
 });
 it('excludes expired ingredients from use-first suggestions', () => {
   const first = initialInventory[0];
   if (!first) throw new Error('Expected sample ingredient');
   expect(useFirst([{ ...first, expiry: '2026-10-10' }])).toEqual([]);
 });
 it('calculates remaining days from confirmed calendar dates', () => {
   expect(daysUntil('2026-10-12', '2026-10-11')).toBe(1);
 });
});
describe('waste cost', () => {
 it('totals recorded food costs', () => {
   expect(wasteTotal([{ id: '1', name: 'Bread', quantity: '2 slices', reason: 'Stale', date: '2026-10-11', cost: 12 }, { id: '2', name: 'Bananas', quantity: '2', reason: 'Overripe', date: '2026-10-11', cost: 20 }])).toBe(32);
 });
});
import { validateIngredient, toIngredient } from '../lib/inventory';
const valid = { name: 'Rice', amount: '2', unit: 'kg', category: 'Pantry', location: 'Pantry', purchaseDate: '2026-10-11', expiry: '', confirmed: false, cost: '' };
describe('ingredient form rules', () => {
 it('requires name, quantity and purchase date', () => { expect(Object.keys(validateIngredient({ ...valid, name: ' ', amount: '', purchaseDate: '' })).sort()).toEqual(['amount', 'name', 'purchaseDate']); });
 it('accepts a missing expiry and never invents one', () => { expect(validateIngredient(valid)).toEqual({}); expect(toIngredient(valid).expiry).toBe(''); });
 it('rejects expiry before purchase', () => { expect(validateIngredient({ ...valid, expiry: '2026-10-01' }).expiry).toBeDefined(); });
 it('rejects zero quantity', () => { expect(validateIngredient({ ...valid, amount: '0' }).amount).toBeDefined(); });
});
