
-- Add year column to gallery_events for year-wise filtering
ALTER TABLE public.gallery_events ADD COLUMN year integer;

-- Create publications table for newsletters & publications
CREATE TABLE public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  year integer NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'pdf',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on publications
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Publications are publicly readable" ON public.publications FOR SELECT TO public USING (true);
CREATE POLICY "Allow inserting publications" ON public.publications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow updating publications" ON public.publications FOR UPDATE TO public USING (true);
CREATE POLICY "Allow deleting publications" ON public.publications FOR DELETE TO public USING (true);

-- Create storage bucket for publication files
INSERT INTO storage.buckets (id, name, public) VALUES ('publication-files', 'publication-files', true);

-- Allow public access to publication files
CREATE POLICY "Public read publication files" ON storage.objects FOR SELECT TO public USING (bucket_id = 'publication-files');
CREATE POLICY "Allow upload publication files" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'publication-files');
CREATE POLICY "Allow delete publication files" ON storage.objects FOR DELETE TO public USING (bucket_id = 'publication-files');
