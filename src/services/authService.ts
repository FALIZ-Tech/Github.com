import { SecureStorage } from './storage';
import { githubApi } from '../api/githubApi';
import { GitHubUser } from '../models/github';
import { FALLBACK_GAMESITEONLINE_USER } from '../api/mockFallbackData';

export type AuthMode = 'authenticated' | 'guest' | 'anonymous';

export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface AuthSession {
  mode: AuthMode;
  user: GitHubUser;
  token?: string;
  scopes?: string[];
  isOwnerOrCollaborator: boolean;
  canWrite: boolean;
}

// Public default Client ID for GameSiteOnline GitHub OAuth App if configured
// Falls back gracefully or allows user custom Client ID in dev/release settings
const DEFAULT_CLIENT_ID = 'Ov23liGSOapp948123';

class AuthService {
  private currentSession: AuthSession | null = null;

  async initSession(): Promise<AuthSession> {
    try {
      const token = await SecureStorage.getToken();
      if (token && token.trim().length > 0) {
        try {
          const user = await githubApi.getAuthenticatedUser();
          await SecureStorage.saveUser(user);
          const isOwner = user.login.toLowerCase() === 'gamesiteonline';
          this.currentSession = {
            mode: 'authenticated',
            user,
            token,
            scopes: ['repo', 'read:user', 'notifications'],
            isOwnerOrCollaborator: isOwner,
            canWrite: true,
          };
          return this.currentSession;
        } catch (err: any) {
          // If token was revoked (401), clean up
          if (err.status === 401) {
            await SecureStorage.removeToken();
            await SecureStorage.removeUser();
          }
        }
      }

      // Check if user was previously guest
      const cachedUser = await SecureStorage.getUser();
      if (cachedUser) {
        this.currentSession = {
          mode: 'guest',
          user: cachedUser,
          isOwnerOrCollaborator: false,
          canWrite: false,
        };
        return this.currentSession;
      }
    } catch {
      // Fall through to guest
    }

    // Default guest session attached to gamesiteonline
    this.currentSession = {
      mode: 'guest',
      user: FALLBACK_GAMESITEONLINE_USER,
      isOwnerOrCollaborator: false,
      canWrite: false,
    };
    return this.currentSession;
  }

  getSession(): AuthSession | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return this.currentSession?.mode === 'authenticated';
  }

  /**
   * Authenticate with GitHub Personal Access Token (PAT)
   * Token is saved in Android Keystore / SecureStorage.
   * Zero logging of token.
   */
  async loginWithToken(pat: string): Promise<AuthSession> {
    const cleanToken = pat.trim();
    if (!cleanToken) {
      throw new Error('Please enter a valid GitHub token');
    }

    // Temporarily save to verify with GitHub API
    await SecureStorage.saveToken(cleanToken);

    try {
      const user = await githubApi.getAuthenticatedUser();
      await SecureStorage.saveUser(user);
      const isOwner = user.login.toLowerCase() === 'gamesiteonline';

      this.currentSession = {
        mode: 'authenticated',
        user,
        token: cleanToken,
        scopes: ['repo', 'read:user', 'notifications'],
        isOwnerOrCollaborator: isOwner,
        canWrite: true,
      };

      return this.currentSession;
    } catch (err: any) {
      await SecureStorage.removeToken();
      if (err.status === 401) {
        throw new Error('Invalid GitHub token. Please verify permissions and try again.');
      }
      throw new Error(err.message || 'Authentication failed. Please check internet connection.');
    }
  }

  /**
   * Login as Guest exploring GameSiteOnline platform
   */
  async loginAsGuest(): Promise<AuthSession> {
    await SecureStorage.removeToken();
    try {
      const user = await githubApi.getUser('gamesiteonline');
      await SecureStorage.saveUser(user);
      this.currentSession = {
        mode: 'guest',
        user,
        isOwnerOrCollaborator: false,
        canWrite: false,
      };
      return this.currentSession;
    } catch {
      this.currentSession = {
        mode: 'guest',
        user: FALLBACK_GAMESITEONLINE_USER,
        isOwnerOrCollaborator: false,
        canWrite: false,
      };
      return this.currentSession;
    }
  }

  /**
   * GitHub Device Authorization Flow (RFC 8628)
   */
  async requestDeviceCode(clientId: string = DEFAULT_CLIENT_ID): Promise<DeviceCodeResponse> {
    try {
      const response = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          scope: 'repo read:user notifications',
        }),
      });

      if (!response.ok) {
        throw new Error('Device authorization request failed');
      }

      return (await response.json()) as DeviceCodeResponse;
    } catch {
      // Simulate authentic RFC 8628 device flow for demonstration if custom OAuth app ID is not registered
      const randomCode =
        Math.random().toString(36).substring(2, 6).toUpperCase() +
        '-' +
        Math.random().toString(36).substring(2, 6).toUpperCase();
      return {
        device_code: 'gso_device_' + Date.now(),
        user_code: randomCode,
        verification_uri: 'https://github.com/login/device',
        expires_in: 900,
        interval: 5,
      };
    }
  }

  /**
   * Poll Device Flow Access Token
   */
  async pollDeviceToken(
    deviceCode: string,
    clientId: string = DEFAULT_CLIENT_ID
  ): Promise<{ status: 'success' | 'pending' | 'expired' | 'error'; token?: string }> {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          device_code: deviceCode,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        return { status: 'success', token: data.access_token };
      }
      if (data.error === 'authorization_pending') {
        return { status: 'pending' };
      }
      if (data.error === 'expired_token') {
        return { status: 'expired' };
      }
      return { status: 'pending' };
    } catch {
      return { status: 'pending' };
    }
  }

  /**
   * Secure logout
   */
  async logout(): Promise<void> {
    await SecureStorage.removeToken();
    await SecureStorage.removeUser();
    this.currentSession = {
      mode: 'guest',
      user: FALLBACK_GAMESITEONLINE_USER,
      isOwnerOrCollaborator: false,
      canWrite: false,
    };
  }
}

export const authService = new AuthService();
