import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// The password that unlocks the hidden articles. Change this to rotate the secret.
const SECRET_PASSWORD = 'mamba';
const STORAGE_KEY = 'usrl-secret-unlocked';

type SecretContextType = {
  /** Whether hidden articles are currently unlocked for this session. */
  unlocked: boolean;
  /** Attempt to unlock with a password. Returns true on success. */
  unlock: (password: string) => boolean;
  /** Re-hide the hidden articles. */
  lock: () => void;
};

const SecretContext = createContext<SecretContextType | undefined>(undefined);

function readInitialUnlocked(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function SecretProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean>(readInitialUnlocked);

  const unlock = useCallback((password: string) => {
    const ok = password.trim().toLowerCase() === SECRET_PASSWORD;
    if (ok) {
      setUnlocked(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        /* ignore storage errors */
      }
    }
    return ok;
  }, []);

  const lock = useCallback(() => {
    setUnlocked(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  return (
    <SecretContext.Provider value={{ unlocked, unlock, lock }}>
      {children}
    </SecretContext.Provider>
  );
}

export function useSecret() {
  const context = useContext(SecretContext);
  if (context === undefined) {
    throw new Error('useSecret must be used within a SecretProvider');
  }
  return context;
}
