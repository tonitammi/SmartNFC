import { config } from '@/src/config/config';
import { ACCEPTED_MIME_TYPES_BY_FOLDER, PUBLIC_STORAGE_FOLDERS } from './constants';
import type { PublicStorageFolder } from './types';

export const sanitizeFilename = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[^a-z0-9._-]/g, '_');
};

export const generateFileName = (file: File): string => {
  const filename = file.name;
  const fileExtension = getFileExtension(filename);
  const filenameWithOutExtension = removeFileExtension(filename);
  const sanitizedFilename = sanitizeFilename(filenameWithOutExtension);

  return `${sanitizedFilename}_${new Date().getTime()}${fileExtension}`;
};

export const getFileExtension = (fileOrFilename: File | string): string => {
  const filename = typeof fileOrFilename === 'string' ? fileOrFilename : fileOrFilename.name;
  const dotIndex = filename.lastIndexOf('.');

  return filename.substring(dotIndex);
};

export const removeFileExtension = (fileOrFilename: File | string): string => {
  const filename = typeof fileOrFilename === 'string' ? fileOrFilename : fileOrFilename.name;
  const dotIndex = filename.lastIndexOf('.');

  return filename.substring(0, dotIndex);
};

export const getFolderByMimeType = (file: File): PublicStorageFolder => {
  const mediaType = file.type.split('/')[0] as PublicStorageFolder;
  
  if (PUBLIC_STORAGE_FOLDERS.includes(mediaType)) {
    return mediaType;
  }
  return 'document';
};

export const getMimeTypesByFolder = (folder: PublicStorageFolder): string | null => {
  const mimeType = ACCEPTED_MIME_TYPES_BY_FOLDER[folder];
  return mimeType || null;
};

export const getFileUrl = 
(path: string, bucketName: string = 'public_media'): string => {
  return `${config.supabase.url}/storage/v1/object/public/${bucketName}/${path}`;
};

export const folderStringToPublicFolder = (folder: PublicStorageFolder) : { 
  folder: PublicStorageFolder;
  label: string; 
} => {
  return {
    folder,
    label: folder[0].toUpperCase() + folder.substring(1) + 's', 
  };
};
