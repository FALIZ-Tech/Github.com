import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { githubApi } from '../api/githubApi';
import { GitHubNotification } from '../models/github';

export const NotificationsScreen: React.FC = () => {
  const { markAllNotificationsRead } = useApp();

  const [notifications, setNotifications] = useState<GitHubNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  const loadNotifications = async () => {
    try {
      const list = await githubApi.getNotifications(filter === 'all');
      setNotifications(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
    githubApi.markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    markAllNotificationsRead();
  };

  const getSubjectIcon = (type: string) => {
    switch (type) {
      case 'Issue':
        return 'alert-circle-outline';
      case 'PullRequest':
        return 'git-pull-request-outline';
      case 'Commit':
        return 'git-commit-outline';
      case 'Release':
        return 'cloud-download-outline';
      default:
        return 'notifications-outline';
    }
  };

  const displayedList = filter === 'unread' ? notifications.filter(n => n.unread) : notifications;

  return (
    <View style={styles.container}>
      {/* Top Filter Bar */}
      <View style={styles.topBar}>
        <View style={styles.filterGroup}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'unread' && styles.filterChipActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
              Unread
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All Notifications
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
          <Ionicons name="checkmark-done-outline" size={14} color={Colors.neonCyan} />
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.neonCyan} style={{ padding: 40 }} />
      ) : (
        <FlatList
          data={displayedList}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.neonCyan}
              colors={[Colors.neonCyan]}
            />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <GlassCard
              style={[styles.card, item.unread && styles.cardUnread]}
              onPress={() => handleMarkAsRead(item.id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.subjectRow}>
                  <Ionicons
                    name={getSubjectIcon(item.subject.type)}
                    size={16}
                    color={item.unread ? Colors.neonCyan : Colors.textMuted}
                  />
                  <Text style={styles.repoName}>{item.repository.full_name}</Text>
                </View>
                {item.unread && <View style={styles.unreadDot} />}
              </View>

              <Text
                style={[styles.subjectTitle, item.unread && styles.subjectTitleUnread]}
                numberOfLines={2}
              >
                {item.subject.title}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{item.subject.type}</Text>
                </View>
                <Text style={styles.dateText}>
                  {new Date(item.updated_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </GlassCard>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open-outline" size={44} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>All Caught Up</Text>
              <Text style={styles.emptyDesc}>No unread GitHub notifications at this moment.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  filterChipActive: {
    backgroundColor: Colors.neonCyan,
    borderColor: Colors.neonCyan,
  },
  filterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#070B14',
    fontWeight: '800',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markAllText: {
    fontSize: 11,
    color: Colors.neonCyan,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    padding: 14,
    marginBottom: 10,
  },
  cardUnread: {
    borderColor: 'rgba(0, 240, 255, 0.35)',
    backgroundColor: 'rgba(13, 25, 48, 0.88)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repoName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.neonBlue,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neonCyan,
  },
  subjectTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  subjectTitleUnread: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
