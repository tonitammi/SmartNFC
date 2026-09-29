import type { SmartActionContent, SmartActionFetchDetails } from '../types';

export const createFetchOptions = (details: SmartActionFetchDetails): RequestInit => {
  const options: RequestInit = {};

  if (details.headers) {
    options.headers = details.headers;
  }

  if (details.body) {
    options.body = typeof details.body === 'string' ? details.body : JSON.stringify(details.body);
  }

  options.method = details.method || 'get';

  return options;
};

export const fetchHandler = (details: SmartActionFetchDetails) => {
  const options: RequestInit = createFetchOptions(details);
  const request = new Request(details.url, options);

  return new Promise<Response>((resolve, reject) => {
    fetch(request).then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
};

export const smartActionHandler = async (smartAction: SmartActionContent) => {
  const { details } = smartAction;
  
  if (details.action_name === 'fetch') {
    console.log('smartActionHandler handle fetch details', details);
    try {
      const res = await fetchHandler(details);
      console.log('smartActionHandler fetchHandler response');

      if (details.response_details) {
        const { response_type : responseType } = details.response_details;

        if (responseType === 'json') return await res.json();
        if (responseType === 'text') return await res.text();
        if (responseType === 'blob') return await res.blob();

        throw new Error(`Unsupported response_type: ${responseType}`);
      }
      return true;
    } catch(err) {
      console.log('smartActionHandler error', err);
      return false;
    }
  }

  return null;
};