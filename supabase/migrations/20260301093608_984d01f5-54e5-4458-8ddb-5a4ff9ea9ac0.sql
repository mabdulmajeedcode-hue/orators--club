
-- 1. Add linkedin_url to team_members
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS linkedin_url text;

-- 2. Create popup table
CREATE TABLE public.popups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  cta_text text,
  cta_link text,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Popups are publicly readable" ON public.popups FOR SELECT USING (true);
CREATE POLICY "Allow inserting popups" ON public.popups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updating popups" ON public.popups FOR UPDATE USING (true);
CREATE POLICY "Allow deleting popups" ON public.popups FOR DELETE USING (true);

-- 3. Create gallery_events table for event-wise gallery
CREATE TABLE public.gallery_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  cover_image text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery events are publicly readable" ON public.gallery_events FOR SELECT USING (true);
CREATE POLICY "Allow inserting gallery events" ON public.gallery_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updating gallery events" ON public.gallery_events FOR UPDATE USING (true);
CREATE POLICY "Allow deleting gallery events" ON public.gallery_events FOR DELETE USING (true);

-- 4. Create gallery_event_images table
CREATE TABLE public.gallery_event_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_event_id uuid NOT NULL REFERENCES public.gallery_events(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_event_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery event images are publicly readable" ON public.gallery_event_images FOR SELECT USING (true);
CREATE POLICY "Allow inserting gallery event images" ON public.gallery_event_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updating gallery event images" ON public.gallery_event_images FOR UPDATE USING (true);
CREATE POLICY "Allow deleting gallery event images" ON public.gallery_event_images FOR DELETE USING (true);

-- 5. Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('podcast-images', 'podcast-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('popup-images', 'popup-images', true) ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies for podcast-images
CREATE POLICY "Public read podcast images" ON storage.objects FOR SELECT USING (bucket_id = 'podcast-images');
CREATE POLICY "Allow upload podcast images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'podcast-images');
CREATE POLICY "Allow update podcast images" ON storage.objects FOR UPDATE USING (bucket_id = 'podcast-images');
CREATE POLICY "Allow delete podcast images" ON storage.objects FOR DELETE USING (bucket_id = 'podcast-images');

-- 7. Storage policies for popup-images
CREATE POLICY "Public read popup images" ON storage.objects FOR SELECT USING (bucket_id = 'popup-images');
CREATE POLICY "Allow upload popup images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'popup-images');
CREATE POLICY "Allow update popup images" ON storage.objects FOR UPDATE USING (bucket_id = 'popup-images');
CREATE POLICY "Allow delete popup images" ON storage.objects FOR DELETE USING (bucket_id = 'popup-images');
