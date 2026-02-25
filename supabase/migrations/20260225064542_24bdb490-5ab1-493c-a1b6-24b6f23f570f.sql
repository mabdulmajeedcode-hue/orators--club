ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'upcoming';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;