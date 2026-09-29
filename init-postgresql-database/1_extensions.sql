-- Enable MODDATETIME extension (for automatic updated_at field updates -> see 5_triggers-sql)
create extension if not exists moddatetime schema extensions;