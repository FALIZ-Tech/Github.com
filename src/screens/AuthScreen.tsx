import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Logo } from '../components/Logo';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { authService, DeviceCodeResponse } from '../services/authService';

interface AuthScreenProps {
  onSuccess: () => void;
  onSkipToGuest: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onSkipToGuest }) => {
  const { loginWithToken, loginAsGuest, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'device' | 'token' | 'guest'>('device');
  const [patInput, setPatInput] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Device flow state
  const [deviceData, setDeviceData] = useState<DeviceCodeResponse | null>(null);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    if (activeTab === 'device' && !deviceData && !deviceLoading) {
      startDeviceFlow();
    }
  }, [activeTab]);

  const startDeviceFlow = async () => {
    setDeviceLoading(true);
    setErrorMessage(null);
    try {
      const resp = await authService.requestDeviceCode();
      setDeviceData(resp);
      pollForToken(resp.device_code);
    } catch (err: any) {
      setErrorMessage('Could not initiate GitHub Device Authorization.');
    } finally {
      setDeviceLoading(false);
    }
  };

  const pollForToken = async (deviceCode: string) => {
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        setIsPolling(false);
        return;
      }

      try {
        const result = await authService.pollDeviceToken(deviceCode);
        if (result.status === 'success' && result.token) {
          clearInterval(interval);
          setIsPolling(false);
          await loginWithToken(result.token);
          onSuccess();
        } else if (result.status === 'expired') {
          clearInterval(interval);
          setIsPolling(false);
          setErrorMessage('Device code expired. Please request a new code.');
        }
      } catch {
        // continue polling
      }
    }, 5000);
  };

  const handleCopyCodeAndOpen = async () => {
    if (!deviceData) return;
    await Clipboard.setStringAsync(deviceData.user_code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 3000);
    Linking.openURL(deviceData.verification_uri);
  };

  const handleTokenSubmit = async () => {
    if (!patInput.trim()) {
      setErrorMessage('Please enter a GitHub Personal Access Token');
      return;
    }
    setTokenLoading(true);
    setErrorMessage(null);
    try {
      await loginWithToken(patInput.trim());
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed');
    } finally {
      setTokenLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    setTokenLoading(true);
    try {
      await loginAsGuest();
      onSkipToGuest();
    } finally {
      setTokenLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Brand Header */}
      <View style={styles.header}>
        <Logo size={72} glow={true} />
        <Text style={styles.appName}>GameSiteOnline</Text>
        <Text style={styles.tagline}>Developer & Gaming Platform Connection</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'device' && styles.tabItemActive]}
          onPress={() => {
            setActiveTab('device');
            setErrorMessage(null);
          }}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={14}
            color={activeTab === 'device' ? Colors.neonCyan : Colors.textMuted}
          />
          <Text
            style={[styles.tabItemText, activeTab === 'device' && styles.tabItemTextActive]}
          >
            Device Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'token' && styles.tabItemActive]}
          onPress={() => {
            setActiveTab('token');
            setErrorMessage(null);
          }}
        >
          <Ionicons
            name="key-outline"
            size={14}
            color={activeTab === 'token' ? Colors.neonCyan : Colors.textMuted}
          />
          <Text
            style={[styles.tabItemText, activeTab === 'token' && styles.tabItemTextActive]}
          >
            Personal Token
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'guest' && styles.tabItemActive]}
          onPress={() => {
            setActiveTab('guest');
            setErrorMessage(null);
          }}
        >
          <Ionicons
            name="globe-outline"
            size={14}
            color={activeTab === 'guest' ? Colors.neonCyan : Colors.textMuted}
          />
          <Text
            style={[styles.tabItemText, activeTab === 'guest' && styles.tabItemTextActive]}
          >
            Guest Explorer
          </Text>
        </TouchableOpacity>
      </View>

      {errorMessage && (
        <View style={styles.errorAlert}>
          <Ionicons name="alert-circle" size={16} color={Colors.neonRose} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* TAB 1: DEVICE FLOW */}
      {activeTab === 'device' && (
        <GlassCard variant="glow" style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.neonCyan} />
            <Text style={styles.cardTitle}>Official GitHub Device Flow</Text>
          </View>
          <Text style={styles.cardDesc}>
            Authorize securely using GitHub's RFC 8628 device flow. Your credentials stay on GitHub.
          </Text>

          {deviceLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={Colors.neonCyan} />
              <Text style={styles.loadingText}>Generating secure device key...</Text>
            </View>
          ) : deviceData ? (
            <View style={styles.codeDisplayBox}>
              <Text style={styles.codeLabel}>YOUR ONE-TIME DEVICE CODE</Text>
              <View style={styles.codeHighlight}>
                <Text style={styles.codeText}>{deviceData.user_code}</Text>
              </View>

              <TouchableOpacity
                style={styles.copyOpenBtn}
                onPress={handleCopyCodeAndOpen}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={codeCopied ? 'checkmark' : 'open-outline'}
                  size={16}
                  color="#070B14"
                />
                <Text style={styles.copyOpenBtnText}>
                  {codeCopied ? 'Code Copied! Opening GitHub...' : 'Copy Code & Authorize on GitHub'}
                </Text>
              </TouchableOpacity>

              <View style={styles.pollingStatus}>
                <ActivityIndicator size="small" color={Colors.neonCyan} />
                <Text style={styles.pollingText}>
                  Listening for GitHub authorization response...
                </Text>
              </View>
            </View>
          ) : (
            <NeonButton
              title="Request New Device Code"
              onPress={startDeviceFlow}
              variant="outline"
              size="md"
            />
          )}

          <View style={styles.securityNote}>
            <Ionicons name="lock-closed-outline" size={12} color={Colors.neonGreen} />
            <Text style={styles.securityNoteText}>
              Stored in Android Keystore / Hardware-backed SecureStore
            </Text>
          </View>
        </GlassCard>
      )}

      {/* TAB 2: PERSONAL ACCESS TOKEN */}
      {activeTab === 'token' && (
        <GlassCard variant="glow" style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="terminal-outline" size={20} color={Colors.neonCyan} />
            <Text style={styles.cardTitle}>Personal Access Token (PAT)</Text>
          </View>
          <Text style={styles.cardDesc}>
            Connect with a classic or fine-grained GitHub token. Token will be securely encrypted in Android Keystore.
          </Text>

          <View style={styles.scopeBox}>
            <Text style={styles.scopeTitle}>Recommended Least-Privilege Scopes:</Text>
            <View style={styles.scopeTags}>
              <View style={styles.scopeTag}><Text style={styles.scopeTagText}>repo</Text></View>
              <View style={styles.scopeTag}><Text style={styles.scopeTagText}>read:user</Text></View>
              <View style={styles.scopeTag}><Text style={styles.scopeTagText}>notifications</Text></View>
            </View>
          </View>

          <Text style={styles.inputLabel}>GitHub Personal Access Token</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="key" size={16} color={Colors.neonCyan} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.tokenInput}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              placeholderTextColor={Colors.textMuted}
              value={patInput}
              onChangeText={setPatInput}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <NeonButton
            title="Authenticate & Encrypt Token"
            onPress={handleTokenSubmit}
            loading={tokenLoading}
            variant="primary"
            size="lg"
            icon="shield-checkmark"
            style={{ marginTop: 16 }}
          />

          <TouchableOpacity
            style={styles.patLinkBtn}
            onPress={() => Linking.openURL('https://github.com/settings/tokens/new')}
          >
            <Ionicons name="open-outline" size={12} color={Colors.neonBlue} />
            <Text style={styles.patLinkText}>Generate new token on GitHub.com</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* TAB 3: GUEST EXPLORER */}
      {activeTab === 'guest' && (
        <GlassCard variant="accent" style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={20} color={Colors.neonCyan} />
            <Text style={styles.cardTitle}>Explore gamesiteonline Hub</Text>
          </View>
          <Text style={styles.cardDesc}>
            Instantly browse all 58+ repositories, commit logs, releases, and gamesiteonline projects without providing credentials.
          </Text>

          <View style={styles.guestFeatureList}>
            <View style={styles.guestFeatureRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.neonGreen} />
              <Text style={styles.guestFeatureText}>Browse 58+ game and engine repositories</Text>
            </View>
            <View style={styles.guestFeatureRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.neonGreen} />
              <Text style={styles.guestFeatureText}>Full source-code viewing & syntax highlights</Text>
            </View>
            <View style={styles.guestFeatureRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.neonGreen} />
              <Text style={styles.guestFeatureText}>Download release APKs and game assets</Text>
            </View>
            <View style={styles.guestFeatureRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.neonGreen} />
              <Text style={styles.guestFeatureText}>Simulate commits & code editor diffs</Text>
            </View>
          </View>

          <NeonButton
            title="Launch As Guest Explorer"
            onPress={handleGuestEntry}
            loading={tokenLoading}
            variant="primary"
            size="lg"
            icon="rocket-outline"
            style={{ marginTop: 18 }}
          />
        </GlassCard>
      )}

      {/* Security notice footer */}
      <View style={styles.footerSecurity}>
        <Ionicons name="shield-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.footerSecurityText}>
          Production Security Standard: Zero tokens embedded in APK. HTTPS only. Android Keystore hardware-backed encryption.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: 14,
  },
  tagline: {
    fontSize: 12,
    color: Colors.neonCyan,
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  tabItemText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  tabItemTextActive: {
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  card: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: Colors.neonRose,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: Colors.neonRose,
    fontSize: 12,
    flex: 1,
    fontWeight: '600',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.neonCyan,
  },
  codeDisplayBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    marginVertical: 10,
  },
  codeLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  codeHighlight: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: Colors.neonCyan,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 14,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: '900',
    color: Colors.neonCyan,
    letterSpacing: 4,
  },
  copyOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neonCyan,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    gap: 8,
    width: '100%',
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  copyOpenBtnText: {
    color: '#070B14',
    fontSize: 12,
    fontWeight: '800',
  },
  pollingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  pollingText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  securityNoteText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  scopeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  scopeTitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  scopeTags: {
    flexDirection: 'row',
    gap: 6,
  },
  scopeTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 0.5,
    borderColor: Colors.neonBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scopeTagText: {
    fontSize: 10,
    color: Colors.neonBlue,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tokenInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    padding: 0,
  },
  patLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 6,
  },
  patLinkText: {
    fontSize: 11,
    color: Colors.neonBlue,
    fontWeight: '600',
  },
  guestFeatureList: {
    gap: 10,
    marginVertical: 12,
  },
  guestFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestFeatureText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footerSecurity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 8,
    gap: 8,
  },
  footerSecurityText: {
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 15,
    flex: 1,
  },
});
