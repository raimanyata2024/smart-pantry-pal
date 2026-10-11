import { describe, expect, it } from 'vitest';
import { initialInventory, useFirst, wasteTotal, daysUntil } from '../lib/inventory';
describe('confirmed expiry prioritization', () => {
 it('excludes an unconfirmed date from use-first ingredients', () => {
   const item = { ...initialInventory[0], confirmed: false };
   expect(useFirst([item])).toEqual([]);
 });
 it('orders confirmed ingredients by earliest expiry', () => {
   expect(useFirst([...initialInventory].reverse()).map(item => item.id)).toEqual(['spinach', 'milk', 'tomatoes']);
 });
 it('excludes expired ingredients from use-first suggestions', () => {
   expect(useFirst([{ ...initialInventory[0], expiry: '2026-10-10' }])).toEqual([]);
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
