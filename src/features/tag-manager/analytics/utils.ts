import { UAParser } from 'ua-parser-js';

export const getParsedUserAgent = () => {
  const { userAgent, language } = window.navigator;
  const uaResult = UAParser(userAgent);

  return {
    user_agent: uaResult,
    language,
  };
};

const LOG_ID_KEY = 'log_id_key';
const LOGS_KEY = 'scan_logs';

const getOrCreateLoggerId = () => {
  const logId = sessionStorage.getItem(LOG_ID_KEY);

  if (!logId) {
    const logIdValue = crypto.randomUUID();
    sessionStorage.setItem(LOG_ID_KEY, logIdValue);
    return logIdValue;
  }
  
  return logId;
};

const getLogsFromStorage = () => {
  const logsJSON= sessionStorage.getItem(LOGS_KEY);
  const logsArr : {loggerId: string, tagId: string}[] = !logsJSON ? [] : JSON.parse(logsJSON);

  return logsArr;
};

export const isLoggedScan = (tagId: string) => {
  const loggerId = getOrCreateLoggerId();
  const logs = getLogsFromStorage();

  return logs.find(l => l.loggerId === loggerId && l.tagId === tagId);
};

export const saveLogScanEvent = (tagId: string) => {
  const loggerId = getOrCreateLoggerId();
  const logs = getLogsFromStorage();
  logs.push({ loggerId, tagId });
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

type GetDayLabelOptions =  { 
  language?: 'en' | 'fi' | string,
  type?: 'short' | 'long',
};

type LabelObj = {
  [k: string] : { short: string, long: string }
};

export const getDayLabel = (
index: number, 
{
  language = 'en',
  type = 'short',
} : GetDayLabelOptions = {}) => {

  const allowedLanguages = ['en' , 'fi'];
  const defaultLang = 'en';

  if (!allowedLanguages.includes(language)) {
    language = defaultLang;
  }

  const labels: Record<number, LabelObj> = {
    1: { 
      en: { short: 'Mon', long: 'Monday' }, 
      fi: { short: 'Ma', long: 'Maanantai' }, 
    },
    2: { 
      en: { short: 'Tue', long: 'Tuesday' }, 
      fi: { short: 'Ti', long: 'Tiistai' }, 
    },
    3: { 
      en: { short: 'Wed', long: 'Wednesday' }, 
      fi: { short: 'Ke', long: 'Keskiviikko' }, 
    },
    4: { 
      en: { short: 'Thu', long: 'Thursday' }, 
      fi: { short: 'To', long: 'Torstai' }, 
    },
    5: { 
      en: { short: 'Fri', long: 'Friday' }, 
      fi: { short: 'Pe', long: 'Perjantai' }, 
    },
    6: { 
      en: { short: 'Sat', long: 'Saturday' }, 
      fi: { short: 'La', long: 'Lauantai' }, 
    },
    7: { 
      en: { short: 'Sun', long: 'Sunday' }, 
      fi: { short: 'Su', long: 'Sunnuntai' }, 
    },
  };

  const day = labels[index];
  if (!day) return '';

  if (!day[language]) return '';
  if (day[language][type]) return '';
  
  return day[language][type];
};