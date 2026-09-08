create policy "Lettura immagini prodotti"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "Amministratori caricano immagini prodotti"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Amministratori aggiornano immagini prodotti"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Amministratori eliminano immagini prodotti"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
