import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthSession, authService } from '../services/authService';
import { GitHubUser, GitHubRateLimit } from '../models/github';
import { githubApi } from '../api/githubApi';
import { FALLBACK_GAMESITEONLINE_USER } from '../api/mockFallbackData';

interface AuthContextType {
  session: AuthSession | null;
  user: GitHubUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  canWrite: boolean;
  rateLimit: GitHubRateLimit;
  isLoading: boolean;
  loginWithToken: (token: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshRateLimit: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [rateLimit, setRateLimit] = useState<GitHubRateLimit>({
    limit: 60,
    remaining: 60,
    reset: Math.floor(Date.now() / 1000) + 3600,
    used: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    try {
      const sess = await authService.initSession();
      setSession(sess);
      const rl = await githubApi.getRateLimit();
      setRateLimit(rl);
    } catch {
      setSession({
        mode: 'guest',
        user: FALLBACK_GAMESITEONLINE_USER,
        isOwnerOrCollaborator: false,
        canWrite: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithToken = async (token: string) => {
    setIsLoading(true);
    try {
      const sess = await authService.loginWithToken(token);
      setSession(sess);
      const rl = await githubApi.getRateLimit();
      setRateLimit(rl);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    try {
      const sess = await authService.loginAsGuest();
      setSession(sess);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setSession({
      mode: 'guest',
      user: FALLBACK_GAMESITEONLINE_USER,
      isOwnerOrCollaborator: false,
      canWrite: false,
    });
  };

  const refreshUser = async () => {
    if (session?.mode === 'authenticated') {
      try {
        const user = await githubApi.getAuthenticatedUser();
        setSession(prev => (prev ? { ...prev, user } : null));
      } catch {
        // ignore
      }
    }
  };

  const refreshRateLimit = async () => {
    try {
      const rl = await githubApi.getRateLimit();
      setRateLimit(rl);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        isAuthenticated: session?.mode === 'authenticated',
        isGuest: session?.mode === 'guest',
        canWrite: !!session?.canWrite,
        rateLimit,
        isLoading,
        loginWithToken,
        loginAsGuest,
        logout,
        refreshUser,
        refreshRateLimit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
