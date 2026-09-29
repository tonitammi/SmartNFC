import type { PublicStorageFolder } from './types';

export const PUBLIC_STORAGE_FOLDERS: PublicStorageFolder[] = ['audio', 'image', 'video', 'document'];
export const ACCEPTED_MIME_TYPES = 'image/*, audio/*, video/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain';

export const ACCEPTED_MIME_TYPES_ARR = [
  'image/*', 
  'audio/*', 
  'video/*', 
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  'text/plain',
];

export const ACCEPTED_MIME_TYPES_BY_FOLDER: Record<PublicStorageFolder, string> = {
  'image': 'image/*',
  'audio': 'audio/*',
  'video': 'video/*',
  'document': 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain',
};

export const PUBLIC_FOLDERS: 
{ folder: PublicStorageFolder, label: string }[] = PUBLIC_STORAGE_FOLDERS.map((folder) => (
  {
    folder,
    label: folder[0].toUpperCase() + folder.substring(1) + 's', 
  }
));