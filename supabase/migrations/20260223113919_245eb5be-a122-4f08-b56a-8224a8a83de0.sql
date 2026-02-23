
-- Allow public SELECT on newsletter_subscribers, join_applications, contact_messages for admin reads
-- These are read via anon key in the simple password-protected admin panel
CREATE POLICY "Allow reading subscribers" ON public.newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Allow reading applications" ON public.join_applications FOR SELECT USING (true);
CREATE POLICY "Allow reading messages" ON public.contact_messages FOR SELECT USING (true);

-- Allow admin to manage events, podcasts, gallery (INSERT/UPDATE/DELETE via anon key)
CREATE POLICY "Allow inserting events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updating events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Allow deleting events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Allow inserting podcasts" ON public.podcasts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updating podcasts" ON public.podcasts FOR UPDATE USING (true);
CREATE POLICY "Allow deleting podcasts" ON public.podcasts FOR DELETE USING (true);

CREATE POLICY "Allow inserting gallery" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updating gallery" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "Allow deleting gallery" ON public.gallery FOR DELETE USING (true);
