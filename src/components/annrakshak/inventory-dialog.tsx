import { useState } from 'react';
import { CircleCheck, Plus, Trash2, Utensils } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { demoToday, initialInventory, shortDate, type Ingredient, type WasteEntry } from '@/lib/inventory';

type Props = { open: boolean; onClose: () => void; item: Ingredient | null; mode: 'add' | 'detail' | 'waste'; onAdd: (item: Ingredient) => void; onUse: (id: string) => void; onWaste: (entry: WasteEntry, itemId?: string) => void };
export function InventoryDialog({ open, onClose, item, mode, onAdd, onUse, onWaste }: Props) {
  const [reason, setReason] = useState('Expired');
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    if (mode === 'add') {
      const category = String(data.get('category')); const photo = initialInventory.find(i => i.category === category)?.image ?? initialInventory[0]?.image ?? '';
      onAdd({ id: crypto.randomUUID(), name: String(data.get('name')), quantity: String(data.get('quantity')), category, location: String(data.get('location')), expiry: String(data.get('expiry')), confirmed: data.get('confirmed') === 'on', cost: Number(data.get('cost')), image: photo });
    } else onWaste({ id: crypto.randomUUID(), name: item?.name ?? String(data.get('name')), quantity: String(data.get('quantity')), reason, cost: Number(data.get('cost')), date: demoToday }, item?.id);
    onClose();
  }
  return <Dialog open={open} onOpenChange={value => !value && onClose()}><DialogContent className="max-w-md"><DialogTitle>{mode === 'add' ? 'Add an ingredient' : mode === 'waste' ? 'Record food waste' : item?.name}</DialogTitle><DialogDescription>{mode === 'detail' ? 'Ingredient details' : mode === 'add' ? 'Your kitchen inventory' : 'Waste journal entry'}</DialogDescription>
    {mode === 'detail' && item ? <><img className="detail-photo" src={item.image} alt={item.name} width={1024} height={768} /><div className="detail-values"><span>Quantity<strong>{item.quantity}</strong></span><span>Stored in<strong>{item.location}</strong></span><span>Expiry date<strong>{shortDate(item.expiry)} {item.confirmed && <CircleCheck size={14} />}</strong></span><span>Purchase cost<strong>₹{item.cost}</strong></span></div><Button onClick={() => { onUse(item.id); onClose(); }}><Utensils />Mark as used</Button><Button variant="outline" onClick={() => { onWaste({ id: crypto.randomUUID(), name: item.name, quantity: item.quantity, reason: 'Expired', cost: item.cost, date: demoToday }, item.id); onClose(); }}><Trash2 />Record as waste</Button></> : <form onSubmit={submit} className="ingredient-form">
    {!item && <label>Ingredient name<input name="name" placeholder="e.g. Greek yoghurt" required /></label>}
    <div className="form-row"><label>Quantity<input name="quantity" placeholder="e.g. 500 g" defaultValue={item?.quantity} required /></label><label>Cost (₹)<input name="cost" type="number" min="0" step="0.01" defaultValue={item?.cost} required /></label></div>
    {mode === 'add' ? <><div className="form-row"><label>Category<select name="category"><option>Vegetables</option><option>Dairy</option><option>Fruit</option><option>Pantry</option></select></label><label>Storage<select name="location"><option>Fridge</option><option>Freezer</option><option>Pantry</option></select></label></div><label>Expiry date<input type="date" name="expiry" required /></label><label className="checkbox-label"><input name="confirmed" type="checkbox" />Expiry date confirmed from packaging</label></> : <label>Reason<select value={reason} onChange={e => setReason(e.target.value)}><option>Expired</option><option>Went stale</option><option>Overripe</option><option>Leftovers</option><option>Other</option></select></label>}
    <Button type="submit"><Plus />{mode === 'add' ? 'Add to inventory' : 'Save entry'}</Button></form>}
  </DialogContent></Dialog>;
}
