import { UAParser } from 'ua-parser-js';
import { supabase } from '../supabase/supabaseClient';

export const getParsedUserAgent = async () => {
  const { userAgent, language } = window.navigator;
  const uaResult = UAParser(userAgent);
  const user  = await supabase.auth.getUser();

  return {
    user_agent: uaResult,
    language,
    is_authenticated: !!user,
    user,
  };
};