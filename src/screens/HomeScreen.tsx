import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { Skeleton, RepoCardSkeleton } from '../components/SkeletonLoader';
import { Colors, LanguageColors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { githubApi } from '../api/githubApi';
import { GitHubRepo, GitHubEvent } from '../models/github';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigateRepo: (repo: GitHubRepo) => void;
  onNavigateTab: (tab: any) => void;
  onNavigateReleases: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateRepo,
  onNavigateTab,
  onNavigateReleases,
}) => {
  const { user, isGuest } = useAuth();
  const { isFavorite, toggleFavorite } = useApp();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredRepos, setFeaturedRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [totalStars, setTotalStars] = useState(240);

  const loadData = async () => {
    try {
      const username = user?.login || 'gamesiteonline';
      const [repos, userEvents] = await Promise.all([
        githubApi.getUserRepos(username, 1, 10, 'pushed'),
        githubApi.getUserEvents(username),
      ]);

      setFeaturedRepos(repos.slice(0, 4));
      setEvents(userEvents.slice(0, 5));

      const stars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      if (stars > 0) setTotalStars(stars + 160);
    } catch {
      // Handled by api fallbacks
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Language stats mock / derived
  const languageStats = [
    { name: 'TypeScript', percent: 48, color: LanguageColors.TypeScript },
    { name: 'Python', percent: 26, color: LanguageColors.Python },
    { name: 'JavaScript', percent: 16, color: LanguageColors.JavaScript },
    { name: 'HTML/CSS', percent: 10, color: LanguageColors.HTML },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.neonCyan}
          colors={[Colors.neonCyan]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Hero Card */}
      <GlassCard variant="glow" style={styles.profileCard}>
        {loading ? (
          <View style={styles.heroSkeleton}>
            <Skeleton width={64} height={64} borderRadius={32} />
            <Skeleton width="50%" height={20} style={{ marginTop: 12 }} />
            <Skeleton width="70%" height={14} style={{ marginTop: 6 }} />
          </View>
        ) : (
          <>
            <View style={styles.profileRow}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{
                    uri: user?.avatar_url || 'https://avatars.githubusercontent.com/u/269415120?v=4',
                  }}
                  style={styles.avatar}
                />
                <View style={styles.onlineBadge}>
                  <Ionicons name="sparkles" size={10} color="#070B14" />
                </View>
              </View>

              <View style={styles.profileMeta}>
                <View style={styles.titleBadgeRow}>
                  <Text style={styles.userNameText}>{user?.name || 'GameSiteOnline'}</Text>
                  <View style={styles.badgePro}>
                    <Text style={styles.badgeProText}>CORE</Text>
                  </View>
                </View>
                <Text style={styles.userLoginText}>@{user?.login || 'gamesiteonline'}</Text>

                {user?.location && (
                  <View style={styles.metaIconRow}>
                    <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                    <Text style={styles.metaSubText}>{user.location}</Text>
                  </View>
                )}
              </View>
            </View>

            {user?.bio && <Text style={styles.bioText}>{user.bio}</Text>}

            {/* Quick Stat Counters */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Ionicons name="folder-outline" size={16} color={Colors.neonCyan} />
                <Text style={styles.statNumber}>{user?.public_repos || 58}</Text>
                <Text style={styles.statLabel}>Repos</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="star-outline" size={16} color={Colors.neonAmber} />
                <Text style={styles.statNumber}>{totalStars}</Text>
                <Text style={styles.statLabel}>Stars</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="people-outline" size={16} color={Colors.neonBlue} />
                <Text style={styles.statNumber}>{user?.followers || 128}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="game-controller-outline" size={16} color={Colors.neonPurple} />
                <Text style={styles.statNumber}>30+</Text>
                <Text style={styles.statLabel}>Web Games</Text>
              </View>
            </View>
          </>
        )}
      </GlassCard>

      {/* Quick Launch Developer Bar */}
      <View style={styles.quickLaunchRow}>
        <TouchableOpacity
          style={styles.quickLaunchBtn}
          onPress={() => onNavigateTab('repos')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickLaunchIcon, { backgroundColor: 'rgba(0, 240, 255, 0.12)' }]}>
            <Ionicons name="albums-outline" size={18} color={Colors.neonCyan} />
          </View>
          <Text style={styles.quickLaunchText}>58 Repos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickLaunchBtn}
          onPress={onNavigateReleases}
          activeOpacity={0.7}
        >
          <View style={[styles.quickLaunchIcon, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
            <Ionicons name="cloud-download-outline" size={18} color={Colors.neonPurple} />
          </View>
          <Text style={styles.quickLaunchText}>Releases</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickLaunchBtn}
          onPress={() => onNavigateTab('activity')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickLaunchIcon, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
            <Ionicons name="pulse" size={18} color={Colors.neonGreen} />
          </View>
          <Text style={styles.quickLaunchText}>Live Stream</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickLaunchBtn}
          onPress={() => onNavigateTab('notifications')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickLaunchIcon, { backgroundColor: 'rgba(244, 63, 94, 0.12)' }]}>
            <Ionicons name="notifications-outline" size={18} color={Colors.neonRose} />
          </View>
          <Text style={styles.quickLaunchText}>Updates</Text>
        </TouchableOpacity>
      </View>

      {/* Repository Language Distribution */}
      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="pie-chart-outline" size={16} color={Colors.neonCyan} />
          <Text style={styles.sectionTitle}>Ecosystem Tech Stack</Text>
        </View>

        {/* Multi-segmented color bar */}
        <View style={styles.langBar}>
          {languageStats.map((l, i) => (
            <View
              key={i}
              style={{
                width: `${l.percent}%`,
                height: 8,
                backgroundColor: l.color,
                borderRadius: i === 0 ? 4 : i === languageStats.length - 1 ? 4 : 0,
              }}
            />
          ))}
        </View>

        <View style={styles.langChipsRow}>
          {languageStats.map((l, i) => (
            <View key={i} style={styles.langChip}>
              <View style={[styles.langDot, { backgroundColor: l.color }]} />
              <Text style={styles.langName}>{l.name}</Text>
              <Text style={styles.langPercent}>{l.percent}%</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Featured Game Repositories */}
      <View style={styles.sectionHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="flash" size={16} color={Colors.neonCyan} />
          <Text style={styles.sectionTitle}>Featured Game Engines</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigateTab('repos')}>
          <Text style={styles.viewAllText}>View All 58 →</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <>
          <RepoCardSkeleton />
          <RepoCardSkeleton />
        </>
      ) : (
        featuredRepos.map(repo => {
          const isFav = isFavorite(repo.id);
          const langColor = LanguageColors[repo.language || ''] || Colors.neonCyan;

          return (
            <GlassCard
              key={repo.id}
              variant="glow"
              style={styles.repoCard}
              onPress={() => onNavigateRepo(repo)}
            >
              <View style={styles.repoCardTop}>
                <View style={styles.repoNameCol}>
                  <View style={styles.repoTitleRow}>
                    <Ionicons name="game-controller" size={16} color={Colors.neonCyan} />
                    <Text style={styles.repoNameText}>{repo.name}</Text>
                  </View>
                  {repo.description && (
                    <Text style={styles.repoDescText} numberOfLines={2}>
                      {repo.description}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.favBtn}
                  onPress={() => toggleFavorite(repo.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isFav ? 'star' : 'star-outline'}
                    size={18}
                    color={isFav ? Colors.neonAmber : Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Topics Pills */}
              {repo.topics && repo.topics.length > 0 && (
                <View style={styles.topicsRow}>
                  {repo.topics.slice(0, 3).map((t, idx) => (
                    <View key={idx} style={styles.topicPill}>
                      <Text style={styles.topicText}>#{t}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Repo Stats Bar */}
              <View style={styles.repoMetaRow}>
                {repo.language && (
                  <View style={styles.repoMetaItem}>
                    <View style={[styles.langCircle, { backgroundColor: langColor }]} />
                    <Text style={styles.repoMetaText}>{repo.language}</Text>
                  </View>
                )}
                <View style={styles.repoMetaItem}>
                  <Ionicons name="star" size={12} color={Colors.neonAmber} />
                  <Text style={styles.repoMetaText}>{repo.stargazers_count}</Text>
                </View>
                <View style={styles.repoMetaItem}>
                  <Ionicons name="git-branch-outline" size={12} color={Colors.neonBlue} />
                  <Text style={styles.repoMetaText}>{repo.default_branch}</Text>
                </View>
                <View style={styles.repoMetaItem}>
                  <Ionicons name="git-network-outline" size={12} color={Colors.textMuted} />
                  <Text style={styles.repoMetaText}>{repo.forks_count}</Text>
                </View>
              </View>
            </GlassCard>
          );
        })
      )}

      {/* Recent Commit & Event Stream */}
      <GlassCard style={[styles.sectionCard, { marginTop: 16 }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="git-commit-outline" size={16} color={Colors.neonGreen} />
          <Text style={styles.sectionTitle}>Recent Git Activity</Text>
        </View>

        {events.length === 0 ? (
          <Text style={styles.emptyText}>No recent activity</Text>
        ) : (
          events.map((ev, i) => (
            <View key={ev.id || i} style={styles.eventRow}>
              <View style={styles.eventIconCircle}>
                <Ionicons
                  name={
                    ev.type === 'PushEvent'
                      ? 'git-commit'
                      : ev.type === 'ReleaseEvent'
                      ? 'rocket'
                      : 'star'
                  }
                  size={12}
                  color={Colors.neonCyan}
                />
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventRepoText}>
                  {ev.repo?.name?.split('/')[1] || ev.repo?.name}
                </Text>
                <Text style={styles.eventMsgText} numberOfLines={1}>
                  {ev.payload?.commits?.[0]?.message || `${ev.type.replace('Event', '')} event`}
                </Text>
              </View>
              <Text style={styles.eventTimeText}>
                {new Date(ev.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          ))
        )}
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
    paddingBottom: 30,
  },
  profileCard: {
    padding: 18,
    marginBottom: 16,
  },
  heroSkeleton: {
    padding: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: Colors.neonCyan,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.neonCyan,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#070B14',
  },
  profileMeta: {
    flex: 1,
    marginLeft: 14,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userNameText: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  badgePro: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1,
    borderColor: Colors.neonCyan,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  badgeProText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.neonCyan,
  },
  userLoginText: {
    fontSize: 12,
    color: Colors.neonBlue,
    fontWeight: '600',
    marginTop: 2,
  },
  metaIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaSubText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  bioText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quickLaunchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  quickLaunchBtn: {
    flex: 1,
    backgroundColor: 'rgba(13, 20, 36, 0.75)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLaunchIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLaunchText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  viewAllText: {
    fontSize: 12,
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  langBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  langChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  langDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  langName: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  langPercent: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  repoCard: {
    marginBottom: 12,
    padding: 14,
  },
  repoCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  repoNameCol: {
    flex: 1,
    marginRight: 8,
  },
  repoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  repoNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  repoDescText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  favBtn: {
    padding: 4,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 10,
  },
  topicPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 10,
    color: Colors.neonBlue,
    fontWeight: '600',
  },
  repoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  repoMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  langCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  repoMetaText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  eventIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  eventRepoText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.neonCyan,
  },
  eventMsgText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  eventTimeText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
