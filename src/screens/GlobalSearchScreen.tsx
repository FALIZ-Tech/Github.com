import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../theme/colors';
import { githubApi } from '../api/githubApi';
import { GitHubRepo, GitHubUser, GitHubIssue } from '../models/github';

interface GlobalSearchScreenProps {
  onSelectRepo: (repo: GitHubRepo) => void;
  onClose: () => void;
}

type SearchCategory = 'repos' | 'users' | 'issues';

export const GlobalSearchScreen: React.FC<GlobalSearchScreenProps> = ({
  onSelectRepo,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('repos');
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setRepos([]);
      setUsers([]);
      setIssues([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [query, category]);

  const performSearch = async (q: string) => {
    setLoading(true);
    try {
      if (category === 'repos') {
        const results = await githubApi.searchRepositories(q);
        setRepos(results);
      } else if (category === 'users') {
        const results = await githubApi.searchUsers(q);
        setUsers(results);
      } else if (category === 'issues') {
        const results = await githubApi.searchIssues(q);
        setIssues(results);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.neonCyan} />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.neonCyan} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search GitHub repositories, users, issues..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryRow}>
        {(
          [
            { key: 'repos', label: 'Repositories', icon: 'folder-outline' },
            { key: 'users', label: 'Users', icon: 'people-outline' },
            { key: 'issues', label: 'Issues', icon: 'alert-circle-outline' },
          ] as const
        ).map(cat => {
          const isActive = category === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
              onPress={() => setCategory(cat.key)}
            >
              <Ionicons
                name={cat.icon as any}
                size={13}
                color={isActive ? '#070B14' : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryBtnText,
                  isActive && styles.categoryBtnTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results View */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.neonCyan} />
          <Text style={styles.loadingText}>Searching GitHub platform...</Text>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          {category === 'repos' && (
            <FlatList
              data={repos}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <GlassCard
                  style={styles.resultCard}
                  onPress={() => {
                    onClose();
                    onSelectRepo(item);
                  }}
                >
                  <View style={styles.resultHeader}>
                    <Ionicons name="folder" size={16} color={Colors.neonCyan} />
                    <Text style={styles.resultTitle} numberOfLines={1}>
                      {item.full_name || item.name}
                    </Text>
                    <View style={styles.starPill}>
                      <Ionicons name="star" size={10} color={Colors.neonAmber} />
                      <Text style={styles.starCount}>{item.stargazers_count}</Text>
                    </View>
                  </View>
                  {item.description && (
                    <Text style={styles.resultDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                  {item.language && (
                    <Text style={styles.resultLang}>Lang: {item.language}</Text>
                  )}
                </GlassCard>
              )}
              ListEmptyComponent={
                query ? (
                  <Text style={styles.emptyText}>No repositories match "{query}"</Text>
                ) : null
              }
            />
          )}

          {category === 'users' && (
            <FlatList
              data={users}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <GlassCard style={styles.resultCard}>
                  <View style={styles.userRow}>
                    <Image source={{ uri: item.avatar_url }} style={styles.userAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.userName}>{item.name || item.login}</Text>
                      <Text style={styles.userLogin}>@{item.login}</Text>
                    </View>
                  </View>
                </GlassCard>
              )}
            />
          )}

          {category === 'issues' && (
            <FlatList
              data={issues}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <GlassCard style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Ionicons
                      name={item.state === 'open' ? 'alert-circle' : 'checkmark-circle'}
                      size={16}
                      color={item.state === 'open' ? Colors.neonGreen : Colors.neonRose}
                    />
                    <Text style={styles.resultTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                  {item.body && (
                    <Text style={styles.resultDesc} numberOfLines={2}>
                      {item.body}
                    </Text>
                  )}
                </GlassCard>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    backgroundColor: 'rgba(7, 11, 20, 0.95)',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    padding: 0,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    gap: 8,
  },
  categoryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    gap: 6,
  },
  categoryBtnActive: {
    backgroundColor: Colors.neonCyan,
    borderColor: Colors.neonCyan,
  },
  categoryBtnText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  categoryBtnTextActive: {
    color: '#070B14',
    fontWeight: '800',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.neonCyan,
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    padding: 12,
    marginBottom: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  starCount: {
    fontSize: 10,
    color: Colors.neonAmber,
    fontWeight: '700',
  },
  resultDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 16,
  },
  resultLang: {
    fontSize: 10,
    color: Colors.neonBlue,
    marginTop: 6,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neonCyan,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  userLogin: {
    fontSize: 11,
    color: Colors.neonCyan,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 30,
  },
});
