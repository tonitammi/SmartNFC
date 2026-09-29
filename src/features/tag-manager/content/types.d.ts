import type { 
  ContentJSONSchema, 
  TextContentJSONSchema, 
  ImageContentJSONSchema, 
  AudioContentJSONSchema,
  ActionContentJSONSchema,
  VideoContentJSONSchema,
  DocumentContentJSONSchema,
  SmartActionContentJSONSchema,
  SmartActionFetchDetails,
} from './schemas';
import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';
import * as z from 'zod';

// Content JSON types for Supabase database
export type ContentJSONType = z.infer<typeof ContentJSONSchema>;

export type ContentJSON = ContentJSONType | (ContentJSONType)[];
export type ContentType = z.infer<typeof ContentJSONSchema>['content_type'];

// Actions and Smart actions
export type ActionContent = z.infer<typeof ActionContentJSONSchema>;
export type Action = z.infer<typeof ActionContentJSONSchema.shape.action>;

export type SmartActionContent = z.infer<typeof SmartActionContentJSONSchema>;
export type SmartActionDetails = z.infer<typeof SmartActionContentJSONSchema.shape['details']>;
export type SmartActionFetchDetails = z.infer<typeof SmartActionFetchDetails>;
export type SmartActionFetchDetailsType = z.infer<typeof SmartActionFetchDetails>;

// Media Content Types
type TextContent = z.infer<typeof TextContentJSONSchema>;
type ImageContent = z.infer<typeof ImageContentJSONSchema>;
type AudioContent = z.infer<typeof AudioContentJSONSchema>;
type VideoContent = z.infer<typeof VideoContentJSONSchema>;
type DocumentContent = z.infer<typeof DocumentContentJSONSchema>;

export type MediaContentType = {
  text: TextContent;
  image: ImageContent;
  audio: AudioContent;
  video: VideoContent;
  document: DocumentContent;
};

// Content Entries
export type ContentEntryStatus = 'draft' | 'published';
export type ContentEntryRequiredRole = 'visitor' | 'user' | 'editor' | 'admin';

export type ContentEntry = SupabaseDatabase['public']['Tables']['content_entries']['Row'];

export type ContentEntryRelations = SupabaseDatabase['public']['Tables']['content_entries']['Relationships'];
export type UpdateContentEntry = Omit<SupabaseDatabase['public']['Tables']['content_entries']['Update'], 'id'>;

export type InsertContentEntry = Omit<SupabaseDatabase['public']['Tables']['content_entries']['Insert'], 'id'>;



