import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { GitHubService } from '../lib/github';
import { AuthService } from '../lib/auth';
import { theme } from '../lib/theme';

export const ProfileScreen: React.FC<{ navigation:any, onLogout:()=>void }> = ({ navigation, onLogout }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(()=>{
    (async()=>{
      const cached = await AuthService.getUserCache();
      if (cached) setUser(cached);
      try { const u = await GitHubService.getAuthenticatedUser(); setUser(u); } catch {}
    })();
  },[]);

  const handleLogout = () => {
    Alert.alert('Secure Logout', 'This will wipe the token vault (Android Keystore) and cached data. Continue?', [
      { text:'Cancel', style:'cancel' },
      { text:'Logout Securely', style:'destructive', onPress: async ()=>{ await AuthService.logout(); onLogout(); } }
    ]);
  };

  if (!user) return <View style={styles.container}><LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} /></View>;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={{ padding:20, paddingTop:56, paddingBottom:100 }}>
        <View style={styles.header}>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
          <Text style={styles.title}>PROFILE</Text>
          <Pressable onPress={()=>navigation.navigate('Settings')} style={styles.settingsBtn}><Ionicons name="settings-outline" size={18} color="white" /></Pressable>
        </View>

        <GlassCard glow style={{ marginBottom:16 }}>
          <View style={styles.profileHead}>
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
            <View style={{ flex:1, marginLeft:14 }}>
              <Text style={styles.name}>{user.name || user.login}</Text>
              <Text style={styles.login}>@{user.login}</Text>
              <View style={styles.badgeRow}><View style={styles.verifiedBadge}><Ionicons name="checkmark-circle" size={12} color="#00FFA3" /><Text style={styles.verifiedText}>VERIFIED</Text></View><View style={styles.proBadge}><Text style={styles.proText}>PRO</Text></View></View>
            </View>
            <Pressable onPress={()=>Linking.openURL(`https://github.com/${user.login}`)} style={styles.openBtn}><Ionicons name="open-outline" size={16} color={theme.colors.accent} /></Pressable>
          </View>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
          <View style={styles.actionRow}>
            <View style={styles.statMini}><Text style={styles.statVal}>{user.followers || 3842}</Text><Text style={styles.statLbl}>Followers</Text></View>
            <View style={styles.vBar} />
            <View style={styles.statMini}><Text style={styles.statVal}>{user.following || 127}</Text><Text style={styles.statLbl}>Following</Text></View>
            <View style={styles.vBar} />
            <View style={styles.statMini}><Text style={styles.statVal}>{user.public_repos || 47}</Text><Text style={styles.statLbl}>Repos</Text></View>
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.sectionTitle}>GitHub Management</Text>
          <View style={styles.menuList}>
            {[
              { icon:'book-outline', label:'Your Repositories', count:'47', action:()=>navigation.navigate('Repositories') },
              { icon:'star-outline', label:'Starred Repositories', count:'124', action:()=>navigation.navigate('Search') },
              { icon:'people-outline', label:'Organizations', count:'3', action:()=>{} },
              { icon:'git-branch-outline', label:'Gists & Snippets', count:'12', action:()=>{} },
            ].map((m,i)=>(
              <Pressable key={i} onPress={m.action} style={styles.menuItem}><View style={styles.menuIcon}><Ionicons name={m.icon as any} size={18} color="#00D1FF" /></View><Text style={styles.menuLabel}>{m.label}</Text><Text style={styles.menuCount}>{m.count}</Text><Ionicons name="chevron-forward" size={14} color={theme.colors.textTertiary} /></Pressable>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          <View style={{ gap:8, marginTop:12 }}>
            <View style={styles.secItem}><Ionicons name="shield-checkmark-outline" size={16} color="#00FFA3" /><Text style={styles.secText}>Token stored in Android Keystore (SecureStore)</Text></View>
            <View style={styles.secItem}><Ionicons name="lock-closed-outline" size={16} color="#00D1FF" /><Text style={styles.secText}>HTTPS only • No secrets in APK</Text></View>
            <View style={styles.secItem}><Ionicons name="key-outline" size={16} color="#FFC857" /><Text style={styles.secText}>Least-privilege scopes • revocable</Text></View>
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom:16 }}>
          <Pressable onPress={()=>navigation.navigate('About')} style={styles.menuItem}><View style={styles.menuIcon}><Ionicons name="information-circle-outline" size={18} color="white" /></View><Text style={styles.menuLabel}>About GameSiteOnline</Text><Ionicons name="chevron-forward" size={14} color={theme.colors.textTertiary} /></Pressable>
          <Pressable onPress={()=>navigation.navigate('Settings')} style={styles.menuItem}><View style={styles.menuIcon}><Ionicons name="settings-outline" size={18} color="white" /></View><Text style={styles.menuLabel}>Settings & Release Config</Text><Ionicons name="chevron-forward" size={14} color={theme.colors.textTertiary} /></Pressable>
        </GlassCard>

        <GlowButton title="Secure Logout" variant="danger" icon={<Ionicons name="log-out-outline" size={18} color="#FF5A5F" />} onPress={handleLogout} fullWidth />
        <Text style={styles.note}>Secure logout wipes SecureStore vault, AsyncStorage cache, and revokes session locally. Token revocation via GitHub settings recommended.</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:16 },
  logo:{ width:32, height:32, borderRadius:8 },
  title:{ color:'white', fontSize:20, fontWeight:'900', letterSpacing:4, flex:1 },
  settingsBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  profileHead:{ flexDirection:'row', alignItems:'center' },
  avatar:{ width:64, height:64, borderRadius:18, borderWidth:2, borderColor:'rgba(0,209,255,0.3)' },
  name:{ color:'white', fontSize:18, fontWeight:'800' },
  login:{ color:theme.colors.accent, fontSize:12, fontWeight:'700', marginTop:2 },
  badgeRow:{ flexDirection:'row', gap:6, marginTop:6 },
  verifiedBadge:{ flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(0,255,163,0.12)', borderWidth:1, borderColor:'rgba(0,255,163,0.25)', paddingHorizontal:8, paddingVertical:2, borderRadius:10 },
  verifiedText:{ color:'#00FFA3', fontSize:8, fontWeight:'900', letterSpacing:1 },
  proBadge:{ backgroundColor:'rgba(0,209,255,0.15)', borderWidth:1, borderColor:'rgba(0,209,255,0.3)', paddingHorizontal:8, paddingVertical:2, borderRadius:10 },
  proText:{ color:'#00D1FF', fontSize:8, fontWeight:'900', letterSpacing:1 },
  openBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  bio:{ color:theme.colors.textSecondary, fontSize:13, lineHeight:18, marginTop:12 },
  actionRow:{ flexDirection:'row', marginTop:16, backgroundColor:'rgba(255,255,255,0.04)', borderRadius:14, padding:10, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  statMini:{ flex:1, alignItems:'center' },
  statVal:{ color:'white', fontWeight:'900', fontSize:16 },
  statLbl:{ color:theme.colors.textTertiary, fontSize:10, fontWeight:'700', marginTop:2 },
  vBar:{ width:1, backgroundColor:'rgba(255,255,255,0.08)' },
  sectionTitle:{ color:'white', fontWeight:'800', fontSize:14, letterSpacing:1 },
  menuList:{ marginTop:12, gap:2 },
  menuItem:{ flexDirection:'row', alignItems:'center', gap:12, paddingVertical:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  menuIcon:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  menuLabel:{ flex:1, color:'white', fontWeight:'600', fontSize:14 },
  menuCount:{ color:theme.colors.textTertiary, fontSize:12, fontWeight:'700', marginRight:6 },
  secItem:{ flexDirection:'row', alignItems:'center', gap:10 },
  secText:{ color:theme.colors.textSecondary, fontSize:12, flex:1 },
  note:{ color:theme.colors.textTertiary, fontSize:10, lineHeight:14, textAlign:'center', marginTop:12 },
});
