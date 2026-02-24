
-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  section TEXT NOT NULL,
  image_url TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are publicly readable"
ON public.team_members FOR SELECT USING (true);

CREATE POLICY "Allow inserting team members"
ON public.team_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow updating team members"
ON public.team_members FOR UPDATE USING (true);

CREATE POLICY "Allow deleting team members"
ON public.team_members FOR DELETE USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('events-images', 'events-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('team-images', 'team-images', true);

-- Storage policies for public read
CREATE POLICY "Public read events images" ON storage.objects FOR SELECT USING (bucket_id = 'events-images');
CREATE POLICY "Public read gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY "Public read team images" ON storage.objects FOR SELECT USING (bucket_id = 'team-images');

-- Storage policies for upload (anon can upload)
CREATE POLICY "Allow upload events images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'events-images');
CREATE POLICY "Allow upload gallery images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-images');
CREATE POLICY "Allow upload team images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-images');

-- Allow delete on storage
CREATE POLICY "Allow delete events images" ON storage.objects FOR DELETE USING (bucket_id = 'events-images');
CREATE POLICY "Allow delete gallery images" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-images');
CREATE POLICY "Allow delete team images" ON storage.objects FOR DELETE USING (bucket_id = 'team-images');
