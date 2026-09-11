import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecureStorage } from '../services/storage';
import { githubApi } from '../api/githubApi';

interface AppSettings {
  particles: boolean;
  soundEffects: boolean;
  autoSync: boolean;
}

interface AppContextType {
  favorites: number[];
  isFavorite: (repoId: number) => boolean;
  toggleFavorite: (repoId: number) => Promise<boolean>;
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  markAllNotificationsRead: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  hasSeenIntro: boolean;
  setHasSeenIntro: (val: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(2);
  const [settings, setSettings] = useState<AppSettings>({
    particles: true,
    soundEffects: true,
    autoSync: true,
  });
  const [hasSeenIntro, setHasSeenIntroState] = useState<boolean>(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [favs, sett, introDone] = await Promise.all([
        SecureStorage.getFavorites(),
        SecureStorage.getSettings(),
        SecureStorage.isIntroCompleted(),
      ]);
      setFavorites(favs);
      if (sett) setSettings(sett);
      setHasSeenIntroState(introDone);

      refreshUnreadCount();
    } catch {
      // ignore
    }
  };

  const refreshUnreadCount = async () => {
    try {
      const notifs = await githubApi.getNotifications(false);
      const unread = notifs.filter(n => n.unread).length;
      setUnreadCount(unread);
    } catch {
      setUnreadCount(2);
    }
  };

  const markAllNotificationsRead = () => {
    setUnreadCount(0);
  };

  const isFavorite = (repoId: number) => favorites.includes(repoId);

  const toggleFavorite = async (repoId: number): Promise<boolean> => {
    const isFav = await SecureStorage.toggleFavorite(repoId);
    const updated = await SecureStorage.getFavorites();
    setFavorites(updated);
    return isFav;
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await SecureStorage.saveSettings(updated);
  };

  const setHasSeenIntro = async (val: boolean) => {
    setHasSeenIntroState(val);
    await SecureStorage.setIntroCompleted(val);
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        unreadCount,
        refreshUnreadCount,
        markAllNotificationsRead,
        settings,
        updateSettings,
        hasSeenIntro,
        setHasSeenIntro,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
