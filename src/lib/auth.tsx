import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

type AuthContextType = {
  isLoaded: boolean;
  userId: string | null;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const value = {
    isLoaded,
    userId: user?.id ?? null,
    isSignedIn: isSignedIn ?? false,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}