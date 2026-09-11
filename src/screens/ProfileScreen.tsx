import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface ProfileScreenProps {
  onNavigateSettings: () => void;
  onNavigateAbout: () => void;
  onOpenAuth: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateSettings,
  onNavigateAbout,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useApp();

  const achievements = [
    {
      title: 'Retro Architect',
      desc: 'Built WebAssembly MS-DOS emulation engine',
      icon: 'game-controller' as const,
      color: Colors.neonCyan,
    },
    {
      title: '58+ Open Repositories',
      desc: 'Pioneered browser games & developer tools',
      icon: 'git-branch' as const,
      color: Colors.neonGreen,
    },
    {
      title: 'Cyberpunk Shader Dev',
      desc: 'Dynamic neon glow & Three.js 3D pipeline',
      icon: 'sparkles' as const,
      color: Colors.neonPurple,
    },
    {
      title: 'GitHub Core Creator',
      desc: 'Official platform connection & automation',
      icon: 'logo-github' as const,
      color: Colors.neonAmber,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <GlassCard variant="glow" style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <Image
            source={{
              uri: user?.avatar_url || 'https://avatars.githubusercontent.com/u/269415120?v=4',
            }}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.displayName}>{user?.name || 'GameSiteOnline'}</Text>
            <Text style={styles.handle}>@{user?.login || 'gamesiteonline'}</Text>
            <View style={styles.badgePill}>
              <Ionicons
                name={isAuthenticated ? 'shield-checkmark' : 'globe-outline'}
                size={11}
                color={isAuthenticated ? Colors.neonGreen : Colors.neonCyan}
              />
              <Text style={styles.badgeText}>
                {isAuthenticated ? 'Authenticated Dev' : 'Platform Profile'}
              </Text>
            </View>
          </View>
        </View>

        {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}

        {/* External portal link */}
        <TouchableOpacity
          style={styles.linkBox}
          onPress={() => Linking.openURL('https://gamesiteonline1.pythonanywhere.com')}
        >
          <Ionicons name="link-outline" size={14} color={Colors.neonCyan} />
          <Text style={styles.linkText} numberOfLines={1}>
            gamesiteonline1.pythonanywhere.com
          </Text>
          <Ionicons name="open-outline" size={12} color={Colors.neonCyan} />
        </TouchableOpacity>

        {/* Metrics Grid */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{user?.public_repos || 58}</Text>
            <Text style={styles.metricLabel}>Repositories</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{favorites.length}</Text>
            <Text style={styles.metricLabel}>Favorites</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{user?.followers || 128}</Text>
            <Text style={styles.metricLabel}>Followers</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{user?.following || 16}</Text>
            <Text style={styles.metricLabel}>Following</Text>
          </View>
        </View>
      </GlassCard>

      {/* Developer Badges */}
      <View style={styles.sectionHeader}>
        <Ionicons name="ribbon-outline" size={16} color={Colors.neonCyan} />
        <Text style={styles.sectionTitle}>Developer Achievements</Text>
      </View>

      <View style={styles.achievementsList}>
        {achievements.map((a, i) => (
          <GlassCard key={i} style={styles.achievementCard}>
            <View style={[styles.achieveIcon, { backgroundColor: `${a.color}18` }]}>
              <Ionicons name={a.icon} size={18} color={a.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.achieveTitle}>{a.title}</Text>
              <Text style={styles.achieveDesc}>{a.desc}</Text>
            </View>
          </GlassCard>
        ))}
      </View>

      {/* Navigation Quick Links */}
      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuRow} onPress={onNavigateSettings}>
          <Ionicons name="settings-outline" size={18} color={Colors.neonCyan} />
          <Text style={styles.menuLabel}>Platform & Engine Settings</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={onNavigateAbout}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.neonBlue} />
          <Text style={styles.menuLabel}>About GameSiteOnline</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
        </TouchableOpacity>

        {!isAuthenticated ? (
          <TouchableOpacity style={styles.menuRow} onPress={onOpenAuth}>
            <Ionicons name="key-outline" size={18} color={Colors.neonGreen} />
            <Text style={styles.menuLabel}>Authenticate GitHub Account</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.menuRow} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color={Colors.neonRose} />
            <Text style={[styles.menuLabel, { color: Colors.neonRose }]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.neonRose} />
          </TouchableOpacity>
        )}
      </View>
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
  profileCard: {
    padding: 18,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.neonCyan,
  },
  headerInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  handle: {
    fontSize: 12,
    color: Colors.neonCyan,
    marginTop: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  badgeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  bio: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginTop: 12,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 12,
  },
  linkText: {
    fontSize: 11,
    color: Colors.neonCyan,
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  achievementsList: {
    gap: 10,
    marginBottom: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  achieveIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achieveTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  achieveDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
});
