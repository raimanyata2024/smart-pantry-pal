import tomatoes from '@/assets/tomatoes.jpg';
import spinach from '@/assets/spinach.jpg';
import milk from '@/assets/milk.jpg';
import carrots from '@/assets/carrots.jpg';

export type Ingredient = { id: string; name: string; category: string; quantity: string; location: string; expiry: string; confirmed: boolean; cost: number; image: string; amount?: number; unit?: string; purchaseDate?: string };
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
export function expiryLabel(item: Ingredient) { if (!item.expiry) return 'No expiry date'; if (!item.confirmed) return 'Date unconfirmed'; const days = daysUntil(item.expiry); return days < 0 ? 'Expired' : days === 0 ? 'Use today' : days === 1 ? 'Use tomorrow' : `${days} days left`; }
export function shortDate(date: string) { if (!date) return '—'; return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
export function wasteTotal(entries: WasteEntry[]) { return entries.reduce((sum, entry) => sum + entry.cost, 0); }

export const categories = ['Vegetables', 'Dairy', 'Fruit', 'Pantry'] as const;
export const units = ['g', 'kg', 'ml', 'litre', 'pieces', 'packets'] as const;
export const locations = ['Fridge', 'Freezer', 'Pantry'] as const;
export type IngredientInput = { name: string; amount: string; unit: string; category: string; location: string; purchaseDate: string; expiry: string; confirmed: boolean; cost: string };
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
/** Returns field -> message for every invalid field; empty object means valid. Expiry is optional and never guessed. */
export function validateIngredient(input: IngredientInput) {
  const errors: Partial<Record<keyof IngredientInput, string>> = {};
  const name = input.name.trim();
  if (!name) errors.name = 'Enter an ingredient name.'; else if (name.length > 80) errors.name = 'Keep the name under 80 characters.';
  const amount = Number(input.amount);
  if (!input.amount.trim()) errors.amount = 'Enter a quantity.'; else if (!Number.isFinite(amount) || amount <= 0) errors.amount = 'Quantity must be greater than 0.';
  if (!(units as readonly string[]).includes(input.unit)) errors.unit = 'Choose a unit.';
  if (!(locations as readonly string[]).includes(input.location)) errors.location = 'Choose a storage location.';
  if (!(categories as readonly string[]).includes(input.category)) errors.category = 'Choose a category.';
  if (!input.purchaseDate) errors.purchaseDate = 'Enter the purchase date.'; else if (!isDate(input.purchaseDate)) errors.purchaseDate = 'Enter a valid date.';
  if (input.expiry && !isDate(input.expiry)) errors.expiry = 'Enter a valid date.';
  else if (input.expiry && input.purchaseDate && isDate(input.purchaseDate) && input.expiry < input.purchaseDate) errors.expiry = 'Expiry date cannot be before the purchase date.';
  if (input.confirmed && !input.expiry) errors.expiry = 'Add the expiry date to confirm it.';
  if (input.cost.trim() && (!Number.isFinite(Number(input.cost)) || Number(input.cost) < 0)) errors.cost = 'Cost cannot be negative.';
  return errors;
}
export function toIngredient(input: IngredientInput, base?: Ingredient): Ingredient {
  const photo = base?.category === input.category ? base.image : initialInventory.find(i => i.category === input.category)?.image ?? initialInventory[0]?.image ?? '';
  return { id: base?.id ?? crypto.randomUUID(), name: input.name.trim(), amount: Number(input.amount), unit: input.unit, quantity: `${Number(input.amount)} ${input.unit}`, category: input.category, location: input.location, purchaseDate: input.purchaseDate, expiry: input.expiry, confirmed: input.confirmed && !!input.expiry, cost: input.cost.trim() ? Number(input.cost) : 0, image: photo };
}
const STORAGE_KEY = 'annrakshak.inventory.v1';
export function loadInventory(): Ingredient[] | null {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return null; const data = JSON.parse(raw); return Array.isArray(data) ? data : null; } catch { return null; }
}
export function saveInventory(items: Ingredient[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); return true; } catch { return false; } }
