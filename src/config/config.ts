const mode = import.meta.env.MODE as string;
const isProduction = mode === 'production' || false;

const appUrl = import.meta.env.VITE_APP_URL as string;
const appPublicUrl = import.meta.env.VITE_APP_PUBLIC_URL as string;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string;

export const config = {
  isProduction,
  mode,
  app: {
    version: '0.1.0',
    url: appUrl,
    publicUrl: appPublicUrl,
    name: 'SmartNFC',
    documentation: 'https://oysamk-my.sharepoint.com/:w:/g/personal/toni_k_tammi_samk_fi/IQB6jtleO5SdQZooj8rF1COEAbGFK5ULu0E08NtVsAqxJao?e=zSjG3K',
  },
  supabase: {
    url: supabaseUrl,
    publishableKey: supabaseKey,
  },
} as const; 
