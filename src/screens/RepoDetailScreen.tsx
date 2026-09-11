import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  ActivityIndicator,
  Linking,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { CodeViewer } from '../components/CodeViewer';
import { Colors, LanguageColors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { githubApi } from '../api/githubApi';
import {
  GitHubRepo,
  GitHubContentItem,
  GitHubCommit,
  GitHubBranch,
  GitHubIssue,
  GitHubPullRequest,
  GitHubRelease,
} from '../models/github';

interface RepoDetailScreenProps {
  repo: GitHubRepo;
  onBack: () => void;
  onOpenEditor: (filename: string, content: string, branch: string, repo: GitHubRepo) => void;
}

type DetailTab = 'overview' | 'files' | 'commits' | 'issues' | 'pulls' | 'releases';

export const RepoDetailScreen: React.FC<RepoDetailScreenProps> = ({
  repo,
  onBack,
  onOpenEditor,
}) => {
  const { isGuest, isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useApp();

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [currentBranch, setCurrentBranch] = useState(repo.default_branch || 'main');
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [showBranchModal, setShowBranchModal] = useState(false);

  // Files state
  const [currentPath, setCurrentPath] = useState('');
  const [contents, setContents] = useState<GitHubContentItem[]>([]);
  const [activeFile, setActiveFile] = useState<{ name: string; content: string } | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [filesLoading, setFilesLoading] = useState(false);

  // Commits, Issues, PRs, Releases
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [pulls, setPulls] = useState<GitHubPullRequest[]>([]);
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // New Issue Modal
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueBody, setIssueBody] = useState('');
  const [creatingIssue, setCreatingIssue] = useState(false);

  // Active Issue details modal
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [newComment, setNewComment] = useState('');

  // Clone URL copied state
  const [copiedClone, setCopiedClone] = useState(false);

  const owner = repo.owner?.login || 'gamesiteonline';
  const repoName = repo.name;

  useEffect(() => {
    loadTabContent();
    loadBranches();
  }, [activeTab, currentBranch]);

  const loadBranches = async () => {
    try {
      const bList = await githubApi.getBranches(owner, repoName);
      setBranches(bList);
    } catch {
      // ignore
    }
  };

  const loadTabContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const readme = await githubApi.getFileContent(owner, repoName, 'README.md', currentBranch);
        setReadmeContent(readme.content);
      } else if (activeTab === 'files') {
        await loadPathContents(currentPath);
      } else if (activeTab === 'commits') {
        const cList = await githubApi.getCommits(owner, repoName);
        setCommits(cList);
      } else if (activeTab === 'issues') {
        const iList = await githubApi.getIssues(owner, repoName);
        setIssues(iList);
      } else if (activeTab === 'pulls') {
        const pList = await githubApi.getPullRequests(owner, repoName);
        setPulls(pList);
      } else if (activeTab === 'releases') {
        const rList = await githubApi.getReleases(owner, repoName);
        setReleases(rList);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadPathContents = async (path: string) => {
    setFilesLoading(true);
    try {
      const items = await githubApi.getRepoContents(owner, repoName, path, currentBranch);
      setContents(items);
    } finally {
      setFilesLoading(false);
    }
  };

  const handleItemPress = async (item: GitHubContentItem) => {
    if (item.type === 'dir') {
      setCurrentPath(item.path);
      setActiveFile(null);
      await loadPathContents(item.path);
    } else {
      setFilesLoading(true);
      try {
        const res = await githubApi.getFileContent(owner, repoName, item.path, currentBranch);
        setActiveFile({ name: item.name, content: res.content });
      } finally {
        setFilesLoading(false);
      }
    }
  };

  const handleNavUp = async () => {
    if (!currentPath) return;
    const parts = currentPath.split('/');
    parts.pop();
    const newPath = parts.join('/');
    setCurrentPath(newPath);
    setActiveFile(null);
    await loadPathContents(newPath);
  };

  const handleCopyClone = async () => {
    await Clipboard.setStringAsync(repo.clone_url);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleCreateIssue = async () => {
    if (!issueTitle.trim()) return;
    setCreatingIssue(true);
    try {
      const created = await githubApi.createIssue(owner, repoName, issueTitle, issueBody);
      setIssues(prev => [created, ...prev]);
      setShowNewIssueModal(false);
      setIssueTitle('');
      setIssueBody('');
    } finally {
      setCreatingIssue(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedIssue || !newComment.trim()) return;
    try {
      await githubApi.addIssueComment(owner, repoName, selectedIssue.number, newComment);
      setNewComment('');
      // update comments count locally
      setSelectedIssue(prev => (prev ? { ...prev, comments: prev.comments + 1 } : null));
    } catch {
      // ignore
    }
  };

  const handleToggleIssueState = async () => {
    if (!selectedIssue) return;
    const nextState = selectedIssue.state === 'open' ? 'closed' : 'open';
    try {
      await githubApi.updateIssueState(owner, repoName, selectedIssue.number, nextState);
      setSelectedIssue(prev => (prev ? { ...prev, state: nextState } : null));
      setIssues(prev =>
        prev.map(i => (i.id === selectedIssue.id ? { ...i, state: nextState } : i))
      );
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.neonCyan} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerRepoName} numberOfLines={1}>
            {repo.name}
          </Text>
          <Text style={styles.headerOwner}>@{owner}</Text>
        </View>

        {/* Branch selector pill */}
        <TouchableOpacity
          style={styles.branchSelectPill}
          onPress={() => setShowBranchModal(true)}
        >
          <Ionicons name="git-branch-outline" size={12} color={Colors.neonBlue} />
          <Text style={styles.branchSelectText} numberOfLines={1}>
            {currentBranch}
          </Text>
          <Ionicons name="chevron-down" size={10} color={Colors.neonBlue} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.starHeaderBtn}
          onPress={() => toggleFavorite(repo.id)}
        >
          <Ionicons
            name={isFavorite(repo.id) ? 'star' : 'star-outline'}
            size={18}
            color={isFavorite(repo.id) ? Colors.neonAmber : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 12 }}>
          {(
            [
              { key: 'overview', label: 'Overview', icon: 'information-circle-outline' },
              { key: 'files', label: 'Files', icon: 'folder-outline' },
              { key: 'commits', label: 'Commits', icon: 'git-commit-outline' },
              { key: 'issues', label: `Issues (${repo.open_issues_count || 0})`, icon: 'alert-circle-outline' },
              { key: 'pulls', label: 'Pull Requests', icon: 'git-pull-request-outline' },
              { key: 'releases', label: 'Releases', icon: 'cloud-download-outline' },
            ] as const
          ).map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => {
                  setActiveTab(tab.key);
                  setActiveFile(null);
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={13}
                  color={isActive ? '#070B14' : Colors.textSecondary}
                />
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <ScrollView
          style={styles.tabContent}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadTabContent();
              }}
              tintColor={Colors.neonCyan}
            />
          }
        >
          <GlassCard variant="glow" style={styles.metaCard}>
            <Text style={styles.overviewDesc}>
              {repo.description || 'No description provided for this repository.'}
            </Text>

            {/* Topics */}
            {repo.topics && repo.topics.length > 0 && (
              <View style={styles.topicRow}>
                {repo.topics.map((t, idx) => (
                  <View key={idx} style={styles.topicPill}>
                    <Text style={styles.topicPillText}>#{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Key stats row */}
            <View style={styles.quickStatsRow}>
              <View style={styles.quickStatBox}>
                <Ionicons name="star" size={14} color={Colors.neonAmber} />
                <Text style={styles.quickStatValue}>{repo.stargazers_count}</Text>
                <Text style={styles.quickStatLabel}>Stars</Text>
              </View>
              <View style={styles.quickStatBox}>
                <Ionicons name="git-network" size={14} color={Colors.neonBlue} />
                <Text style={styles.quickStatValue}>{repo.forks_count}</Text>
                <Text style={styles.quickStatLabel}>Forks</Text>
              </View>
              <View style={styles.quickStatBox}>
                <Ionicons name="eye" size={14} color={Colors.neonCyan} />
                <Text style={styles.quickStatValue}>{repo.watchers_count}</Text>
                <Text style={styles.quickStatLabel}>Watchers</Text>
              </View>
              <View style={styles.quickStatBox}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.neonGreen} />
                <Text style={styles.quickStatValue}>{repo.license?.spdx_id || 'MIT'}</Text>
                <Text style={styles.quickStatLabel}>License</Text>
              </View>
            </View>

            {/* Clone URL Bar */}
            <View style={styles.cloneBox}>
              <Text style={styles.cloneLabel}>CLONE HTTPS</Text>
              <View style={styles.cloneInputRow}>
                <Text style={styles.cloneUrlText} numberOfLines={1}>
                  {repo.clone_url}
                </Text>
                <TouchableOpacity style={styles.cloneCopyBtn} onPress={handleCopyClone}>
                  <Ionicons
                    name={copiedClone ? 'checkmark' : 'copy-outline'}
                    size={14}
                    color={copiedClone ? Colors.neonGreen : '#070B14'}
                  />
                  <Text style={[styles.cloneCopyBtnText, copiedClone && { color: Colors.neonGreen }]}>
                    {copiedClone ? 'Copied' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.overviewActionRow}>
              {repo.homepage && (
                <NeonButton
                  title="Live Demo"
                  onPress={() => Linking.openURL(repo.homepage!)}
                  icon="open-outline"
                  variant="outline"
                  size="sm"
                  style={{ flex: 1 }}
                />
              )}
              <NeonButton
                title="View on GitHub"
                onPress={() => Linking.openURL(repo.html_url)}
                icon="logo-github"
                variant="secondary"
                size="sm"
                style={{ flex: 1 }}
              />
            </View>
          </GlassCard>

          {/* README Renderer */}
          <GlassCard style={[styles.metaCard, { marginTop: 14 }]}>
            <View style={styles.readmeHeader}>
              <Ionicons name="book-outline" size={16} color={Colors.neonCyan} />
              <Text style={styles.readmeTitle}>README.md</Text>
            </View>
            {loading && !readmeContent ? (
              <ActivityIndicator size="small" color={Colors.neonCyan} style={{ padding: 20 }} />
            ) : (
              <MarkdownViewer content={readmeContent || '# ' + repo.name + '\n' + (repo.description || '')} />
            )}
          </GlassCard>
        </ScrollView>
      )}

      {/* TAB 2: FILES & SOURCE VIEWER */}
      {activeTab === 'files' && (
        <View style={styles.filesContainer}>
          {/* Path Breadcrumbs */}
          <View style={styles.pathBar}>
            <TouchableOpacity onPress={() => { setCurrentPath(''); setActiveFile(null); loadPathContents(''); }}>
              <Text style={styles.rootBreadcrumb}>{repo.name}</Text>
            </TouchableOpacity>
            {currentPath.length > 0 && (
              <>
                <Text style={styles.pathSeparator}>/</Text>
                <Text style={styles.currentPathText} numberOfLines={1}>{currentPath}</Text>
              </>
            )}
            {currentPath.length > 0 && (
              <TouchableOpacity style={styles.navUpBtn} onPress={handleNavUp}>
                <Ionicons name="arrow-up" size={14} color={Colors.neonCyan} />
                <Text style={styles.navUpText}>Up</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* If file is currently open */}
          {activeFile ? (
            <View style={{ flex: 1, padding: 12 }}>
              <View style={styles.fileActionHeader}>
                <TouchableOpacity
                  style={styles.closeFileBtn}
                  onPress={() => setActiveFile(null)}
                >
                  <Ionicons name="close" size={16} color={Colors.textSecondary} />
                  <Text style={styles.closeFileText}>Back to tree</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.openEditorBtn}
                  onPress={() => onOpenEditor(activeFile.name, activeFile.content, currentBranch, repo)}
                >
                  <Ionicons name="create-outline" size={14} color="#070B14" />
                  <Text style={styles.openEditorText}>Edit in Code Editor</Text>
                </TouchableOpacity>
              </View>

              <CodeViewer
                initialCode={activeFile.content}
                filename={activeFile.name}
                branch={currentBranch}
                editable={false}
              />
            </View>
          ) : (
            <ScrollView style={styles.treeScroll} contentContainerStyle={{ padding: 14 }}>
              {filesLoading ? (
                <ActivityIndicator size="large" color={Colors.neonCyan} style={{ padding: 30 }} />
              ) : (
                contents.map((item, idx) => (
                  <TouchableOpacity
                    key={item.sha || idx}
                    style={styles.treeItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={item.type === 'dir' ? 'folder' : 'document-text-outline'}
                      size={18}
                      color={item.type === 'dir' ? Colors.neonCyan : Colors.neonBlue}
                    />
                    <Text
                      style={[
                        styles.treeItemName,
                        item.type === 'dir' && styles.treeDirName,
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    {item.size > 0 && (
                      <Text style={styles.treeItemSize}>
                        {(item.size / 1024).toFixed(1)} KB
                      </Text>
                    )}
                    <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>
      )}

      {/* TAB 3: COMMITS */}
      {activeTab === 'commits' && (
        <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16 }}>
          {commits.map((c, i) => (
            <GlassCard key={c.sha || i} style={styles.commitCard}>
              <View style={styles.commitHeaderRow}>
                <Ionicons name="git-commit" size={16} color={Colors.neonCyan} />
                <Text style={styles.commitMsg} numberOfLines={2}>
                  {c.commit.message}
                </Text>
              </View>
              <View style={styles.commitMetaRow}>
                <Text style={styles.commitAuthor}>
                  {c.author?.login || c.commit.author.name}
                </Text>
                <Text style={styles.commitDate}>
                  {new Date(c.commit.author.date).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  style={styles.commitShaPill}
                  onPress={() => Clipboard.setStringAsync(c.sha)}
                >
                  <Text style={styles.commitShaText}>{c.sha.substring(0, 7)}</Text>
                  <Ionicons name="copy-outline" size={10} color={Colors.neonBlue} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
      )}

      {/* TAB 4: ISSUES */}
      {activeTab === 'issues' && (
        <View style={{ flex: 1 }}>
          <View style={styles.issueTopBar}>
            <Text style={styles.issueCountText}>{issues.length} Issues Tracked</Text>
            <TouchableOpacity
              style={styles.newIssueBtn}
              onPress={() => setShowNewIssueModal(true)}
            >
              <Ionicons name="add" size={16} color="#070B14" />
              <Text style={styles.newIssueBtnText}>New Issue</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16 }}>
            {issues.map(iss => (
              <GlassCard
                key={iss.id}
                style={styles.issueCard}
                onPress={() => setSelectedIssue(iss)}
              >
                <View style={styles.issueHeader}>
                  <Ionicons
                    name={iss.state === 'open' ? 'alert-circle' : 'checkmark-circle'}
                    size={16}
                    color={iss.state === 'open' ? Colors.neonGreen : Colors.neonRose}
                  />
                  <Text style={styles.issueTitle} numberOfLines={2}>
                    {iss.title}
                  </Text>
                </View>

                {iss.labels && iss.labels.length > 0 && (
                  <View style={styles.issueLabelsRow}>
                    {iss.labels.map(l => (
                      <View key={l.id} style={styles.issueLabelBadge}>
                        <Text style={styles.issueLabelText}>{l.name}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.issueFooterRow}>
                  <Text style={styles.issueNumber}>#{iss.number}</Text>
                  <Text style={styles.issueAuthor}>by {iss.user.login}</Text>
                  <View style={styles.commentsPill}>
                    <Ionicons name="chatbubble-outline" size={11} color={Colors.textSecondary} />
                    <Text style={styles.commentsPillText}>{iss.comments}</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </ScrollView>
        </View>
      )}

      {/* TAB 5: PULL REQUESTS */}
      {activeTab === 'pulls' && (
        <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16 }}>
          {pulls.map(pr => (
            <GlassCard key={pr.id} style={styles.prCard}>
              <View style={styles.prHeader}>
                <Ionicons
                  name="git-pull-request"
                  size={16}
                  color={pr.state === 'open' ? Colors.neonCyan : Colors.neonPurple}
                />
                <Text style={styles.prTitle}>{pr.title}</Text>
              </View>
              <View style={styles.prBranchRow}>
                <View style={styles.branchBox}>
                  <Text style={styles.branchBoxText}>{pr.head.ref}</Text>
                </View>
                <Ionicons name="arrow-forward" size={12} color={Colors.textMuted} />
                <View style={styles.branchBox}>
                  <Text style={styles.branchBoxText}>{pr.base.ref}</Text>
                </View>
                <View
                  style={[
                    styles.prStateBadge,
                    pr.merged_at ? styles.prStateMerged : styles.prStateOpen,
                  ]}
                >
                  <Text style={styles.prStateText}>
                    {pr.merged_at ? 'MERGED' : pr.state.toUpperCase()}
                  </Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
      )}

      {/* TAB 6: RELEASES */}
      {activeTab === 'releases' && (
        <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16 }}>
          {releases.map(rel => (
            <GlassCard key={rel.id} variant="glow" style={styles.releaseCard}>
              <View style={styles.releaseHeader}>
                <View>
                  <Text style={styles.releaseName}>{rel.name || rel.tag_name}</Text>
                  <Text style={styles.releaseTag}>{rel.tag_name}</Text>
                </View>
                <View style={styles.latestBadge}>
                  <Text style={styles.latestBadgeText}>LATEST</Text>
                </View>
              </View>

              {rel.body && (
                <Text style={styles.releaseNotes} numberOfLines={4}>
                  {rel.body}
                </Text>
              )}

              {/* Assets list */}
              {rel.assets && rel.assets.length > 0 && (
                <View style={styles.assetsList}>
                  <Text style={styles.assetsTitle}>Binaries & Assets</Text>
                  {rel.assets.map(asset => (
                    <TouchableOpacity
                      key={asset.id}
                      style={styles.assetItem}
                      onPress={() => Linking.openURL(asset.browser_download_url)}
                    >
                      <Ionicons name="cloud-download-outline" size={16} color={Colors.neonCyan} />
                      <Text style={styles.assetName} numberOfLines={1}>
                        {asset.name}
                      </Text>
                      <Text style={styles.assetSize}>
                        {(asset.size / (1024 * 1024)).toFixed(1)} MB
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </GlassCard>
          ))}
        </ScrollView>
      )}

      {/* Branch Selection Modal */}
      <Modal visible={showBranchModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.branchModalCard}>
            <View style={styles.branchModalHeader}>
              <Ionicons name="git-branch" size={18} color={Colors.neonCyan} />
              <Text style={styles.branchModalTitle}>Select Git Branch</Text>
              <TouchableOpacity onPress={() => setShowBranchModal(false)}>
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 280 }}>
              {branches.map(b => (
                <TouchableOpacity
                  key={b.name}
                  style={[
                    styles.branchItem,
                    currentBranch === b.name && styles.branchItemActive,
                  ]}
                  onPress={() => {
                    setCurrentBranch(b.name);
                    setShowBranchModal(false);
                  }}
                >
                  <Ionicons
                    name="git-branch-outline"
                    size={16}
                    color={currentBranch === b.name ? Colors.neonCyan : Colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.branchItemText,
                      currentBranch === b.name && styles.branchItemTextActive,
                    ]}
                  >
                    {b.name}
                  </Text>
                  {currentBranch === b.name && (
                    <Ionicons name="checkmark" size={16} color={Colors.neonCyan} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Issue Modal */}
      <Modal visible={showNewIssueModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.newIssueCard}>
            <View style={styles.branchModalHeader}>
              <Ionicons name="alert-circle-outline" size={18} color={Colors.neonCyan} />
              <Text style={styles.branchModalTitle}>Open New Issue</Text>
              <TouchableOpacity onPress={() => setShowNewIssueModal(false)}>
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16 }}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Issue title"
                placeholderTextColor={Colors.textMuted}
                value={issueTitle}
                onChangeText={setIssueTitle}
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Description</Text>
              <TextInput
                style={[styles.modalInput, { height: 90 }]}
                placeholder="Describe bug or enhancement..."
                placeholderTextColor={Colors.textMuted}
                multiline
                value={issueBody}
                onChangeText={setIssueBody}
              />

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowNewIssueModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSubmitBtn}
                  onPress={handleCreateIssue}
                  disabled={creatingIssue || !issueTitle.trim()}
                >
                  {creatingIssue ? (
                    <ActivityIndicator size="small" color="#070B14" />
                  ) : (
                    <Text style={styles.modalSubmitText}>Submit Issue</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Selected Issue Modal with Comments */}
      {selectedIssue && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.issueDetailCard}>
              <View style={styles.branchModalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <Ionicons
                    name={selectedIssue.state === 'open' ? 'alert-circle' : 'checkmark-circle'}
                    size={16}
                    color={selectedIssue.state === 'open' ? Colors.neonGreen : Colors.neonRose}
                  />
                  <Text style={styles.branchModalTitle} numberOfLines={1}>
                    #{selectedIssue.number}: {selectedIssue.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedIssue(null)}>
                  <Ionicons name="close" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ padding: 16, maxHeight: 340 }}>
                <Text style={styles.issueDetailBody}>
                  {selectedIssue.body || 'No description provided.'}
                </Text>

                <View style={styles.issueActionToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.toggleStateBtn,
                      selectedIssue.state === 'open'
                        ? styles.closeStateBtn
                        : styles.reopenStateBtn,
                    ]}
                    onPress={handleToggleIssueState}
                  >
                    <Ionicons
                      name={
                        selectedIssue.state === 'open'
                          ? 'close-circle-outline'
                          : 'refresh-outline'
                      }
                      size={14}
                      color="#FFFFFF"
                    />
                    <Text style={styles.toggleStateText}>
                      {selectedIssue.state === 'open' ? 'Close Issue' : 'Reopen Issue'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Comment box */}
                <Text style={[styles.inputLabel, { marginTop: 14 }]}>Add Comment</Text>
                <TextInput
                  style={[styles.modalInput, { height: 60 }]}
                  placeholder="Write a response..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity
                  style={[styles.commentPostBtn, !newComment.trim() && { opacity: 0.5 }]}
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Ionicons name="send" size={14} color="#070B14" />
                  <Text style={styles.commentPostBtnText}>Post Comment</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    backgroundColor: 'rgba(7, 11, 20, 0.95)',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerRepoName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerOwner: {
    fontSize: 11,
    color: Colors.neonCyan,
    marginTop: 1,
  },
  branchSelectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginRight: 8,
  },
  branchSelectText: {
    fontSize: 10,
    color: Colors.neonBlue,
    fontWeight: '700',
    maxWidth: 70,
  },
  starHeaderBtn: {
    padding: 6,
  },
  tabsRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    paddingVertical: 8,
    backgroundColor: 'rgba(13, 20, 36, 0.5)',
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  tabChipActive: {
    backgroundColor: Colors.neonCyan,
    borderColor: Colors.neonCyan,
  },
  tabChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabChipTextActive: {
    color: '#070B14',
    fontWeight: '800',
  },
  tabContent: {
    flex: 1,
  },
  metaCard: {
    padding: 16,
  },
  overviewDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  topicPill: {
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  topicPillText: {
    fontSize: 10,
    color: Colors.neonCyan,
    fontWeight: '600',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderGlass,
    marginVertical: 12,
  },
  quickStatBox: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  quickStatLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cloneBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    marginBottom: 14,
  },
  cloneLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '700',
    marginBottom: 4,
  },
  cloneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cloneUrlText: {
    fontSize: 11,
    color: Colors.neonCyan,
    fontFamily: 'monospace',
    flex: 1,
    marginRight: 8,
  },
  cloneCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neonCyan,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  cloneCopyBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#070B14',
  },
  overviewActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  readmeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    paddingBottom: 8,
    marginBottom: 8,
  },
  readmeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  filesContainer: {
    flex: 1,
  },
  pathBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  rootBreadcrumb: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.neonCyan,
  },
  pathSeparator: {
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
  currentPathText: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
  navUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  navUpText: {
    fontSize: 10,
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  fileActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  closeFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  closeFileText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  openEditorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neonCyan,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  openEditorText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#070B14',
  },
  treeScroll: {
    flex: 1,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 20, 36, 0.75)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 10,
  },
  treeItemName: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  treeDirName: {
    fontWeight: '700',
    color: Colors.neonCyan,
  },
  treeItemSize: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  commitCard: {
    padding: 12,
    marginBottom: 10,
  },
  commitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  commitMsg: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  commitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  commitAuthor: {
    fontSize: 11,
    color: Colors.neonBlue,
    fontWeight: '600',
  },
  commitDate: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  commitShaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  commitShaText: {
    fontSize: 10,
    color: Colors.neonBlue,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  issueTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  issueCountText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  newIssueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neonCyan,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  newIssueBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#070B14',
  },
  issueCard: {
    padding: 12,
    marginBottom: 10,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  issueTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  issueLabelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 8,
  },
  issueLabelBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 0.5,
    borderColor: Colors.neonCyan,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  issueLabelText: {
    fontSize: 9,
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  issueFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  issueNumber: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  issueAuthor: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  commentsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 'auto',
  },
  commentsPillText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  prCard: {
    padding: 12,
    marginBottom: 10,
  },
  prHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  prTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  prBranchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  branchBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  branchBoxText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.neonBlue,
  },
  prStateBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prStateOpen: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
  },
  prStateMerged: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  prStateText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  releaseCard: {
    padding: 14,
    marginBottom: 12,
  },
  releaseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  releaseName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  releaseTag: {
    fontSize: 11,
    color: Colors.neonCyan,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  latestBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 0.5,
    borderColor: Colors.neonGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  latestBadgeText: {
    fontSize: 9,
    color: Colors.neonGreen,
    fontWeight: '800',
  },
  releaseNotes: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginVertical: 8,
  },
  assetsList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  assetsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 8,
    marginBottom: 6,
  },
  assetName: {
    fontSize: 11,
    color: Colors.neonCyan,
    flex: 1,
  },
  assetSize: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  branchModalCard: {
    backgroundColor: '#0D1424',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    padding: 16,
  },
  branchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    marginBottom: 10,
  },
  branchModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  branchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 8,
  },
  branchItemActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
  },
  branchItemText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  branchItemTextActive: {
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  newIssueCard: {
    backgroundColor: '#0D1424',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    overflow: 'hidden',
  },
  issueDetailCard: {
    backgroundColor: '#0D1424',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    overflow: 'hidden',
  },
  issueDetailBody: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 14,
  },
  issueActionToggleRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  toggleStateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeStateBtn: {
    backgroundColor: Colors.neonRose,
  },
  reopenStateBtn: {
    backgroundColor: Colors.neonGreen,
  },
  toggleStateText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  commentPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neonCyan,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  commentPostBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#070B14',
  },
  inputLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  modalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  modalCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCancelText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  modalSubmitBtn: {
    backgroundColor: Colors.neonCyan,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalSubmitText: {
    color: '#070B14',
    fontSize: 12,
    fontWeight: '800',
  },
});
