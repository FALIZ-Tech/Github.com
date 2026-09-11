import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'gso_gh_auth_token';
const USER_KEY = 'gso_gh_user_data';
const FAVORITES_KEY = 'gso_favorites_v1';
const INTRO_SHOWN_KEY = 'gso_intro_completed';
const SETTINGS_KEY = 'gso_app_settings';
const CACHE_PREFIX = 'gso_cache_';

// Check if SecureStore is available
const isSecureStoreAvailable = Platform.OS !== 'web';

export const SecureStorage = {
  /**
   * Save auth token to Android Keystore / iOS Keychain (SecureStore)
   * Never logged or exposed.
   */
  async saveToken(token: string): Promise<void> {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(TOKEN_KEY, token, {
          keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
        });
      } else {
        await AsyncStorage.setItem(TOKEN_KEY, token);
      }
    } catch (e) {
      // Fallback
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Retrieve auth token securely
   */
  async getToken(): Promise<string | null> {
    try {
      if (isSecureStoreAvailable) {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) return token;
      }
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  },

  /**
   * Securely remove token upon logout
   */
  async removeToken(): Promise<void> {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch {
      // ignore
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Save user session data
   */
  async saveUser(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  // Starred / Favorites locally
  async getFavorites(): Promise<number[]> {
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async toggleFavorite(repoId: number): Promise<boolean> {
    const favs = await this.getFavorites();
    const index = favs.indexOf(repoId);
    let updated: number[];
    let isFav = false;
    if (index >= 0) {
      updated = favs.filter(id => id !== repoId);
      isFav = false;
    } else {
      updated = [...favs, repoId];
      isFav = true;
    }
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return isFav;
  },

  // Intro completed flag
  async isIntroCompleted(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(INTRO_SHOWN_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setIntroCompleted(completed: boolean): Promise<void> {
    await AsyncStorage.setItem(INTRO_SHOWN_KEY, completed ? 'true' : 'false');
  },

  // App settings
  async getSettings(): Promise<{ particles: boolean; soundEffects: boolean; autoSync: boolean }> {
    try {
      const val = await AsyncStorage.getItem(SETTINGS_KEY);
      return val ? JSON.parse(val) : { particles: true, soundEffects: true, autoSync: true };
    } catch {
      return { particles: true, soundEffects: true, autoSync: true };
    }
  },

  async saveSettings(settings: any): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // Cache safe response data with TTL
  async setCache(key: string, data: any, ttlMinutes = 15): Promise<void> {
    try {
      const record = {
        data,
        expiresAt: Date.now() + ttlMinutes * 60 * 1000,
      };
      await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(record));
    } catch {
      // cache failure silent
    }
  },

  async getCache<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const record = JSON.parse(raw);
      if (Date.now() > record.expiresAt) {
        await AsyncStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return record.data as T;
    } catch {
      return null;
    }
  },

  async clearAllCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch {
      // ignore
    }
  },
};
