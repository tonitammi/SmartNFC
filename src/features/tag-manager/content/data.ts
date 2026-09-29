import { CONTENT_VERSIONS } from './constants';
import type { MediaContentType, SmartActionContent, SmartActionDetails } from './types';

const emptyTextContentObj: MediaContentType['text'] = {
  version: CONTENT_VERSIONS['text'],
  label: '',
  content_type: 'text',
  description: '',
  content: '',
};

const emptyImageContentObj: MediaContentType['image'] = {
  version: CONTENT_VERSIONS['image'],
  label: '',
  content_type: 'image',
  description: '',
  url: '',
};

const emptyVideoContentObj: MediaContentType['video'] = {
  version: CONTENT_VERSIONS['video'],
  label: '',
  content_type: 'video',
  description: '',
  url: '',
};


const emptyAudioContentObj: MediaContentType['audio'] = {
  version: CONTENT_VERSIONS['audio'],
  label: '',
  content_type: 'audio',
  description: '',
  url: '',
};

const emptyDocumentContentObj: MediaContentType['document'] = {
  version: CONTENT_VERSIONS['document'],
  label: '',
  content_type: 'document',
  description: '',
  url: '',
  download: false,
};

const defaultSmartActionDetails: SmartActionDetails = {
  action_name: 'fetch',
  method: 'get',
  url: 'https://google.com?q=smartNFC',
  response_details: {
    response_type: 'json',
  },
};

const emptySmartAction: SmartActionContent = {
  content_type: 'smart_action',
  version: 1,
  label: '',
  auto_execution: true,
  details: defaultSmartActionDetails,
};

export const getInitialMediaContentObj = <T>(type: 'audio' | 'image' | 'video' | 'text' | 'document') => {
  const record = {
    audio: emptyAudioContentObj,
    image: emptyImageContentObj, 
    text: emptyTextContentObj,
    video: emptyVideoContentObj,
    document: emptyDocumentContentObj,
  };

  return record[type] as T;
};

export const getInitialSmartAction = () => {
  return emptySmartAction;
};