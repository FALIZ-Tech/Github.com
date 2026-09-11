import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { BottomNav, TabType } from './src/components/BottomNav';
import { ParticleBackground } from './src/components/ParticleBackground';
import { Colors } from './src/theme/colors';

// Screens
import { IntroScreen } from './src/screens/IntroScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { RepositoriesScreen } from './src/screens/RepositoriesScreen';
import { RepoDetailScreen } from './src/screens/RepoDetailScreen';
import { CodeEditorScreen } from './src/screens/CodeEditorScreen';
import { ReleasesScreen } from './src/screens/ReleasesScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { GlobalSearchScreen } from './src/screens/GlobalSearchScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AboutScreen } from './src/screens/AboutScreen';

import { GitHubRepo } from './src/models/github';

function MainApp() {
  const { hasSeenIntro } = useApp();
  const { session, isLoading } = useAuth();

  // Navigation state
  const [showIntro, setShowIntro] = useState(!hasSeenIntro);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Stack navigation states
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [editorData, setEditorData] = useState<{
    filename: string;
    code: string;
    branch: string;
    repo: GitHubRepo;
  } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showReleases, setShowReleases] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // If intro requested
  if (showIntro) {
    return <IntroScreen onFinish={() => setShowIntro(false)} />;
  }

  // If Auth screen explicitly requested
  if (showAuthModal) {
    return (
      <AuthScreen
        onSuccess={() => setShowAuthModal(false)}
        onSkipToGuest={() => setShowAuthModal(false)}
      />
    );
  }

  // If in Code Editor Screen
  if (editorData) {
    return (
      <View style={styles.screenWrapper}>
        <ParticleBackground />
        <CodeEditorScreen
          initialFilename={editorData.filename}
          initialCode={editorData.code}
          initialBranch={editorData.branch}
          repo={editorData.repo}
          onBack={() => setEditorData(null)}
          onCommitSuccess={() => setEditorData(null)}
        />
      </View>
    );
  }

  // If in Repository Details Screen
  if (selectedRepo) {
    return (
      <View style={styles.screenWrapper}>
        <ParticleBackground />
        <RepoDetailScreen
          repo={selectedRepo}
          onBack={() => setSelectedRepo(null)}
          onOpenEditor={(filename, content, branch, r) => {
            setEditorData({ filename, code: content, branch, repo: r });
          }}
        />
      </View>
    );
  }

  // If in Search Screen
  if (showSearch) {
    return (
      <View style={styles.screenWrapper}>
        <ParticleBackground />
        <GlobalSearchScreen
          onSelectRepo={repo => {
            setShowSearch(false);
            setSelectedRepo(repo);
          }}
          onClose={() => setShowSearch(false)}
        />
      </View>
    );
  }

  // If in Releases Screen
  if (showReleases) {
    return (
      <View style={styles.screenWrapper}>
        <ParticleBackground />
        <Header
          title="Releases"
          subtitle="Binary packages & APKs"
          showBack={true}
          onBack={() => setShowReleases(false)}
        />
        <ReleasesScreen />
      </View>
    );
  }

  // If in Settings Screen
  if (showSettings) {
    return (
      <View style={styles.screenWrapper}>
        <ParticleBackground />
        <Header
          title="Settings"
          subtitle="Engine & API status"
          showBack={true}
          onBack={() => setShowSettings(false)}
        />
        <SettingsScreen
          onReplayIntro={() => {
            setShowSettings(false);
            setShowIntro(true);
          }}
          onNavigateAbout={() => {
            setShowSettings(false);
            setShowAbout(true);
          }}
        />
      </View>
    );
  }

  // If in About Screen
  if (showAbout) {
    return (
      <View style={styles.screenWrapper}>
        <ParticleBackground />
        <Header
          title="About Platform"
          subtitle="GameSiteOnline Pro"
          showBack={true}
          onBack={() => setShowAbout(false)}
        />
        <AboutScreen />
      </View>
    );
  }

  // Main Tab Navigation Body
  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateRepo={repo => setSelectedRepo(repo)}
            onNavigateTab={tab => setActiveTab(tab)}
            onNavigateReleases={() => setShowReleases(true)}
          />
        );
      case 'repos':
        return (
          <RepositoriesScreen
            onSelectRepo={repo => setSelectedRepo(repo)}
          />
        );
      case 'activity':
        return <ActivityScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return (
          <ProfileScreen
            onNavigateSettings={() => setShowSettings(true)}
            onNavigateAbout={() => setShowAbout(true)}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        );
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'GameSiteOnline';
      case 'repos':
        return 'Repositories';
      case 'activity':
        return 'Live Activity';
      case 'notifications':
        return 'Notifications';
      case 'profile':
        return 'Developer Hub';
    }
  };

  return (
    <View style={styles.screenWrapper}>
      <ParticleBackground />
      <Header
        title={getHeaderTitle()}
        onSearchPress={() => setShowSearch(true)}
        onSettingsPress={() => setShowSettings(true)}
      />
      <View style={styles.tabContentArea}>{renderCurrentTab()}</View>
      <BottomNav activeTab={activeTab} onTabChange={tab => setActiveTab(tab)} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <StatusBar style="light" backgroundColor="#070B14" />
          <MainApp />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  tabContentArea: {
    flex: 1,
  },
});
