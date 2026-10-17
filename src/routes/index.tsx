import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDownLeft, ArrowRight, Bell, BookOpen, CalendarDays, Check, ChevronDown, CircleCheck, Clock3, Flame, LayoutGrid, Leaf, Package, Plus, Search, Shield, Sprout, TrendingDown, Trash2, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GroceryImage } from '@/components/annrakshak/grocery-image';
import { IngredientCard } from '@/components/annrakshak/ingredient-card';
import { InventoryDialog, type DialogMode } from '@/components/annrakshak/inventory-dialog';
import { demoToday, initialInventory, initialWaste, loadInventory, saveInventory, shortDate, useFirst, wasteTotal, type Ingredient, type WasteEntry } from '@/lib/inventory';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'AnnRakshak — Kitchen overview' },
    { name: 'description', content: 'Track your food inventory, keep confirmed expiry dates in view, and make every ingredient count with AnnRakshak.' },
    { property: 'og:title', content: 'AnnRakshak — Kitchen overview' },
    { property: 'og:description', content: 'A thoughtful kitchen starts here. Food inventory, use-first ingredients, and your waste journal.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Index,
});

type View = 'Overview' | 'Inventory' | 'Expiry timeline' | 'Waste journal';
function Index() {
  const [view, setView] = useState<View>('Overview');
  const [items, setItems] = useState(initialInventory);
  const [waste, setWaste] = useState(initialWaste);
  const [category, setCategory] = useState('All items');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>('add');
  const loaded = useRef(false);
  useEffect(() => { const stored = loadInventory(); if (stored) setItems(stored); loaded.current = true; }, []);
  useEffect(() => { if (loaded.current && !saveInventory(items)) toast.error('Could not save your inventory on this device.'); }, [items]);
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [notice, setNotice] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [kitchenOpen, setKitchenOpen] = useState(false);
  const [kitchen, setKitchen] = useState('My kitchen');
  const priority = useFirst(items);
  const filtered = items.filter(item => (category === 'All items' || category === item.category) && item.name.toLowerCase().includes(search.trim().toLowerCase()));
  const dates = [...new Set(items.filter(i => i.confirmed).map(i => i.expiry))].sort();
  function openDialog(nextMode: typeof mode, item: Ingredient | null = null) { setMode(nextMode); setSelected(item); setDialogOpen(true); }
  function recordWaste(entry: WasteEntry, itemId?: string) { setWaste(previous => [entry, ...previous]); if (itemId) setItems(previous => previous.filter(i => i.id !== itemId)); setNotice(`${entry.name} recorded in your waste journal.`); }
  const nav: { name: View; icon: typeof LayoutGrid }[] = [{ name: 'Overview', icon: LayoutGrid }, { name: 'Inventory', icon: Package }, { name: 'Expiry timeline', icon: CalendarDays }, { name: 'Waste journal', icon: BookOpen }];
  return <div>
    <header className="app-header"><div className="header-inner">
      <div className="brand"><span className="brand-mark"><Shield size={35} strokeWidth={1.5} /><Leaf className="brand-leaf" strokeWidth={1.7} /></span>AnnRakshak</div>
      <nav className="header-nav" aria-label="Main navigation">{nav.map(({ name, icon: Icon }) => <Button key={name} variant={view === name ? 'headerActive' : 'header'} onClick={() => { setView(name); setNotice(''); }}><Icon />{name}</Button>)}</nav>
      <div className="header-tools"><Button variant="header" size="icon" aria-label="Notifications" onClick={() => setNotifications(!notifications)}><Bell /></Button><span className="header-divider" /><span className="avatar" title="Demo kitchen">MK</span></div>
    </div></header>
    <main className="main-content">
      <div className="greeting"><div><div className="eyebrow flex items-center gap-1">{kitchen}<Button size="icon" variant="ghost" aria-label="Choose kitchen" className="h-5 w-5" onClick={() => setKitchenOpen(!kitchenOpen)}><ChevronDown /></Button></div>
      {kitchenOpen && <div className="flex gap-1 mb-2">{['My kitchen', 'Restaurant', 'Commercial kitchen'].map(name => <Button key={name} size="sm" variant="secondary" onClick={() => { setKitchen(name); setKitchenOpen(false); }}>{name}</Button>)}</div>}
      <h1>{view === 'Overview' ? 'A little care. A lot less waste.' : view === 'Inventory' ? 'Everything in your kitchen.' : view === 'Expiry timeline' ? 'Freshness, at a glance.' : 'Every little bit counts.'}</h1><p>{view === 'Overview' ? 'Keep your kitchen fresh and make every ingredient count.' : view === 'Inventory' ? 'Know what you have, and what needs your attention.' : view === 'Expiry timeline' ? 'Your confirmed expiry dates, in order.' : 'A thoughtful record of what went unused.'}</p></div>
      <div className="greeting-actions"><span className="date-display"><CalendarDays size={15} />Sunday, 11 October</span><Button onClick={() => openDialog('add')}><Plus />Add ingredient</Button></div></div>
      {notice && <div className="notice flex justify-between items-center" role="status"><span className="flex items-center gap-2"><Check size={15} />{notice}</span><Button variant="ghost" size="sm" onClick={() => setNotice('')}>Dismiss</Button></div>}
      {notifications && <div className="notice" role="status"><strong>Kitchen updates</strong><p className="mt-2">{priority.length ? `${priority.length} ingredients need attention. Baby spinach expires today.` : 'No ingredients need immediate attention.'}</p></div>}
      <div className="stats-grid">
        <Stat label="In your inventory" value={String(items.length)} unit="items" icon={Package} foot="A well-stocked, thoughtful kitchen" />
        <Stat label="Use first" value={String(priority.length)} unit="items" icon={Clock3} foot="A little attention goes a long way" warning />
        <Stat label="Inventory value" value={`₹${items.reduce((sum, item) => sum + item.cost, 0)}`} icon={Sprout} foot="Good food, worth taking care of" />
        <Stat label="Waste this month" value={`₹${wasteTotal(waste)}`} icon={TrendingDown} foot={`${waste.length} entries in your waste journal`} />
      </div>
      {view === 'Overview' && <section aria-label="Use First"><div className="section-heading"><div><div className="section-title"><Flame /><h2>Use First</h2><span className="count-badge">{priority.length} need attention</span></div><p className="section-subtitle">Good ingredients. Just a little less time.</p></div><Button variant="link" className="link-control" onClick={() => setView('Expiry timeline')}>View all expiring<ArrowRight /></Button></div><div className="priority-grid">{priority.map(item => <IngredientCard compact key={item.id} item={item} onSelect={item => openDialog('detail', item)} />)}{priority.length === 0 && <p className="empty-state">Nothing needs attention right now.</p>}</div></section>}
      {(view === 'Overview' || view === 'Inventory' || view === 'Expiry timeline') && <div className={view === 'Overview' ? 'workspace-grid' : ''}>
        {(view === 'Overview' || view === 'Inventory') && <section aria-label="Your inventory"><div className="section-heading"><div className="section-title"><h2>Your inventory</h2><span className="text-xs text-muted-foreground">({items.length})</span></div><Button variant="link" className="link-control" onClick={() => view === 'Overview' ? setView('Inventory') : openDialog('add')}>{view === 'Overview' ? 'View inventory' : 'Add ingredient'}<ArrowRight /></Button></div>
        <div className="inventory-toolbar"><div className="filter-tabs" aria-label="Category filter">{['All items', 'Vegetables', 'Dairy', 'Fruit', 'Pantry'].map(name => <Button key={name} variant={category === name ? 'secondary' : 'ghost'} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</Button>)}</div><Button size="sm" onClick={() => openDialog('add')}><Plus />Add Ingredient</Button><label className="search-box"><Search size={13} /><input aria-label="Search ingredients" placeholder="Search ingredients" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
        <div className="inventory-grid">{filtered.map(item => <IngredientCard key={item.id} item={item} onSelect={item => openDialog('detail', item)} />)}</div>{filtered.length === 0 && <p className="empty-state">{items.length ? 'No ingredients match your search or filter.' : 'Your inventory is empty. Add your first ingredient.'}</p>}
        </section>}
        {(view === 'Overview' || view === 'Expiry timeline') && <section className={view === 'Overview' ? 'timeline-section' : ''} aria-label="Upcoming expiry"><div className="section-heading"><div className="section-title"><CalendarDays /><h2>Upcoming expiry</h2></div></div><p className="timeline-range">11 – 18 October <span className="float-right flex items-center gap-1"><CircleCheck size={11} />Confirmed dates</span></p><div className="timeline">{dates.map(date => <div className="timeline-day" key={date}><span className="timeline-dot" /><div className="timeline-label">{date === demoToday ? 'Today' : date === '2026-10-12' ? 'Tomorrow' : new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long' })}<span>{shortDate(date)}</span></div>{items.filter(item => item.expiry === date && item.confirmed).map(item => <div key={item.id} className="timeline-item"><GroceryImage name={item.name} category={item.category} alt="" width={33} height={33} loading="lazy" /><div><strong>{item.name}</strong><small>{item.quantity} · {item.location}</small></div><Button variant="ghost" size="icon" className="ml-auto h-6 w-6" aria-label={`Inspect ${item.name}`} onClick={() => openDialog('detail', item)}><ArrowRight size={12} /></Button></div>)}</div>)}</div>{!dates.length && <p className="empty-state">No confirmed expiry dates yet.</p>}</section>}
      </div>}
      {(view === 'Overview' || view === 'Waste journal') && <section className="journal-section" aria-label="Waste journal"><div className="section-heading"><div><div className="section-title"><BookOpen /><h2>Waste journal</h2></div><p className="section-subtitle">Small reflections for a more mindful kitchen.</p></div><div className="journal-summary"><span>This month <strong>₹{wasteTotal(waste)}</strong></span><Button variant="outline" size="sm" onClick={() => openDialog('waste')}><Plus />Log waste</Button></div></div><table className="journal-table"><thead><tr><th>INGREDIENT</th><th>QUANTITY</th><th>REASON</th><th>DATE</th><th>COST</th></tr></thead><tbody>{waste.map(entry => <tr key={entry.id}><td>{entry.name}</td><td>{entry.quantity}</td><td><span className="reason-tag">{entry.reason}</span></td><td>{shortDate(entry.date)}</td><td>₹{entry.cost}</td></tr>)}</tbody></table>{!waste.length && <p className="empty-state">No waste recorded.</p>}</section>}
      <footer className="page-footer"><span><Leaf size={12} />Less waste. More possibility.</span><span>Sample kitchen · October 2026 <span className="mx-1">/</span>Made with care, AnnRakshak</span></footer>
    </main>
    <InventoryDialog key={`${mode}-${selected?.id ?? 'new'}-${dialogOpen}`} open={dialogOpen} onClose={() => setDialogOpen(false)} item={selected} mode={mode} onModeChange={setMode} onSave={(item, isNew) => { setItems(previous => isNew ? [...previous, item] : previous.map(i => i.id === item.id ? item : i)); toast.success(isNew ? `${item.name} added to your inventory.` : `${item.name} updated.`); }} onDelete={id => { const item = items.find(i => i.id === id); setItems(previous => previous.filter(i => i.id !== id)); toast.success(`${item?.name ?? 'Ingredient'} deleted.`); }} onUse={id => { const item = items.find(i => i.id === id); setItems(previous => previous.filter(i => i.id !== id)); setNotice(`${item?.name ?? 'Ingredient'} marked as used. One less ingredient wasted.`); }} onWaste={recordWaste} />
  </div>;
}
function Stat({ label, value, unit, icon: Icon, foot, warning = false }: { label: string; value: string; unit?: string; icon: typeof Package; foot: string; warning?: boolean }) { return <article className="stat-card"><div className="stat-top"><span>{label}</span><Icon /></div><div className={warning ? 'stat-value text-warning' : 'stat-value'}>{value}{unit && <small>{unit}</small>}</div><p className="stat-foot">{warning ? <Clock3 size={10} /> : <ArrowDownLeft size={10} />}{foot}</p></article>; }
