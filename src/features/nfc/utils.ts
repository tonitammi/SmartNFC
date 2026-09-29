import type { NFCTagInfo } from './types';

export const getTagDetails = (event: NDEFReadingEvent): NFCTagInfo => {
  const decoder = new TextDecoder();
  return {
    id: event.serialNumber || 'Unknown ID',
    recordCount: event.message.records.length,
    records: event.message.records.map(r => ({
      data: decoder.decode(r.data),
      mediaType: r.mediaType,
      type: r.recordType,
      encoding: r.encoding,
      lang: r.lang,
    })),
  };
};


type InjectableValue = 'orgId' | 'tagSerial' | 'tagType';
type ValuesToInject = Partial<Record<InjectableValue, string>>;

export const injectTagDetails = (
  recordData: string, 
  options: {
    valuesToInject: ValuesToInject;
    keysToInject: InjectableValue[];
  }
) => {
  const { 
    valuesToInject, 
    keysToInject = ['orgId', 'tagSerial', 'tagType'],
  } = options;
  let str = recordData;

  Object.keys(valuesToInject).forEach((key) => {
    const detailKey = key as InjectableValue;
    if (!keysToInject.includes(detailKey)) return;
    str = str.replaceAll(
      `{{${key}}}`, 
      valuesToInject[detailKey]!
    );
  });

  return str;
};

export const isMakeReadOnlySupported = (): boolean => {
  if ('NDEFReader' in window && 'makeReadOnly' in NDEFReader.prototype) {
    return true;
  }
  return false;
};

export type NFCWriterFuncOptions = {
  type?: NDEFRecordInit['recordType'];
  keysToInject?: InjectableValue[];
};
export const createNFCWriter = (orgId: string) => {
  const writeController = new AbortController();

  const NFCWriter = async (data: string, options: NFCWriterFuncOptions = {}) => {
    const ndef = new NDEFReader();    
    const details = {
      type: 'nfc',
      orgId,
      tagSerial: `tag_${Date.now()}`,
    };
    const detailParams = `?tagType=${details.type}&orgId=${details.orgId}&tagSerial=${details.tagSerial}`;

    const record: NDEFRecordInit = {
      recordType: options?.type || 'url',
      data: data + detailParams,
    };

    try {
      await ndef.write({ records: [record] }, { signal: writeController.signal });
      
      return { record, details };
    } catch (err) {
      throw new Error(`NFC Write failed: ${(err as Error).message}`);
    }
  };

  return { writeController, NFCWriter };
};