import { useState } from 'react';
import { CircleCheck, Pencil, Plus, Save, Trash2, Utensils } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GroceryImage } from '@/components/annrakshak/grocery-image';
import { categories, demoToday, locations, shortDate, toIngredient, units, validateIngredient, type Ingredient, type IngredientInput, type WasteEntry } from '@/lib/inventory';

export type DialogMode = 'add' | 'edit' | 'detail' | 'waste';
type Props = { open: boolean; onClose: () => void; item: Ingredient | null; mode: DialogMode; onModeChange: (mode: DialogMode) => void; onSave: (item: Ingredient, isNew: boolean) => void; onDelete: (id: string) => void; onUse: (id: string) => void; onWaste: (entry: WasteEntry, itemId?: string) => void };

function initialInput(item: Ingredient | null): IngredientInput {
  const parts = item?.quantity.split(' ') ?? [];
  return { name: item?.name ?? '', amount: String(item?.amount ?? (parts[0] ?? '')), unit: item?.unit ?? (units.find(u => u === parts.slice(1).join(' ')) ?? 'g'), category: item?.category ?? 'Vegetables', location: item?.location ?? 'Fridge', purchaseDate: item?.purchaseDate ?? demoToday, expiry: item?.expiry ?? '', confirmed: item?.confirmed ?? false, cost: item ? String(item.cost) : '' };
}

export function InventoryDialog({ open, onClose, item, mode, onModeChange, onSave, onDelete, onUse, onWaste }: Props) {
  const [reason, setReason] = useState('Expired');
  const [input, setInput] = useState<IngredientInput>(() => initialInput(mode === 'add' ? null : item));
  const [errors, setErrors] = useState<Partial<Record<keyof IngredientInput, string>>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = (key: keyof IngredientInput, value: string | boolean) => { setInput(prev => ({ ...prev, [key]: value })); setErrors(prev => ({ ...prev, [key]: undefined })); };
  const isForm = mode === 'add' || mode === 'edit';

  function submitIngredient(event: React.FormEvent) {
    event.preventDefault();
    const found = validateIngredient(input);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSave(toIngredient(input, mode === 'edit' ? item ?? undefined : undefined), mode === 'add');
    onClose();
  }
  function submitWaste(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    onWaste({ id: crypto.randomUUID(), name: item?.name ?? String(data.get('name')).trim(), quantity: String(data.get('quantity')).trim(), reason, cost: Number(data.get('cost')), date: demoToday }, item?.id);
    onClose();
  }
  const err = (key: keyof IngredientInput) => errors[key] && <span className="form-error" role="alert">{errors[key]}</span>;
  const title = mode === 'add' ? 'Add an ingredient' : mode === 'edit' ? `Edit ${item?.name ?? 'ingredient'}` : mode === 'waste' ? 'Record food waste' : item?.name;

  return <Dialog open={open} onOpenChange={value => !value && onClose()}><DialogContent className="max-w-md max-h-[90vh] overflow-y-auto"><DialogTitle>{title}</DialogTitle><DialogDescription>{mode === 'detail' ? 'Ingredient details' : isForm ? 'Fields marked * are required.' : 'Waste journal entry'}</DialogDescription>
    {mode === 'detail' && item && <><GroceryImage className="detail-photo" name={item.name} category={item.category} width={1024} height={768} />
      <div className="detail-values"><span>Quantity<strong>{item.quantity}</strong></span><span>Stored in<strong>{item.location}</strong></span><span>Purchased<strong>{shortDate(item.purchaseDate ?? '')}</strong></span><span>Expiry date<strong>{item.expiry ? shortDate(item.expiry) : 'Not recorded'} {item.confirmed && <CircleCheck size={14} />}</strong></span><span>Purchase cost<strong>₹{item.cost}</strong></span></div>
      <Button onClick={() => { onUse(item.id); onClose(); }}><Utensils />Mark as used</Button>
      <div className="form-row"><Button variant="outline" onClick={() => onModeChange('edit')}><Pencil />Edit</Button><Button variant="outline" onClick={() => { onWaste({ id: crypto.randomUUID(), name: item.name, quantity: item.quantity, reason: 'Expired', cost: item.cost, date: demoToday }, item.id); onClose(); }}><Trash2 />Record as waste</Button></div>
      {confirmDelete ? <div className="form-row"><Button variant="destructive" onClick={() => { onDelete(item.id); onClose(); }}>Yes, delete</Button><Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button></div> : <Button variant="ghost" onClick={() => setConfirmDelete(true)}><Trash2 />Delete from inventory</Button>}
    </>}
    {isForm && <form onSubmit={submitIngredient} className="ingredient-form" noValidate>
      {input.name.trim() && <GroceryImage className="detail-photo" name={input.name} category={input.category} width={1024} height={768} />}
      <label>Ingredient name *<input value={input.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Greek yoghurt" maxLength={80} aria-invalid={!!errors.name} />{err('name')}</label>
      <div className="form-row"><label>Quantity *<input type="number" min="0" step="any" inputMode="decimal" value={input.amount} onChange={e => set('amount', e.target.value)} placeholder="e.g. 500" aria-invalid={!!errors.amount} />{err('amount')}</label>
        <label>Unit *<select value={input.unit} onChange={e => set('unit', e.target.value)}>{units.map(u => <option key={u}>{u}</option>)}</select>{err('unit')}</label></div>
      <div className="form-row"><label>Category<select value={input.category} onChange={e => set('category', e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Storage location *<select value={input.location} onChange={e => set('location', e.target.value)}>{locations.map(l => <option key={l}>{l}</option>)}</select>{err('location')}</label></div>
      <div className="form-row"><label>Purchase date *<input type="date" value={input.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} aria-invalid={!!errors.purchaseDate} />{err('purchaseDate')}</label>
        <label>Expiry date<input type="date" value={input.expiry} onChange={e => set('expiry', e.target.value)} aria-invalid={!!errors.expiry} />{err('expiry')}</label></div>
      <p className="text-xs text-muted-foreground">Leave expiry empty if you don't know it — we never guess dates.</p>
      <label className="checkbox-label"><input type="checkbox" checked={input.confirmed} onChange={e => set('confirmed', e.target.checked)} />Expiry date confirmed from packaging</label>
      <label>Cost (₹)<input type="number" min="0" step="0.01" value={input.cost} onChange={e => set('cost', e.target.value)} placeholder="Optional" />{err('cost')}</label>
      <Button type="submit">{mode === 'add' ? <><Plus />Add to inventory</> : <><Save />Save changes</>}</Button></form>}
    {mode === 'waste' && <form onSubmit={submitWaste} className="ingredient-form">
      {!item && <label>Ingredient name<input name="name" placeholder="e.g. Greek yoghurt" required maxLength={80} /></label>}
      <div className="form-row"><label>Quantity<input name="quantity" placeholder="e.g. 500 g" defaultValue={item?.quantity} required /></label><label>Cost (₹)<input name="cost" type="number" min="0" step="0.01" defaultValue={item?.cost} required /></label></div>
      <label>Reason<select value={reason} onChange={e => setReason(e.target.value)}><option>Expired</option><option>Went stale</option><option>Overripe</option><option>Leftovers</option><option>Other</option></select></label>
      <Button type="submit"><Plus />Save entry</Button></form>}
  </DialogContent></Dialog>;
}
