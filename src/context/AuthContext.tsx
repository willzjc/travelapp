import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from '@react-oauth/google';
import { googleClientId, isGoogleAuthConfigured } from '../utils/envConfig';

interface UserProfile {
  uid: string;         // Google's sub field
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface GoogleUserCredential {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The inner provider that uses the Google login hook
const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to load user from localStorage on initial mount
  useEffect(() => {
    const savedUser = localStorage.getItem('travelapp-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
    setLoading(false);
  }, []);

  // Google login handler
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from ID token
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`);
        const userInfo: GoogleUserCredential = await response.json();
        
        const profile: UserProfile = {
          uid: userInfo.sub,
          displayName: userInfo.name,
          email: userInfo.email,
          photoURL: userInfo.picture || null,
        };
        
        setUser(profile);
        localStorage.setItem('travelapp-user', JSON.stringify(profile));
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    },
    onError: (error) => console.error('Login Failed:', error),
  });

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await googleLogin();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('travelapp-user');
    return Promise.resolve();
  };

  const value = {
    user,
    isAuthenticated: user !== null,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// The outer provider that sets up the Google OAuth provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  if (!isGoogleAuthConfigured()) {
    console.warn('Google Client ID not configured. Authentication will not work.');
    return <>{children}</>;
  }
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
