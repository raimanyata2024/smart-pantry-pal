import { ArrowUpRight, CircleCheck, Refrigerator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GroceryImage } from '@/components/annrakshak/grocery-image';
import { daysUntil, expiryLabel, shortDate, type Ingredient } from '@/lib/inventory';

export function IngredientCard({ item, compact = false, onSelect }: { item: Ingredient; compact?: boolean; onSelect: (item: Ingredient) => void }) {
  const urgent = item.confirmed && !!item.expiry && daysUntil(item.expiry) <= 2;
  return <article className={compact ? 'priority-card' : 'ingredient-card'}>
    <div className="ingredient-photo"><GroceryImage name={item.name} category={item.category} width={1024} height={768} loading="lazy" />{!compact && <span className="category-tag">{item.category}</span>}</div>
    <div className="ingredient-content">
      <div className="flex items-start justify-between gap-2"><h3>{item.name}</h3><Button variant="ghost" size="icon" aria-label={`View ${item.name}`} onClick={() => onSelect(item)}><ArrowUpRight /></Button></div>
      <p className="quantity">{item.quantity} <span>·</span> <Refrigerator size={12} /> {item.location}</p>
      <div className="ingredient-bottom"><span className={urgent ? 'status status-urgent' : 'status status-fresh'}><span className="status-dot" />{expiryLabel(item)}</span>{compact ? <span className="expiry-date">{shortDate(item.expiry)}</span> : item.confirmed && <CircleCheck size={15} className="text-primary" aria-label="Confirmed expiry date" />}</div>
      {!compact && <p className="confirmed-date">{!item.expiry ? 'Expiry not recorded' : `${item.confirmed ? 'Confirmed expiry' : 'Unconfirmed date'} · ${shortDate(item.expiry)}`}</p>}
    </div>
  </article>;
}
