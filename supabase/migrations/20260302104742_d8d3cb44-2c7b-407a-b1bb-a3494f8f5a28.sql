
-- Add display_order to podcasts
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Add display_order to gallery_events
ALTER TABLE public.gallery_events ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Add image_order to gallery_event_images
ALTER TABLE public.gallery_event_images ADD COLUMN IF NOT EXISTS image_order integer NOT NULL DEFAULT 0;
