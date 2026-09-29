import { createClient } from '@supabase/supabase-js';
import { config } from '@/src/config/config';
import type { SupabaseDatabase } from './database.types';


const supabaseUrl = config.supabase.url;
const supabasePublishableKey = config.supabase.publishableKey;



export const supabase = createClient<SupabaseDatabase>(
    supabaseUrl, 
    supabasePublishableKey
);

export type TypedSupabaseClient = typeof supabase;