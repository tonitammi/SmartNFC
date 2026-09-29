import type { Database as DatabaseGenerated, Json } from '@/database-generated.types';
import type { ContentJSON } from '@/src/features/tag-manager/content/types';
import type { MergeDeep } from 'type-fest';


export type SupabaseDatabase = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        content_entries: {
          Row: {
            content_data: ContentJSON;
          };
          Insert: {
            content_data?: ContentJSON | Json;
          };
          Update: {
            content_data?: ContentJSON | Json;
          };
        },
      },
    },
  }
>

export type DatabaseTables = SupabaseDatabase['public']['Tables'];