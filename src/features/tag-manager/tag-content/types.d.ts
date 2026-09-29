import type { ContentEntry, InsertContentEntry } from '@/src/features/tag-manager/content/types';
import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';

interface BaseTagContent<ContentType> {
  tag_id: string;
  content: ContentType;
};

export type TagContentAssignment = SupabaseDatabase['public']['Tables']['tag_content_assignments']['Row'];

export type TagContent = BaseTagContent<ContentEntry>;
export type InsertTagContent = BaseTagContent<InsertContentEntry>;