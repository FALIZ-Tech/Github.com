import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../theme/colors';
import { githubApi } from '../api/githubApi';
import { GitHubEvent } from '../models/github';

export const ActivityScreen: React.FC = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await githubApi.getUserEvents('gamesiteonline');
      setEvents(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const getEventMeta = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        return {
          icon: 'git-commit' as const,
          color: Colors.neonGreen,
          action: 'pushed to',
          detail: event.payload?.commits?.[0]?.message || 'Pushed commit to repository',
        };
      case 'ReleaseEvent':
        return {
          icon: 'rocket' as const,
          color: Colors.neonPurple,
          action: 'published release',
          detail: event.payload?.release?.name || 'New version published',
        };
      case 'CreateEvent':
        return {
          icon: 'git-branch' as const,
          color: Colors.neonCyan,
          action: `created ${event.payload?.ref_type || 'branch'}`,
          detail: event.payload?.ref || 'main',
        };
      case 'WatchEvent':
        return {
          icon: 'star' as const,
          color: Colors.neonAmber,
          action: 'starred',
          detail: event.repo.name,
        };
      default:
        return {
          icon: 'pulse' as const,
          color: Colors.neonBlue,
          action: 'interacted with',
          detail: event.repo.name,
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Ionicons name="pulse" size={18} color={Colors.neonCyan} />
        <Text style={styles.headerTitle}>Live Activity Stream</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.neonCyan} style={{ padding: 40 }} />
      ) : (
        <FlatList
          data={events}
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
          renderItem={({ item }) => {
            const meta = getEventMeta(item);
            return (
              <GlassCard style={styles.card}>
                <View style={styles.row}>
                  <View style={[styles.iconCircle, { backgroundColor: `${meta.color}20` }]}>
                    <Ionicons name={meta.icon} size={16} color={meta.color} />
                  </View>

                  <View style={styles.infoCol}>
                    <View style={styles.actorRow}>
                      <Text style={styles.actorName}>@{item.actor.login}</Text>
                      <Text style={styles.actionText}>{meta.action}</Text>
                      <Text style={styles.repoName} numberOfLines={1}>
                        {item.repo.name.split('/')[1] || item.repo.name}
                      </Text>
                    </View>

                    <Text style={styles.detailText} numberOfLines={2}>
                      {meta.detail}
                    </Text>

                    <Text style={styles.timeText}>
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            );
          }}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  actorName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.neonCyan,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  repoName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  detailText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  timeText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 6,
  },
});
