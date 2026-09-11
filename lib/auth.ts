import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'gs_secure_github_token';
const USER_KEY = 'gs_user_cache';
const FIRST_LAUNCH_KEY = 'gs_first_launch';

export const AuthService = {
  async saveToken(token: string): Promise<void> {
    if (!token || token.length < 10) throw new Error('Invalid token');
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
      keychainService: 'gamesiteonline-github',
      sharedPreferencesName: 'gamesiteonline-secure',
    });
    await AsyncStorage.setItem('gs_token_meta', JSON.stringify({ savedAt: Date.now(), expiresAt: Date.now() + 1000*60*60*24*30 }));
  },
  async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return token;
    } catch {
      return null;
    }
  },
  async hasToken(): Promise<boolean> {
    const t = await this.getToken();
    return !!t && !t.startsWith('__demo');
  },
  async hasAnySession(): Promise<boolean> {
    const t = await this.getToken();
    return !!t;
  },
  async isDemo(): Promise<boolean> {
    const t = await this.getToken();
    return !!t && t.startsWith('__demo');
  },
  async logout(): Promise<void> {
    try { await SecureStore.deleteItemAsync(TOKEN_KEY); } catch {}
    try { await AsyncStorage.removeItem(USER_KEY); } catch {}
    try { await AsyncStorage.removeItem('gs_token_meta'); } catch {}
    try { await AsyncStorage.removeItem('gs_favorites'); } catch {}
    try { await AsyncStorage.removeItem('gs_cache_repos'); } catch {}
  },
  async getUserCache(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async setUserCache(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  async isFirstLaunch(): Promise<boolean> {
    const v = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    return v === null;
  },
  async setFirstLaunchDone(): Promise<void> {
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
  },
  async getTokenMeta(): Promise<any | null> {
    const raw = await AsyncStorage.getItem('gs_token_meta');
    return raw ? JSON.parse(raw) : null;
  }
};
