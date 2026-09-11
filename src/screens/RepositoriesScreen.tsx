import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { RepoCardSkeleton } from '../components/SkeletonLoader';
import { Colors, LanguageColors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { githubApi } from '../api/githubApi';
import { GitHubRepo } from '../models/github';

interface RepositoriesScreenProps {
  onSelectRepo: (repo: GitHubRepo) => void;
}

export const RepositoriesScreen: React.FC<RepositoriesScreenProps> = ({ onSelectRepo }) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, favorites } = useApp();

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'TypeScript' | 'JavaScript' | 'Python' | 'Games' | 'favs'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name' | 'forks'>('updated');
  const [showSortModal, setShowSortModal] = useState(false);

  const loadRepos = async () => {
    try {
      const username = user?.login || 'gamesiteonline';
      const fetched = await githubApi.getUserRepos(username, 1, 50, 'updated');
      setRepos(fetched);
    } catch {
      // handled
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRepos();
  };

  // Filter & Sort logic
  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // Filter by query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.language && r.language.toLowerCase().includes(q)) ||
          (r.topics && r.topics.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Filter by category
    if (activeFilter === 'TypeScript') {
      result = result.filter(r => r.language === 'TypeScript');
    } else if (activeFilter === 'JavaScript') {
      result = result.filter(r => r.language === 'JavaScript');
    } else if (activeFilter === 'Python') {
      result = result.filter(r => r.language === 'Python');
    } else if (activeFilter === 'Games') {
      result = result.filter(
        r =>
          r.name.toLowerCase().includes('game') ||
          (r.description && r.description.toLowerCase().includes('game')) ||
          (r.topics && r.topics.some(t => t.includes('game') || t.includes('arcade')))
      );
    } else if (activeFilter === 'favs') {
      result = result.filter(r => favorites.includes(r.id));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'stars') return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      if (sortBy === 'forks') return (b.forks_count || 0) - (a.forks_count || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return result;
  }, [repos, searchQuery, activeFilter, sortBy, favorites]);

  const renderFilterChip = (
    key: 'all' | 'TypeScript' | 'JavaScript' | 'Python' | 'Games' | 'favs',
    label: string,
    icon?: keyof typeof Ionicons.glyphMap
  ) => {
    const isActive = activeFilter === key;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.filterChip, isActive && styles.filterChipActive]}
        onPress={() => setActiveFilter(key)}
        activeOpacity={0.7}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={12}
            color={isActive ? '#070B14' : Colors.textSecondary}
          />
        )}
        <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: GitHubRepo }) => {
    const isFav = isFavorite(item.id);
    const langColor = LanguageColors[item.language || ''] || Colors.neonCyan;

    return (
      <GlassCard
        variant="glow"
        style={styles.card}
        onPress={() => onSelectRepo(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleCol}>
            <View style={styles.nameRow}>
              <Ionicons
                name={item.private ? 'lock-closed' : 'git-branch'}
                size={14}
                color={Colors.neonCyan}
              />
              <Text style={styles.repoName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.visibilityBadge}>
                <Text style={styles.visibilityText}>
                  {item.private ? 'Private' : 'Public'}
                </Text>
              </View>
            </View>

            {item.description && (
              <Text style={styles.repoDesc} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.starBtn}
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFav ? 'star' : 'star-outline'}
              size={18}
              color={isFav ? Colors.neonAmber : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Topics */}
        {item.topics && item.topics.length > 0 && (
          <View style={styles.topicsRow}>
            {item.topics.slice(0, 3).map((topic, idx) => (
              <View key={idx} style={styles.topicBadge}>
                <Text style={styles.topicText}>#{topic}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          {item.language && (
            <View style={styles.footerItem}>
              <View style={[styles.langDot, { backgroundColor: langColor }]} />
              <Text style={styles.footerText}>{item.language}</Text>
            </View>
          )}

          <View style={styles.footerItem}>
            <Ionicons name="star-outline" size={12} color={Colors.neonAmber} />
            <Text style={styles.footerText}>{item.stargazers_count}</Text>
          </View>

          <View style={styles.footerItem}>
            <Ionicons name="git-network-outline" size={12} color={Colors.neonBlue} />
            <Text style={styles.footerText}>{item.forks_count}</Text>
          </View>

          <View style={styles.footerItem}>
            <Ionicons name="alert-circle-outline" size={12} color={Colors.neonRose} />
            <Text style={styles.footerText}>{item.open_issues_count}</Text>
          </View>

          <Text style={styles.updatedText}>
            Updated {new Date(item.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Text>
        </View>
      </GlassCard>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search & Sort Controls */}
      <View style={styles.topControlSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.neonCyan} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search repositories, games, topics..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Trigger */}
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => {
            const nextSort =
              sortBy === 'updated' ? 'stars' : sortBy === 'stars' ? 'forks' : sortBy === 'forks' ? 'name' : 'updated';
            setSortBy(nextSort);
          }}
        >
          <Ionicons name="funnel-outline" size={14} color={Colors.neonCyan} />
          <Text style={styles.sortBtnText}>Sort: {sortBy.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips Scroll */}
      <View style={styles.filterScroll}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { key: 'all', label: `All (${repos.length})` },
            { key: 'Games', label: 'Games', icon: 'game-controller-outline' as const },
            { key: 'TypeScript', label: 'TypeScript' },
            { key: 'JavaScript', label: 'JavaScript' },
            { key: 'Python', label: 'Python' },
            { key: 'favs', label: `Starred (${favorites.length})`, icon: 'star' as const },
          ]}
          keyExtractor={item => item.key}
          renderItem={({ item }) => renderFilterChip(item.key as any, item.label, item.icon)}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </View>

      {/* Repositories List */}
      {loading ? (
        <View style={{ padding: 16 }}>
          <RepoCardSkeleton />
          <RepoCardSkeleton />
          <RepoCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={filteredRepos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.neonCyan}
              colors={[Colors.neonCyan]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={44} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Repositories Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search query or category filters.
              </Text>
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
  topControlSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    padding: 0,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  sortBtnText: {
    fontSize: 11,
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  filterScroll: {
    paddingVertical: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: Colors.neonCyan,
    borderColor: Colors.neonCyan,
  },
  filterChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#070B14',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 30,
  },
  card: {
    marginBottom: 12,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  repoName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  visibilityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  visibilityText: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  repoDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  starBtn: {
    padding: 4,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  topicBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  topicText: {
    fontSize: 10,
    color: Colors.neonBlue,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  langDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  updatedText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginLeft: 'auto',
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
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 240,
  },
});
