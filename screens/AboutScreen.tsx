import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { theme } from '../lib/theme';

export const AboutScreen: React.FC<{ navigation:any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}><Pressable onPress={()=>navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={20} color="white" /></Pressable><Text style={styles.title}>ABOUT</Text><View style={{width:36}} /></View>
      <ScrollView contentContainerStyle={{ padding:20, paddingBottom:100 }}>
        <View style={styles.logoSection}>
          <View style={styles.logoWrap}><Image source={require('../assets/icon.png')} style={styles.logo} /><View style={styles.glow} /></View>
          <Text style={styles.appName}>GAMESITEONLINE</Text>
          <Text style={styles.tagline}>GitHub-powered gaming & developer platform</Text>
          <View style={styles.versionChip}><Text style={styles.versionText}>v2.4.0 • Neon Horizon • 2026</Text></View>
        </View>

        <GlassCard glow style={{ marginBottom:12 }}>
          <Text style={styles.section}>OUR MISSION</Text>
          <Text style={styles.body}>GameSiteOnline is a premium, futuristic GitHub client built for developers who love gaming aesthetics. We combine GitHub's power with neon glassmorphism, particle effects, and 60fps performance — all secured via Android Keystore, HTTPS only, least-privilege OAuth.</Text>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.section}>SECURITY & PRIVACY</Text>
          <View style={{ gap:8, marginTop:10 }}>
            <Text style={styles.body}>• No credentials in source code, assets, or logs{'\n'}• Token stored in expo-secure-store (Android Keystore / iOS Keychain){'\n'}• HTTPS only to api.github.com{'\n'}• Least-privilege scopes (repo, read:user){'\n'}• Session expiry & 401 handling{'\n'}• Secure logout wipes vault{'\n'}• Rate limit handling with exponential backoff{'\n'}• No permission bypass — respects actual GitHub ACL</Text>
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.section}>TECH STACK</Text>
          <View style={styles.techGrid}>
            {['React Native','Expo SDK 52','Reanimated 3','Expo SecureStore','Expo Blur','LinearGradient','AsyncStorage','GitHub REST API v2022-11-28'].map(t=><View key={t} style={styles.techChip}><Text style={styles.techText}>{t}</Text></View>)}
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.section}>THIRD-PARTY & ATTRIBUTIONS</Text>
          <Text style={styles.body}>Built with open-source. GitHub API is © GitHub, Inc. This app uses GitHub REST API and respects terms. Icons by Ionicons. Fonts system. Particles custom Reanimated engine.</Text>
          <Pressable onPress={()=>Linking.openURL('https://docs.github.com/en/rest')} style={styles.linkRow}><Ionicons name="open-outline" size={14} color={theme.colors.accent} /><Text style={styles.linkText}>GitHub API Docs</Text></Pressable>
          <Pressable onPress={()=>Linking.openURL('https://github.com/gamesiteonline')} style={styles.linkRow}><Ionicons name="logo-github" size={14} color={theme.colors.accent} /><Text style={styles.linkText}>github.com/gamesiteonline</Text></Pressable>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.section}>PACKAGE & BUILD</Text>
          <View style={{ gap:6 }}>
            <Row k="Package" v="com.gamesiteonline.app" />
            <Row k="Version" v="2.4.0" />
            <Row k="Build" v="Production ready • Signed AAB/APK via EAS" />
            <Row k="Signing" v="Use secure CI secrets, never commit keystore" />
            <Row k="Branding" v="Supplied GameSiteOnline logo used as launcher, splash, header, about" />
          </View>
        </GlassCard>

        <View style={styles.footer}><Text style={styles.footerText}>© 2026 GameSiteOnline • Premium GitHub Gaming Platform • Built with ♡ & neon</Text></View>
      </ScrollView>
    </View>
  );
};

const Row: React.FC<{k:string,v:string}> = ({k,v}) => <View style={rowStyles.row}><Text style={rowStyles.k}>{k}</Text><Text style={rowStyles.v}>{v}</Text></View>;
const rowStyles = StyleSheet.create({ row:{ flexDirection:'row', justifyContent:'space-between', gap:12 }, k:{ color:theme.colors.textTertiary, fontSize:11, fontWeight:'600' }, v:{ color:'white', fontSize:11, fontWeight:'700', flex:1, textAlign:'right' } });

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:50, paddingHorizontal:16, paddingBottom:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  backBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  title:{ color:'white', fontWeight:'900', letterSpacing:4, fontSize:14 },
  logoSection:{ alignItems:'center', marginBottom:20, marginTop:10 },
  logoWrap:{ width:120, height:120, borderRadius:28, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center', overflow:'visible' },
  logo:{ width:100, height:100, borderRadius:20 },
  glow:{ position:'absolute', width:140, height:140, backgroundColor:'rgba(0,209,255,0.12)', borderRadius:50, top:-10, left:-10, zIndex:-1 },
  appName:{ color:'white', fontSize:26, fontWeight:'900', letterSpacing:5, marginTop:16 },
  tagline:{ color:theme.colors.textSecondary, fontSize:12, letterSpacing:1, marginTop:4, fontWeight:'600', textAlign:'center' },
  versionChip:{ backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', paddingHorizontal:14, paddingVertical:6, borderRadius:20, marginTop:12 },
  versionText:{ color:theme.colors.textTertiary, fontSize:10, fontWeight:'700', letterSpacing:1 },
  section:{ color:theme.colors.textTertiary, fontSize:11, fontWeight:'900', letterSpacing:2 },
  body:{ color:theme.colors.textSecondary, fontSize:13, lineHeight:20, marginTop:10 },
  techGrid:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:10 },
  techChip:{ backgroundColor:'rgba(0,209,255,0.1)', borderWidth:1, borderColor:'rgba(0,209,255,0.2)', paddingHorizontal:10, paddingVertical:5, borderRadius:20 },
  techText:{ color:theme.colors.accent, fontSize:11, fontWeight:'700' },
  linkRow:{ flexDirection:'row', alignItems:'center', gap:6, marginTop:10 },
  linkText:{ color:theme.colors.accent, fontSize:12, fontWeight:'700' },
  footer:{ alignItems:'center', marginTop:20 },
  footerText:{ color:theme.colors.textTertiary, fontSize:10, textAlign:'center', lineHeight:14 },
});
