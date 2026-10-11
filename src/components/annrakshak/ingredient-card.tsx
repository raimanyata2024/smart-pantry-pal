import { ArrowUpRight, CircleCheck, Refrigerator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { daysUntil, expiryLabel, shortDate, type Ingredient } from '@/lib/inventory';

export function IngredientCard({ item, compact = false, onSelect }: { item: Ingredient; compact?: boolean; onSelect: (item: Ingredient) => void }) {
  const urgent = item.confirmed && daysUntil(item.expiry) <= 2;
  return <article className={compact ? 'priority-card' : 'ingredient-card'}>
    <div className="ingredient-photo"><img src={item.image} alt={item.name} width={1024} height={768} loading="lazy" />{!compact && <span className="category-tag">{item.category}</span>}</div>
    <div className="ingredient-content">
      <div className="flex items-start justify-between gap-2"><h3>{item.name}</h3><Button variant="ghost" size="icon" aria-label={`View ${item.name}`} onClick={() => onSelect(item)}><ArrowUpRight /></Button></div>
      <p className="quantity">{item.quantity} <span>·</span> <Refrigerator size={12} /> {item.location}</p>
      <div className="ingredient-bottom"><span className={urgent ? 'status status-urgent' : 'status status-fresh'}><span className="status-dot" />{expiryLabel(item)}</span>{compact ? <span className="expiry-date">{shortDate(item.expiry)}</span> : <CircleCheck size={15} className="text-primary" aria-label={item.confirmed ? 'Confirmed expiry date' : 'Unconfirmed expiry date'} />}</div>
      {!compact && <p className="confirmed-date">Confirmed expiry · {shortDate(item.expiry)}</p>}
    </div>
  </article>;
}
