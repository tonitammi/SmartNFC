import type { PostgrestError } from '@supabase/supabase-js';
type ApiId = number | string;

export interface BaseApiClient<DbEntity, ErrorType = PostgrestError> {
  findOneById(id: ApiId): 
  Promise<{data: DbEntity, error: null} | {data: null, error: ErrorType}>;
  findMany<FindOptions = Record<string, unknown>>(options?: FindOptions): 
  Promise<{data: DbEntity[], error: null} | {data: null, error: ErrorType}>;
  create(data: Partial<DbEntity>): 
  Promise<{data: DbEntity, error: null} | {data: null, error: ErrorType}>;
  update(id: ApiId, data: Partial<DbEntity>): 
  Promise<{data: DbEntity, error: null} | {data: null, error: ErrorType}>;
  delete(id: ApiId): 
  Promise<{ error: ErrorType | null }>;
};