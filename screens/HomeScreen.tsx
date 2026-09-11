import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image, Pressable, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ParticleBackground } from '../components/ParticleBackground';
import { SkeletonCard } from '../components/Skeleton';
import { GitHubService } from '../lib/github';
import { AuthService } from '../lib/auth';
import { theme } from '../lib/theme';
import { mockUser } from '../lib/mockData';

export const HomeScreen: React.FC<{ navigation:any }> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const cached = await AuthService.getUserCache();
      if (cached) setUser(cached);
      const [u, a, r] = await Promise.all([
        GitHubService.getAuthenticatedUser(),
        GitHubService.getRecentActivity(),
        GitHubService.getRepos({ per_page: 4, sort: 'updated' })
      ]);
      setUser(u);
      await AuthService.setUserCache(u);
      setActivity(a);
      setRepos(r.length ? r.slice(0,3) : []);
    } catch (e:any) {
      if (e?.type==='auth') {
        await AuthService.logout();
      }
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(()=>{ load(); },[]);

  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading && !user) {
    return (
      <View style={styles.container}><LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={{ padding:20, paddingTop:60 }}>{[1,2,3].map(i=><SkeletonCard key={i} />)}</ScrollView>
      </View>
    );
  }

  const displayUser = user || mockUser;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <ParticleBackground />
      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D1FF" />}>
        {/* Header */}
        <View style={styles.topHeader}>
          <Image source={require('../assets/icon.png')} style={styles.headerLogo} />
          <View style={{ flex:1 }}>
            <Text style={styles.appName}>GAMESITEONLINE</Text>
            <Text style={styles.appSub}>GitHub Gaming OS • v2.4.0</Text>
          </View>
          <Pressable onPress={()=>navigation.navigate('Search')} style={styles.iconBtn}><Ionicons name="search" size={20} color="white" /></Pressable>
          <Pressable onPress={()=>navigation.navigate('Settings')} style={styles.iconBtn}><Ionicons name="settings-outline" size={20} color="white" /></Pressable>
        </View>

        {/* Profile Card */}
        <GlassCard glow style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: displayUser.avatar_url }} style={styles.avatar} />
              <View style={styles.onlineDot} />
            </View>
            <View style={{ flex:1, marginLeft:14 }}>
              <Text style={styles.name}>{displayUser.name || displayUser.login}</Text>
              <Text style={styles.login}>@{displayUser.login}</Text>
              <Text style={styles.bio} numberOfLines={2}>{displayUser.bio || 'Premium GitHub gaming & developer platform'}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaChip}><Ionicons name="location-outline" size={12} color={theme.colors.textSecondary} /><Text style={styles.metaText}>{displayUser.location || 'Remote'}</Text></View>
                <View style={styles.metaChip}><Ionicons name="business-outline" size={12} color={theme.colors.textSecondary} /><Text style={styles.metaText}>{displayUser.company || '@gamesiteonline'}</Text></View>
              </View>
            </View>
          </View>
          <View style={styles.statsGrid}>
            {[
              { label:'Followers', value: displayUser.followers || 3842, icon:'people-outline', color:'#00D1FF' },
              { label:'Following', value: displayUser.following || 127, icon:'person-add-outline', color:'#8B5CF6' },
              { label:'Repos', value: displayUser.public_repos || 47, icon:'book-outline', color:'#00FFA3' },
              { label:'Stars', value: displayUser.total_stars || 12493, icon:'star', color:'#FFC857' },
            ].map((s,i)=>(
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIconWrap, { backgroundColor: `${s.color}18`, borderColor: `${s.color}30` }]}><Ionicons name={s.icon as any} size={16} color={s.color} /></View>
                <AnimatedCounter value={s.value} style={styles.statValue as any} />
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Neon Stats Overview */}
        <View style={styles.overviewRow}>
          <GlassCard style={{ flex:1 }}><View style={styles.overviewItem}><LinearGradient colors={['#00D1FF','#3A86FF']} style={styles.overviewGradient} /><Text style={styles.ovValue}>98.7%</Text><Text style={styles.ovLabel}>Uptime</Text></View></GlassCard>
          <GlassCard style={{ flex:1 }}><View style={styles.overviewItem}><LinearGradient colors={['#8B5CF6','#00D1FF']} style={styles.overviewGradient} /><Text style={styles.ovValue}>60fps</Text><Text style={styles.ovLabel}>Neon UI</Text></View></GlassCard>
          <GlassCard style={{ flex:1 }}><View style={styles.overviewItem}><LinearGradient colors={['#00FFA3','#00D1FF']} style={styles.overviewGradient} /><Text style={styles.ovValue}>Secure</Text><Text style={styles.ovLabel}>Keystore</Text></View></GlassCard>
        </View>

        {/* Recent Repos */}
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Recently Updated</Text><Pressable onPress={()=>navigation.navigate('Repositories')}><Text style={styles.seeAll}>View all →</Text></Pressable></View>
        {repos.map((r:any)=>(
          <Pressable key={r.id} onPress={()=>navigation.navigate('RepoDetails', { repo: r })}><GlassCard style={{ marginBottom:10 }}><View style={styles.repoMiniRow}><Ionicons name="book-outline" size={16} color={theme.colors.accent} /><Text style={styles.repoMiniName}>{r.name}</Text><View style={styles.starMini}><Ionicons name="star" size={10} color={theme.colors.star} /><Text style={styles.starMiniText}>{r.stargazers_count}</Text></View></View><Text style={styles.repoMiniDesc} numberOfLines={1}>{r.description}</Text></GlassCard></Pressable>
        ))}

        {/* Activity */}
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Activity Feed</Text><View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text></View></View>
        {activity.map((a:any,i:number)=>(
          <GlassCard key={i} style={{ marginBottom:8 }}>
            <View style={styles.activityRow}>
              <View style={[styles.activityIcon, { backgroundColor: a.type==='PushEvent' ? 'rgba(0,209,255,0.15)' : 'rgba(139,92,246,0.15)' }]}><Ionicons name={a.type==='PushEvent' ? 'git-commit-outline' : a.type==='StarEvent' ? 'star-outline' : 'git-branch-outline'} size={16} color={a.type==='PushEvent' ? '#00D1FF' : '#8B5CF6'} /></View>
              <View style={{ flex:1 }}><Text style={styles.activityRepo}>{a.repo}</Text><Text style={styles.activityDesc}>{a.description}</Text></View>
              <Text style={styles.activityTime}>{a.time}</Text>
            </View>
          </GlassCard>
        ))}

        <View style={{ height:100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  scroll:{ padding:20, paddingTop:50, paddingBottom:20 },
  topHeader:{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:20 },
  headerLogo:{ width:36, height:36, borderRadius:10 },
  appName:{ color:'white', fontWeight:'900', fontSize:14, letterSpacing:3 },
  appSub:{ color:theme.colors.textTertiary, fontSize:10, letterSpacing:1, fontWeight:'600' },
  iconBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center' },
  profileCard:{ marginBottom:16 },
  profileRow:{ flexDirection:'row' },
  avatarWrap:{ position:'relative' },
  avatar:{ width:72, height:72, borderRadius:20, borderWidth:2, borderColor:'rgba(0,209,255,0.3)' },
  onlineDot:{ position:'absolute', bottom:-2, right:-2, width:14, height:14, borderRadius:7, backgroundColor:'#00FFA3', borderWidth:2, borderColor:'#0A1020' },
  name:{ color:'white', fontSize:20, fontWeight:'800' },
  login:{ color:theme.colors.accent, fontSize:13, fontWeight:'600', marginTop:2 },
  bio:{ color:theme.colors.textSecondary, fontSize:12, lineHeight:16, marginTop:6 },
  metaRow:{ flexDirection:'row', gap:8, marginTop:8, flexWrap:'wrap' },
  metaChip:{ flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(255,255,255,0.06)', paddingHorizontal:8, paddingVertical:4, borderRadius:12, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  metaText:{ color:theme.colors.textSecondary, fontSize:10, fontWeight:'600' },
  statsGrid:{ flexDirection:'row', gap:8, marginTop:16 },
  statCard:{ flex:1, backgroundColor:'rgba(255,255,255,0.04)', borderRadius:14, borderWidth:1, borderColor:'rgba(255,255,255,0.06)', padding:10, alignItems:'center' },
  statIconWrap:{ width:32, height:32, borderRadius:16, alignItems:'center', justifyContent:'center', borderWidth:1, marginBottom:6 },
  statValue:{ color:'white', fontSize:16, fontWeight:'900' },
  statLabel:{ color:theme.colors.textTertiary, fontSize:9, fontWeight:'700', letterSpacing:1, marginTop:2 },
  overviewRow:{ flexDirection:'row', gap:8, marginBottom:16 },
  overviewItem:{ alignItems:'center', paddingVertical:4 },
  overviewGradient:{ position:'absolute', top:-16, left:-16, right:-16, height:40, opacity:0.15 },
  ovValue:{ color:'white', fontWeight:'900', fontSize:16 },
  ovLabel:{ color:theme.colors.textTertiary, fontSize:9, letterSpacing:1, marginTop:2, fontWeight:'700' },
  sectionHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10, marginTop:6 },
  sectionTitle:{ color:'white', fontWeight:'800', fontSize:16 },
  seeAll:{ color:theme.colors.accent, fontSize:12, fontWeight:'700' },
  liveBadge:{ flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'rgba(0,255,163,0.12)', borderWidth:1, borderColor:'rgba(0,255,163,0.25)', paddingHorizontal:8, paddingVertical:3, borderRadius:12 },
  liveDot:{ width:6, height:6, borderRadius:3, backgroundColor:'#00FFA3' },
  liveText:{ color:'#00FFA3', fontSize:9, fontWeight:'900', letterSpacing:1 },
  repoMiniRow:{ flexDirection:'row', alignItems:'center', gap:8 },
  repoMiniName:{ color:theme.colors.accent, fontWeight:'700', fontSize:14, flex:1 },
  starMini:{ flexDirection:'row', alignItems:'center', gap:3, backgroundColor:'rgba(255,200,87,0.12)', paddingHorizontal:6, paddingVertical:2, borderRadius:10 },
  starMiniText:{ color:theme.colors.star, fontSize:11, fontWeight:'700' },
  repoMiniDesc:{ color:theme.colors.textSecondary, fontSize:12, marginTop:6 },
  activityRow:{ flexDirection:'row', alignItems:'center', gap:10 },
  activityIcon:{ width:36, height:36, borderRadius:18, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  activityRepo:{ color:'white', fontWeight:'700', fontSize:13 },
  activityDesc:{ color:theme.colors.textSecondary, fontSize:11, marginTop:2 },
  activityTime:{ color:theme.colors.textTertiary, fontSize:10, fontWeight:'600' },
});
