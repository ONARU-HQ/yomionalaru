CREATE POLICY "media_read_auth" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media');
CREATE POLICY "media_insert_staff" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_staff(auth.uid()));
CREATE POLICY "media_update_staff" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'media' AND public.is_staff(auth.uid()));
CREATE POLICY "media_delete_staff" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_staff(auth.uid()));