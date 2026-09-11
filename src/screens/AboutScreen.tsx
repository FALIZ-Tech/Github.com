import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Logo } from '../components/Logo';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../theme/colors';

export const AboutScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Hero */}
      <View style={styles.heroSection}>
        <Logo size={80} glow={true} />
        <Text style={styles.brandTitle}>GAMESITEONLINE</Text>
        <Text style={styles.brandTagline}>
          GitHub-Powered Gaming & Developer Platform
        </Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>Version 1.0.0 PRO • Package com.gamesiteonline.app</Text>
        </View>
      </View>

      {/* Connected Account Card */}
      <GlassCard variant="glow" style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="logo-github" size={20} color={Colors.neonCyan} />
          <Text style={styles.cardTitle}>Connected GitHub Hub</Text>
        </View>
        <Text style={styles.desc}>
          Directly linked to official game repositories and open source infrastructure hosted at:
        </Text>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => Linking.openURL('https://github.com/gamesiteonline')}
        >
          <Text style={styles.linkText}>github.com/gamesiteonline</Text>
          <Ionicons name="open-outline" size={14} color={Colors.neonCyan} />
        </TouchableOpacity>
      </GlassCard>

      {/* Security Architecture */}
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.neonGreen} />
          <Text style={styles.cardTitle}>Security & Credential Integrity</Text>
        </View>
        <View style={styles.checklist}>
          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.neonGreen} />
            <Text style={styles.checkText}>
              <Text style={styles.bold}>Zero embedded secrets:</Text> No Personal Access Tokens or API keys baked into the APK.
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.neonGreen} />
            <Text style={styles.checkText}>
              <Text style={styles.bold}>Android Keystore:</Text> Device authorization tokens are stored encrypted using hardware-backed SecureStore.
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.neonGreen} />
            <Text style={styles.checkText}>
              <Text style={styles.bold}>HTTPS enforcement:</Text> 100% of network traffic routed through secure TLS endpoints.
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.neonGreen} />
            <Text style={styles.checkText}>
              <Text style={styles.bold}>Least-privilege authorization:</Text> Read-only guest mode enabled by default; write permissions require explicit user approval.
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Android Release & Signing Instructions */}
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="build-outline" size={20} color={Colors.neonBlue} />
          <Text style={styles.cardTitle}>Android Release & Keystore Signing</Text>
        </View>
        <Text style={styles.desc}>
          To generate production release APK or AAB bundles using your private release keystore:
        </Text>
        <View style={styles.codeSnippet}>
          <Text style={styles.snippetText}>
            {`# 1. Generate release keystore:
keytool -genkey -v -keystore gamesiteonline-release.keystore \\
  -alias gamesiteonline-key -keyalg RSA -keysize 2048 -validity 10000

# 2. Build production Android APK / AAB:
eas build --platform android --profile production`}
          </Text>
        </View>
        <Text style={styles.securityWarning}>
          Notice: Never commit the signing keystore or passwords to public source control. Use environment variables / CI secrets (ANDROID_KEYSTORE_PASSWORD).
        </Text>
      </GlassCard>

      {/* Attribution & Third-Party Notices */}
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="library-outline" size={20} color={Colors.neonPurple} />
          <Text style={styles.cardTitle}>Attribution & Open Source Notices</Text>
        </View>
        <Text style={styles.legalText}>
          GameSiteOnline is powered by the official GitHub REST API v3 in accordance with the GitHub API Terms of Service.
        </Text>
        <Text style={[styles.legalText, { marginTop: 8 }]}>
          Built with React Native, Expo SDK 52+, Reanimated, Ionicons, and SecureStore. Copyright © 2026 GameSiteOnline. All rights reserved.
        </Text>
      </GlassCard>
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: 12,
  },
  brandTagline: {
    fontSize: 12,
    color: Colors.neonCyan,
    marginTop: 4,
    fontWeight: '600',
  },
  versionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 8,
  },
  versionText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  card: {
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  linkText: {
    fontSize: 12,
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  checklist: {
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  codeSnippet: {
    backgroundColor: '#0A0F1D',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  snippetText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#38BDF8',
    lineHeight: 15,
  },
  securityWarning: {
    fontSize: 10,
    color: Colors.neonAmber,
    fontStyle: 'italic',
    lineHeight: 15,
  },
  legalText: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
});
