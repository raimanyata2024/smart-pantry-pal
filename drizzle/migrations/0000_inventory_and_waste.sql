CREATE TABLE public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 80),
  category text NOT NULL DEFAULT 'Vegetables',
  amount numeric NOT NULL CHECK (amount > 0),
  unit text NOT NULL,
  location text NOT NULL,
  purchase_date date NOT NULL,
  expiry_date date,
  expiry_confirmed boolean NOT NULL DEFAULT false,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expiry_date IS NULL OR expiry_date >= purchase_date),
  CHECK (NOT expiry_confirmed OR expiry_date IS NOT NULL)
);
CREATE UNIQUE INDEX inventory_items_no_duplicates ON public.inventory_items (user_id, lower(trim(name)), purchase_date, coalesce(expiry_date, '1900-01-01'::date), location);
CREATE INDEX inventory_items_user_idx ON public.inventory_items (user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_items TO authenticated;
GRANT ALL ON public.inventory_items TO service_role;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own inventory" ON public.inventory_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own inventory" ON public.inventory_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own inventory" ON public.inventory_items FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own inventory" ON public.inventory_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.waste_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 80),
  quantity text NOT NULL CHECK (char_length(quantity) <= 40),
  reason text NOT NULL,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0),
  wasted_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX waste_entries_user_idx ON public.waste_entries (user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.waste_entries TO authenticated;
GRANT ALL ON public.waste_entries TO service_role;
ALTER TABLE public.waste_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own waste" ON public.waste_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own waste" ON public.waste_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own waste" ON public.waste_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER inventory_items_touch BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();