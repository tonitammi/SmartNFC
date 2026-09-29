begin;
-- remove the supabase_realtime publication
drop
  publication if exists supabase_realtime;
-- re-create the supabase_realtime publication with no tables
create publication supabase_realtime;
commit;
-- add a table 'content_entries' to the publication
alter
  publication supabase_realtime add table content_entries;