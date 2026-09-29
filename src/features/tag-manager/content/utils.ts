import PhoneIcon from '@mui/icons-material/Phone';
import SmsIcon from '@mui/icons-material/Sms';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LaunchIcon from '@mui/icons-material/Launch';
import type { ActionContent, InsertContentEntry } from './types';

const parseTel = (tel: string) => tel.replace(/[^\d]/g, '');

type MessageParams = {
  tel: string;
  msg?: string;
};

export const generateWhatsAppLink = ({ tel, msg } : MessageParams) => {
  const parsedTel = parseTel(tel);  
  const msgParams = msg ? `?text=${encodeURIComponent(msg)}` : '';

  return`https://wa.me/${parsedTel}${msgParams}`;
};

export const generateSMSLink = ({ tel, msg } : MessageParams) => {
  const parsedTel = parseTel(tel);
  const msgParams = msg ? `?body=${encodeURIComponent(msg)}` : '';
  
   return `sms:${parsedTel}${msgParams}`;
};

export const generateCallLink = (tel: string) => {
  const parsedTel = parseTel(tel);
  return `tel:${parsedTel}`;
};

export const getActionAttributes = (action : ActionContent['action']) => {

  const defaultAttributes = {
    href: '',
    IconComponent: LaunchIcon,
    target: '_self',
    rel: undefined,
  };

  switch (action.action_name) {
    case 'call':
      return {
        ...defaultAttributes,
        href: generateCallLink(action.tel),
        IconComponent: PhoneIcon,
      };
    case 'sms':
      return {
        ...defaultAttributes,
        href: generateSMSLink(action),
        IconComponent: SmsIcon,
      };
    case 'whatsapp':
      return {
        ...defaultAttributes,
        href: generateWhatsAppLink(action),
        IconComponent: WhatsAppIcon,
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    case 'redirect':
      return {
        ...defaultAttributes,
        href: action.url,
        IconComponent: LaunchIcon,
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    default:
      return defaultAttributes;
  }
};

export const contentEntryToEncodedJSON = (contentEntry: InsertContentEntry) => {
  const json = JSON.stringify({
    ...contentEntry,
    id: 'preview_id_' + new Date().getTime(),
  });
  const encodedJSON = encodeURI(json);

  return encodedJSON;
};

export const generatePreviewLink = (contentEntry: InsertContentEntry) => {
  const baseURL = '/app/content/preview';
  const encodedJSON = contentEntryToEncodedJSON(contentEntry);
  return `${baseURL}?previewData=${encodedJSON}`;
};

export const handleVideoURL = (url: string) => {
  console.log('handleVideoURL', url);

  const extractGoogleDriveId = (url: string): string | null => {
    if (!url) return null;

    const regex = /(?:d\/|id=|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]{25,100})/;
    const match = url.match(regex);

    return match ? match[1] : null;
  };

  console.log(extractGoogleDriveId);
  return url;
};