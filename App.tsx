import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, StatusBar as RNStatusBar, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from './lib/theme';
import { AuthService } from './lib/auth';

// Screens
import { IntroScreen } from './screens/IntroScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RepositoriesScreen } from './screens/RepositoriesScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RepoDetailsScreen } from './screens/RepoDetailsScreen';
import { FileViewerScreen } from './screens/FileViewerScreen';
import { CodeEditorScreen } from './screens/CodeEditorScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { ParticleBackground } from './components/ParticleBackground';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: theme.colors.accent,
    background: theme.colors.background,
    card: 'rgba(10,16,32,0.95)',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.08)',
    notification: '#00D1FF',
  },
};

function TabBarIcon({ name, focused, color, size }: { name: any, focused: boolean, color: string, size: number }) {
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconActiveWrap]}>
      {focused && <View style={tabStyles.iconGlow} />}
      <Ionicons name={name} size={focused ? 22 : 20} color={focused ? '#00D1FF' : color} />
      {focused && <View style={tabStyles.activeDot} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 18 },
  iconActiveWrap: { backgroundColor: 'rgba(0,209,255,0.12)', borderWidth: 1, borderColor: 'rgba(0,209,255,0.25)' },
  iconGlow: { position: 'absolute', width: 40, height: 40, backgroundColor: 'rgba(0,209,255,0.15)', borderRadius: 20 },
  activeDot: { position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: 2, backgroundColor: '#00D1FF' },
});

function MainTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(5,7,14,0.92)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 86,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 26 : 12,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#00D1FF',
        tabBarInactiveTintColor: '#6E7681',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginTop: 2 },
        tabBarBackground: () => <View style={{ flex: 1, backgroundColor: 'rgba(5,7,14,0.96)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }} />,
      }}
    >
      <Tab.Screen name="Home" options={{ tabBarIcon: (p) => <TabBarIcon name={p.focused ? 'home' : 'home-outline'} {...p} /> }}>
        {(props) => <HomeScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Repositories" options={{ tabBarIcon: (p) => <TabBarIcon name={p.focused ? 'book' : 'book-outline'} {...p} /> }}>
        {(props) => <RepositoriesScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Activity" options={{ tabBarIcon: (p) => <TabBarIcon name={p.focused ? 'pulse' : 'pulse-outline'} {...p} /> }}>
        {(props) => <ActivityScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Notifications" options={{ tabBarIcon: (p) => <TabBarIcon name={p.focused ? 'notifications' : 'notifications-outline'} {...p} />, tabBarBadge: 3, tabBarBadgeStyle: { backgroundColor: '#FF5A5F', fontSize: 10, fontWeight: '900' } }}>
        {(props) => <NotificationsScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen name="ProfileTab" options={{ title: 'Profile', tabBarIcon: (p) => <TabBarIcon name={p.focused ? 'person' : 'person-outline'} {...p} /> }}>
        {(props) => <ProfileScreen {...(props as any)} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function RootStack({ onLogout }: { onLogout: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background }, animation: 'slide_from_right' }}>
      <Stack.Screen name="MainTabs">
        {(props) => <MainTabs {...(props as any)} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="RepoDetails" component={RepoDetailsScreen} />
      <Stack.Screen name="FileViewer" component={FileViewerScreen} />
      <Stack.Screen name="CodeEditor" component={CodeEditorScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <LinearGradient colors={['#05070E', '#0A1020', '#111A2E']} style={StyleSheet.absoluteFill} />
      <ParticleBackground />
      <View style={styles.loadingContent}>
        <View style={styles.loadingLogoWrap}>
          <Image source={require('./assets/icon.png')} style={styles.loadingLogo} />
          <ActivityIndicator color="#00D1FF" style={{ marginTop: 16 }} />
        </View>
        <Text style={styles.loadingTitle}>GAMESITEONLINE</Text>
        <Text style={styles.loadingSub}>Initializing secure vault...</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  const [phase, setPhase] = useState<'checking' | 'intro' | 'auth' | 'main'>('checking');

  useEffect(() => {
    checkInitial();
  }, []);

  const checkInitial = async () => {
    try {
      const isFirst = await AuthService.isFirstLaunch();
      if (isFirst) {
        setPhase('intro');
        return;
      }
      const hasSession = await AuthService.hasAnySession();
      setPhase(hasSession ? 'main' : 'auth');
    } catch {
      setPhase('auth');
    }
  };

  const handleIntroFinish = async () => {
    await AuthService.setFirstLaunchDone();
    const hasSession = await AuthService.hasAnySession();
    setPhase(hasSession ? 'main' : 'auth');
  };

  const handleIntroSkip = async () => {
    await AuthService.setFirstLaunchDone();
    const hasSession = await AuthService.hasAnySession();
    setPhase(hasSession ? 'main' : 'auth');
  };

  const handleAuthenticated = () => {
    setPhase('main');
  };

  const handleLogout = async () => {
    setPhase('auth');
  };

  if (!fontsLoaded) return null;

  if (phase === 'checking') return <LoadingScreen />;

  if (phase === 'intro') {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <StatusBar style="light" />
          <IntroScreen onFinish={handleIntroFinish} onSkip={handleIntroSkip} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (phase === 'auth') {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="light" />
          <AuthScreen onAuthenticated={handleAuthenticated} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme as any}>
        <StatusBar style="light" />
        <RootStack onLogout={handleLogout} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: '#05070E', alignItems: 'center', justifyContent: 'center' },
  loadingContent: { alignItems: 'center', zIndex: 2 },
  loadingLogoWrap: { width: 120, height: 120, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  loadingLogo: { width: 100, height: 100, borderRadius: 20 },
  loadingTitle: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: 5, marginTop: 20 },
  loadingSub: { color: '#6E7681', fontSize: 11, letterSpacing: 1, marginTop: 6, fontWeight: '600' },
});
