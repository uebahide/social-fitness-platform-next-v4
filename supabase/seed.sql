insert into public.categories (name)
values
  ('running'),
  ('walking'),
  ('hiking'),
  ('swimming'),
  ('cycling')
on conflict (name) do nothing;
