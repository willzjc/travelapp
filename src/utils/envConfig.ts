/**
 * Utility function to get environment variables that works with both
 * Vite's VITE_ prefix and React's REACT_APP_ prefix
 */
export const getEnvVariable = (key: string): string => {
  // Try the Vite format first
  const viteKey = `VITE_${key}`;
  const viteValue = import.meta.env[viteKey];
  
  // If found, return it
  if (viteValue) return viteValue as string;
  
  // Try the React format as fallback (for development with .env files)
  const reactKey = `REACT_APP_${key}`;
  const reactValue = import.meta.env[reactKey];
  
  if (reactValue) return reactValue as string;
  
  // If not found in either format, check if we're in a browser environment
  if (typeof window !== 'undefined' && (window as any).ENV_CONFIG && (window as any).ENV_CONFIG[key]) {
    return (window as any).ENV_CONFIG[key];
  }
  
  // Return empty string as fallback
  return '';
};

/**
 * Google OAuth Client ID - primary auth method
 */
export const googleClientId = getEnvVariable('GOOGLE_CLIENT_ID');

/**
 * Check if Google authentication is properly configured
 */
export const isGoogleAuthConfigured = (): boolean => {
  return Boolean(googleClientId);
};

/**
 * Firebase configuration using environment variables without fallbacks
 */
export const firebaseConfig = {
  apiKey: getEnvVariable('FIREBASE_API_KEY'),
  authDomain: getEnvVariable('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVariable('FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVariable('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVariable('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVariable('FIREBASE_APP_ID'),
};

/**
 * Checks if Firebase is properly configured with all required values
 * @returns boolean indicating if Firebase can be initialized
 */
export const isFirebaseConfigured = (): boolean => {
  // Check if all required Firebase config properties exist and are non-empty
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};
