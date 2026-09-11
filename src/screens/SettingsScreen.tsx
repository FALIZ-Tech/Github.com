import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SecureStorage } from '../services/storage';

interface SettingsScreenProps {
  onReplayIntro: () => void;
  onNavigateAbout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onReplayIntro,
  onNavigateAbout,
}) => {
  const { rateLimit, refreshRateLimit, isAuthenticated, logout } = useAuth();
  const { settings, updateSettings } = useApp();

  const [clearingCache, setClearingCache] = useState(false);

  const handleClearCache = async () => {
    setClearingCache(true);
    await SecureStorage.clearAllCache();
    setTimeout(() => {
      setClearingCache(false);
      Alert.alert('Cache Cleared', 'Local offline data and API response cache reset.');
    }, 600);
  };

  const resetTimeStr = new Date(rateLimit.reset * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="settings" size={22} color={Colors.neonCyan} />
        <Text style={styles.headerTitle}>Engine & Platform Settings</Text>
      </View>

      {/* GitHub Rate Limit Card */}
      <GlassCard variant="glow" style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="speedometer-outline" size={18} color={Colors.neonCyan} />
          <Text style={styles.cardTitle}>GitHub API Rate Limit Monitor</Text>
          <TouchableOpacity onPress={refreshRateLimit}>
            <Ionicons name="refresh" size={16} color={Colors.neonCyan} />
          </TouchableOpacity>
        </View>

        <View style={styles.quotaRow}>
          <Text style={styles.quotaBig}>
            {rateLimit.remaining} <Text style={styles.quotaSub}>/ {rateLimit.limit} reqs</Text>
          </Text>
          <View style={styles.tierPill}>
            <Text style={styles.tierPillText}>
              {isAuthenticated ? '5,000 / hr (Authenticated)' : '60 / hr (Public IP)'}
            </Text>
          </View>
        </View>

        <Text style={styles.resetText}>
          Quota window resets at <Text style={{ color: Colors.neonCyan }}>{resetTimeStr}</Text>
        </Text>
      </GlassCard>

      {/* UI & Performance Settings */}
      <GlassCard style={styles.card}>
        <Text style={styles.sectionHeader}>VISUAL EFFECTS & PERFORMANCE</Text>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Neon Particle System</Text>
            <Text style={styles.settingDesc}>
              Dynamic animated cyan light particles on background
            </Text>
          </View>
          <Switch
            value={settings.particles}
            onValueChange={val => updateSettings({ particles: val })}
            trackColor={{ false: '#334155', true: Colors.neonCyan }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Haptic & Touch Feedback</Text>
            <Text style={styles.settingDesc}>
              Micro-vibration on code copy and commits
            </Text>
          </View>
          <Switch
            value={settings.soundEffects}
            onValueChange={val => updateSettings({ soundEffects: val })}
            trackColor={{ false: '#334155', true: Colors.neonCyan }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Background Synchronization</Text>
            <Text style={styles.settingDesc}>
              Periodically check repository commits & notifications
            </Text>
          </View>
          <Switch
            value={settings.autoSync}
            onValueChange={val => updateSettings({ autoSync: val })}
            trackColor={{ false: '#334155', true: Colors.neonCyan }}
            thumbColor="#FFFFFF"
          />
        </View>
      </GlassCard>

      {/* Security & Storage */}
      <GlassCard style={styles.card}>
        <Text style={styles.sectionHeader}>SECURITY & CREDENTIALS</Text>

        <View style={styles.securityItem}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.neonGreen} />
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Android Keystore Protection</Text>
            <Text style={styles.securityDesc}>
              Hardware-backed AES-256 encryption active for session tokens.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={handleClearCache}>
          <Ionicons name="trash-outline" size={16} color={Colors.neonCyan} />
          <Text style={styles.actionBtnText}>
            {clearingCache ? 'Clearing...' : 'Clear Cached GitHub Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onReplayIntro}>
          <Ionicons name="play-outline" size={16} color={Colors.neonCyan} />
          <Text style={styles.actionBtnText}>Replay Cinematic Intro</Text>
        </TouchableOpacity>
      </GlassCard>

      {/* About Link */}
      <TouchableOpacity style={styles.aboutBtn} onPress={onNavigateAbout}>
        <Ionicons name="information-circle-outline" size={18} color={Colors.neonBlue} />
        <Text style={styles.aboutBtnText}>About GameSiteOnline & Release Docs</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </TouchableOpacity>

      {isAuthenticated && (
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={16} color={Colors.neonRose} />
          <Text style={styles.logoutBtnText}>Secure Logout & Revoke Session</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  card: {
    padding: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  quotaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  quotaBig: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.neonCyan,
  },
  quotaSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tierPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tierPillText: {
    fontSize: 10,
    color: Colors.neonBlue,
    fontWeight: '700',
  },
  resetText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  settingDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 240,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.neonGreen,
  },
  securityDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionBtnText: {
    fontSize: 12,
    color: Colors.neonCyan,
    fontWeight: '600',
  },
  aboutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 14,
  },
  aboutBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: Colors.neonRose,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  logoutBtnText: {
    fontSize: 12,
    color: Colors.neonRose,
    fontWeight: '700',
  },
});
