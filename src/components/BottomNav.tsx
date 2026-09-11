import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export type TabType = 'home' | 'repos' | 'activity' | 'notifications' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabItem {
  key: TabType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useApp();

  const tabs: TabItem[] = [
    { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { key: 'repos', label: 'Repos', icon: 'folder-outline', activeIcon: 'folder' },
    { key: 'activity', label: 'Activity', icon: 'pulse-outline', activeIcon: 'pulse' },
    {
      key: 'notifications',
      label: 'Inbox',
      icon: 'notifications-outline',
      activeIcon: 'notifications',
      badge: unreadCount,
    },
    { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.navBar}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.activeGlow} />}
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={21}
                  color={isActive ? Colors.neonCyan : Colors.textMuted}
                />
                {tab.badge && tab.badge > 0 ? (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(7, 11, 20, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  navBar: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    position: 'relative',
  },
  activeGlow: {
    position: 'absolute',
    top: 2,
    width: 32,
    height: 3,
    backgroundColor: Colors.neonCyan,
    borderRadius: 2,
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 24,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: Colors.textMuted,
    fontWeight: '500',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.neonRose,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#070B14',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
