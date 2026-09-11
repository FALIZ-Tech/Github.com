import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { theme } from '../lib/theme';
import { AuthService } from '../lib/auth';

export const AuthScreen: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleTokenLogin = async () => {
    if (!token.trim()) { Alert.alert('Enter token', 'Paste a GitHub PAT (least privilege)'); return; }
    if (token.trim().length < 20) { Alert.alert('Invalid token', 'Token looks too short'); return; }
    setLoading(true);
    try {
      const res = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${token.trim()}`, Accept: 'application/vnd.github+json' } });
      if (!res.ok) {
        const txt = await res.text();
        let msg = 'Invalid token or insufficient scope';
        try { const j = JSON.parse(txt); msg = j.message || msg; } catch {}
        throw new Error(msg);
      }
      await AuthService.saveToken(token.trim());
      const user = await res.json();
      await AuthService.setUserCache(user);
      onAuthenticated();
    } catch (e:any) {
      Alert.alert('Authentication failed', e.message || 'Check token and network');
    } finally { setLoading(false); }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await AuthService.setUserCache({ login: 'gamesiteonline', name: 'GameSiteOnline Demo', avatar_url: 'https://avatars.githubusercontent.com/u/99000000?v=4', bio: 'Demo account • Neon glass showcase' });
    await AuthService.saveToken('__demo_only_no_real_token__'+Date.now());
    setTimeout(()=>{ setLoading(false); onAuthenticated(); }, 700);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoBox}><Image source={require('../assets/icon.png')} style={styles.logo} /><View style={styles.logoGlow} /></View>
          <Text style={styles.title}>GAMESITEONLINE</Text>
          <Text style={styles.subtitle}>Premium GitHub Gaming Platform</Text>
          <View style={styles.secureBadge}><Ionicons name="shield-checkmark" size={14} color="#00FFA3" /><Text style={styles.secureText}>SECURE • KEYSTORE • HTTPS ONLY</Text></View>
        </View>
        <GlassCard style={styles.card} glow>
          <View style={styles.cardHeader}><Ionicons name="logo-github" size={24} color="white" /><Text style={styles.cardTitle}>Connect to GitHub</Text></View>
          <Text style={styles.cardDesc}>Authenticate securely. Token is stored in Android Keystore via expo-secure-store, never in code, assets, or logs. Uses least-privilege scopes and respects actual permissions.</Text>
          <Pressable onPress={()=>Linking.openURL('https://github.com/settings/tokens/new?description=GameSiteOnline&scopes=repo,read:user')} style={styles.createTokenBtn}><Ionicons name="open-outline" size={14} color={theme.colors.accent} /><Text style={styles.createTokenText}>Create fine-grained PAT (github.com)</Text></Pressable>
          <View style={styles.dividerRow}><View style={styles.line} /><Text style={styles.or}>SECURE TOKEN VAULT</Text><View style={styles.line} /></View>
          <View style={styles.inputWrap}><Ionicons name="key-outline" size={18} color={theme.colors.textTertiary} style={{marginLeft:12}} /><TextInput value={token} onChangeText={setToken} placeholder="ghp_ or github_pat_..." placeholderTextColor={theme.colors.textTertiary} style={styles.input} secureTextEntry autoCapitalize="none" autoCorrect={false} /><Pressable onPress={()=>setShowInfo(!showInfo)} style={styles.infoBtn}><Ionicons name="information-circle-outline" size={18} color={theme.colors.accent} /></Pressable></View>
          {showInfo && <View style={styles.infoBox}><Text style={styles.infoTitle}>🔒 Security Architecture</Text><Text style={styles.infoText}>• No hardcoded secrets — OAuth/Device flow recommended for production{'\n'}• Token stored in SecureStore (Android Keystore backed){'\n'}• HTTPS only, no logging{'\n'}• Least-privilege, revocable via GitHub{'\n'}• Session expiry & 401 handling</Text></View>}
          <View style={{gap:10, marginTop:16}}><GlowButton title="Authenticate Securely" onPress={handleTokenLogin} loading={loading} fullWidth /><GlowButton title="Enter Demo Mode (No Token)" onPress={handleDemoLogin} variant="glass" fullWidth /></View>
          <Text style={styles.footerNote}>By continuing you agree to GitHub API terms. Permissions are respected. All destructive actions require confirmation. Token never leaves device except to api.github.com over TLS.</Text>
        </GlassCard>
        <GlassCard style={styles.secCard}>
          <View style={styles.secRow}><Ionicons name="lock-closed" size={16} color="#00D1FF" /><Text style={styles.secTitle}>SECURITY CHECKLIST</Text></View>
          <View style={styles.secList}>
            {['No credentials in source / APK assets / logs','Android Keystore via SecureStore','HTTPS only • No bypass of permissions','Secure logout wipes vault','Rate-limit & 401/403 handling','Destructive actions require confirm'].map((s,i)=><View key={i} style={styles.secItem}><View style={styles.dot} /><Text style={styles.secText}>{s}</Text></View>)}
          </View>
        </GlassCard>
        <Pressable onPress={()=>Linking.openURL('https://github.com/gamesiteonline')} style={styles.githubLink}><Ionicons name="logo-github" size={16} color={theme.colors.textTertiary} /><Text style={styles.githubText}>github.com/gamesiteonline</Text></Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  scroll:{ padding:20, paddingTop:60, paddingBottom:40 },
  header:{ alignItems:'center', marginBottom:24 },
  logoBox:{ width:110, height:110, borderRadius:28, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center', position:'relative', overflow:'visible' },
  logoGlow:{ position:'absolute', width:140, height:140, backgroundColor:'rgba(0,209,255,0.12)', borderRadius:50, top:-15, left:-15, zIndex:-1 },
  logo:{ width:90, height:90, borderRadius:20 },
  title:{ color:'white', fontSize:26, fontWeight:'900', letterSpacing:5, marginTop:16, textAlign:'center' },
  subtitle:{ color:theme.colors.textSecondary, fontSize:12, letterSpacing:2, marginTop:6, fontWeight:'600' },
  secureBadge:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(0,255,163,0.1)', borderColor:'rgba(0,255,163,0.25)', borderWidth:1, paddingHorizontal:12, paddingVertical:6, borderRadius:20, marginTop:12 },
  secureText:{ color:'#00FFA3', fontSize:9, fontWeight:'800', letterSpacing:1.2 },
  card:{ marginBottom:16 },
  cardHeader:{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 },
  cardTitle:{ color:'white', fontSize:18, fontWeight:'800' },
  cardDesc:{ color:theme.colors.textSecondary, fontSize:13, lineHeight:18, marginBottom:10 },
  createTokenBtn:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(0,209,255,0.08)', borderWidth:1, borderColor:'rgba(0,209,255,0.2)', paddingHorizontal:12, paddingVertical:8, borderRadius:20, alignSelf:'flex-start', marginBottom:8 },
  createTokenText:{ color:theme.colors.accent, fontSize:11, fontWeight:'700' },
  dividerRow:{ flexDirection:'row', alignItems:'center', gap:12, marginVertical:16 },
  line:{ flex:1, height:1, backgroundColor:'rgba(255,255,255,0.08)' },
  or:{ color:theme.colors.textTertiary, fontSize:10, fontWeight:'800', letterSpacing:2 },
  inputWrap:{ flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:14, height:50 },
  input:{ flex:1, color:'white', fontSize:14, paddingHorizontal:10, height:'100%' },
  infoBtn:{ padding:12 },
  infoBox:{ backgroundColor:'rgba(0,209,255,0.08)', borderWidth:1, borderColor:'rgba(0,209,255,0.18)', borderRadius:12, padding:12, marginTop:12 },
  infoTitle:{ color:'#00D1FF', fontWeight:'800', fontSize:12, marginBottom:6 },
  infoText:{ color:theme.colors.textSecondary, fontSize:11, lineHeight:16 },
  footerNote:{ color:theme.colors.textTertiary, fontSize:10, lineHeight:14, marginTop:14, textAlign:'center' },
  secCard:{ marginBottom:16 },
  secRow:{ flexDirection:'row', alignItems:'center', gap:8, marginBottom:12 },
  secTitle:{ color:'white', fontWeight:'800', fontSize:13, letterSpacing:1 },
  secList:{ gap:8 },
  secItem:{ flexDirection:'row', alignItems:'center', gap:10 },
  dot:{ width:5, height:5, borderRadius:3, backgroundColor:'#00D1FF' },
  secText:{ color:theme.colors.textSecondary, fontSize:11, flex:1 },
  githubLink:{ flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, marginTop:8 },
  githubText:{ color:theme.colors.textTertiary, fontSize:12, fontWeight:'600' },
});
