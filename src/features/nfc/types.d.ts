export interface NFCTagInfo {
  id: string;
  recordCount: number;
  records: {
    data?: DataView<ArrayBufferLike> | string;
    mediaType?: string;
    type: string;
    encoding?: string;
    lang?: string;
  }[];
};

export type NFCWriteOptions = {
  timeout?: number;
  type?: NFCRecordType;
};