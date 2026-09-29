import * as z from 'zod';

// Media content
const MediaContentFields = z.object({
  version: z.int(),
  label: z.string(),
  description: z.string().optional(),
});

export const TextContentJSONSchema = MediaContentFields.extend({
  content_type: z.literal('text'),
  content: z.string(),
});

export const DocumentContentJSONSchema = MediaContentFields.extend({
  content_type: z.literal('document'),
  url: z.string(),
  download: z.boolean(),
});

export const ImageContentJSONSchema = MediaContentFields.extend({
  content_type: z.literal('image'),
  url: z.string(),
});


export const AudioContentJSONSchema = MediaContentFields.extend({
  content_type: z.literal('audio'),
  url: z.string(),
});

export const VideoContentJSONSchema = MediaContentFields.extend({
  content_type: z.literal('video'),
  url: z.string(),
});

// Actions
export const CallActionContentSchema = z.object({
  version: z.int(),
  action_name: z.literal('call'),
  tel: z.string(),
});

export const SMSActionContentSchema = z.object({
  version: z.int(),
  action_name: z.literal('sms'),
  tel: z.string(),
  msg: z.string().optional(),
});

export const WhatsAppActionContentSchema = z.object({
  version: z.int(),
  action_name: z.literal('whatsapp'),
  tel: z.string(),
  msg: z.string().optional(),
});

export const RedirectActionContentSchema = z.object({
  version: z.int(),
  action_name: z.literal('redirect'),
  url: z.string(),
  auto_redirect: z.boolean().default(false),
});

// Action contents
export const ActionContentJSONSchema = z.object({
  version: z.int(),
  content_type: z.literal('action'),
  label: z.string(),
  label_type: z.enum(['link', 'button']).default('button'),
  action: z.discriminatedUnion('action_name', [
    CallActionContentSchema,
    SMSActionContentSchema,
    WhatsAppActionContentSchema,
    RedirectActionContentSchema,
  ]),
});

export const SmartActionFetchDetails = z.object({
  action_name: z.literal('fetch'),
  url: z.url(), // Huom: z.url() -> z.string().url()
  method: z.enum(['get', 'post', 'put', 'patch', 'options', 'delete']).default('get'),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.union([
    z.string(),
    z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  ]).optional(),
  response_details: z.object({
    response_type: z.enum(['arrayBuffer', 'blob', 'formData', 'json', 'text']).default('json'),
  }).optional(),
});

export const SmartActionOtherDetails = z.object({
  action_name: z.literal('other'),
});


export const SmartActionContentJSONSchema = z.object({
  version: z.int(),
  content_type: z.literal('smart_action'),
  label: z.string(),
  auto_execution: z.boolean().optional().default(false),
  details: z.discriminatedUnion('action_name', [
    SmartActionFetchDetails,
    SmartActionOtherDetails,
  ]),
});

export const ContentJSONSchema = z.discriminatedUnion('content_type', [
  // Media
  TextContentJSONSchema,
  DocumentContentJSONSchema,
  AudioContentJSONSchema,
  ImageContentJSONSchema,
  VideoContentJSONSchema,
  // Actions
  ActionContentJSONSchema,
  SmartActionContentJSONSchema,
]);
