import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../theme/colors';
import { githubApi } from '../api/githubApi';
import { GitHubRelease } from '../models/github';

export const ReleasesScreen: React.FC = () => {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReleases = async () => {
    try {
      const data = await githubApi.getReleases('gamesiteonline', 'gamesiteonline');
      setReleases(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReleases();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadReleases();
  };

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
    >
      <View style={styles.heroBanner}>
        <Ionicons name="rocket-outline" size={32} color={Colors.neonCyan} />
        <Text style={styles.heroTitle}>Release & Distribution Hub</Text>
        <Text style={styles.heroDesc}>
          Official production binaries, APK packages, and web game bundles for GameSiteOnline.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.neonCyan} style={{ padding: 40 }} />
      ) : (
        releases.map((rel, idx) => (
          <GlassCard key={rel.id || idx} variant="glow" style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.tagWrap}>
                <Ionicons name="pricetag" size={14} color={Colors.neonCyan} />
                <Text style={styles.tagName}>{rel.tag_name}</Text>
              </View>

              {idx === 0 && (
                <View style={styles.latestBadge}>
                  <Text style={styles.latestBadgeText}>LATEST PRODUCTION</Text>
                </View>
              )}
            </View>

            <Text style={styles.releaseName}>{rel.name || rel.tag_name}</Text>
            <Text style={styles.releaseDate}>
              Published {new Date(rel.published_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} by @{rel.author?.login || 'gamesiteonline'}
            </Text>

            {rel.body && (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>{rel.body}</Text>
              </View>
            )}

            {/* Assets List */}
            <View style={styles.assetsSection}>
              <Text style={styles.assetsTitle}>Downloadable Packages</Text>
              {rel.assets.map(asset => (
                <TouchableOpacity
                  key={asset.id}
                  style={styles.assetItem}
                  onPress={() => Linking.openURL(asset.browser_download_url)}
                  activeOpacity={0.7}
                >
                  <View style={styles.assetIcon}>
                    <Ionicons
                      name={
                        asset.name.endsWith('.apk')
                          ? 'logo-android'
                          : asset.name.endsWith('.zip')
                          ? 'archive-outline'
                          : 'cube-outline'
                      }
                      size={18}
                      color={Colors.neonCyan}
                    />
                  </View>

                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName} numberOfLines={1}>
                      {asset.name}
                    </Text>
                    <Text style={styles.assetMeta}>
                      {(asset.size / (1024 * 1024)).toFixed(1)} MB • {asset.download_count} downloads
                    </Text>
                  </View>

                  <View style={styles.downloadBtn}>
                    <Ionicons name="download-outline" size={16} color="#070B14" />
                    <Text style={styles.downloadBtnText}>Get</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        ))
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
  heroBanner: {
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  heroDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 290,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagName: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: Colors.neonCyan,
  },
  latestBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 0.5,
    borderColor: Colors.neonGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  latestBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.neonGreen,
  },
  releaseName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  releaseDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  notesBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  notesText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  assetsSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  assetsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    gap: 10,
  },
  assetIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  assetMeta: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neonCyan,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  downloadBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#070B14',
  },
});
