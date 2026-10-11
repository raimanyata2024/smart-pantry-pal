import tomatoes from '@/assets/tomatoes.jpg';
import spinach from '@/assets/spinach.jpg';
import milk from '@/assets/milk.jpg';
import carrots from '@/assets/carrots.jpg';

export type Ingredient = { id: string; name: string; category: string; quantity: string; location: string; expiry: string; confirmed: boolean; cost: number; image: string };
export type WasteEntry = { id: string; name: string; quantity: string; reason: string; cost: number; date: string };
export const demoToday = '2026-10-11';
export const initialInventory: Ingredient[] = [
  { id: 'spinach', name: 'Baby spinach', category: 'Vegetables', quantity: '250 g', location: 'Fridge', expiry: '2026-10-11', confirmed: true, cost: 45, image: spinach },
  { id: 'milk', name: 'Fresh milk', category: 'Dairy', quantity: '1 litre', location: 'Fridge', expiry: '2026-10-12', confirmed: true, cost: 60, image: milk },
  { id: 'tomatoes', name: 'Tomatoes', category: 'Vegetables', quantity: '500 g', location: 'Fridge', expiry: '2026-10-13', confirmed: true, cost: 40, image: tomatoes },
  { id: 'carrots', name: 'Carrots', category: 'Vegetables', quantity: '750 g', location: 'Fridge', expiry: '2026-10-16', confirmed: true, cost: 55, image: carrots },
];
export const initialWaste: WasteEntry[] = [
  { id: 'w1', name: 'Whole wheat bread', quantity: '2 slices', reason: 'Went stale', cost: 12, date: '2026-10-09' },
  { id: 'w2', name: 'Bananas', quantity: '2 pieces', reason: 'Overripe', cost: 20, date: '2026-10-07' },
];
export function daysUntil(expiry: string, today = demoToday) { return Math.ceil((Date.parse(expiry) - Date.parse(today)) / 86400000); }
export function useFirst(items: Ingredient[]) { return items.filter(i => i.confirmed && daysUntil(i.expiry) >= 0 && daysUntil(i.expiry) <= 2).sort((a, b) => a.expiry.localeCompare(b.expiry)); }
export function expiryLabel(item: Ingredient) { if (!item.confirmed) return 'Date unconfirmed'; const days = daysUntil(item.expiry); return days < 0 ? 'Expired' : days === 0 ? 'Use today' : days === 1 ? 'Use tomorrow' : `${days} days left`; }
export function shortDate(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
export function wasteTotal(entries: WasteEntry[]) { return entries.reduce((sum, entry) => sum + entry.cost, 0); }
