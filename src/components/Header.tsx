import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Logo } from './Logo';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { RateLimitBadge } from './RateLimitBadge';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onSearchPress?: () => void;
  onSettingsPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'GameSiteOnline',
  subtitle,
  showBack = false,
  onBack,
  onSearchPress,
  onSettingsPress,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.neonCyan} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.brandContainer}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <Logo size={32} glow={false} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : (
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      session?.mode === 'authenticated' ? Colors.neonGreen : Colors.neonCyan,
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {session?.mode === 'authenticated' ? `@${session.user.login}` : 'gamesiteonline hub'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.rightContainer}>
          <RateLimitBadge compact />
          {rightAction}
          {onSearchPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
              <Ionicons name="search" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          )}
          {onSettingsPress && !rightAction && (
            <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
              <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(7, 11, 20, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    marginRight: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
});
