import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { theme } from '../lib/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../lib/auth';

export const SettingsScreen: React.FC<{ navigation:any }> = ({ navigation }) => {
  const [bgSync, setBgSync] = useState(true);
  const [imgCache, setImgCache] = useState(true);
  const [tokenMeta, setTokenMeta] = useState<any>(null);

  useEffect(()=>{ (async()=>{ const m=await AuthService.getTokenMeta(); setTokenMeta(m); })(); },[]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}><Pressable onPress={()=>navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={20} color="white" /></Pressable><Text style={styles.title}>SETTINGS</Text><View style={{ width:36 }} /></View>
      <ScrollView contentContainerStyle={{ padding:16, paddingBottom:100 }}>

        <GlassCard glow style={{ marginBottom:12 }}>
          <Text style={styles.section}>SECURITY</Text>
          <View style={styles.list}>
            <View style={styles.row}><View style={styles.iconBox}><Ionicons name="shield-checkmark" size={16} color="#00FFA3" /></View><View style={{flex:1}}><Text style={styles.rowTitle}>Android Keystore Vault</Text><Text style={styles.rowSub}>SecureStore • exp: {tokenMeta ? new Date(tokenMeta.expiresAt).toLocaleDateString() : 'demo'}</Text></View><Ionicons name="checkmark-circle" size={16} color="#00FFA3" /></View>
            <View style={styles.row}><View style={styles.iconBox}><Ionicons name="lock-closed" size={16} color="#00D1FF" /></View><View style={{flex:1}}><Text style={styles.rowTitle}>HTTPS Only • No Log</Text><Text style={styles.rowSub}>All GitHub API over TLS • No token logs</Text></View></View>
            <View style={styles.row}><View style={styles.iconBox}><Ionicons name="key" size={16} color="#FFC857" /></View><View style={{flex:1}}><Text style={styles.rowTitle}>Least-Privilege OAuth</Text><Text style={styles.rowSub}>Scopes: repo, read:user • revocable</Text></View></View>
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.section}>PERFORMANCE</Text>
          <View style={styles.list}>
            <View style={styles.row}><View style={styles.iconBox}><Ionicons name="sync" size={16} color="white" /></View><View style={{flex:1}}><Text style={styles.rowTitle}>Background Sync</Text><Text style={styles.rowSub}>Efficient API • respects rate limit</Text></View><Switch value={bgSync} onValueChange={setBgSync} trackColor={{false:'#333', true:'#00D1FF'}} thumbColor="white" /></View>
            <View style={styles.row}><View style={styles.iconBox}><Ionicons name="image-outline" size={16} color="white" /></View><View style={{flex:1}}><Text style={styles.rowTitle}>Image Caching</Text><Text style={styles.rowSub}>Expo-Image • local non-sensitive cache</Text></View><Switch value={imgCache} onValueChange={setImgCache} trackColor={{false:'#333', true:'#00D1FF'}} thumbColor="white" /></View>
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.section}>RELEASE CONFIG</Text>
          <View style={{ gap:8, marginTop:10 }}>
            <Text style={styles.codeBlock}>{"// app.json\n{\n  \"android\": {\n    \"package\": \"com.gamesiteonline.app\",\n    \"adaptiveIcon\": {\n      \"foregroundImage\": \"./assets/icon.png\"\n    }\n  },\n  \"extra\": {\n    \"GITHUB_CLIENT_ID\": \"env.GITHUB_CLIENT_ID\"\n  }\n}"}</Text>
            <Text style={styles.note}>Signing: Use env vars for keystore\n GAMESITE_KEYSTORE_PATH\n GAMESITE_KEYSTORE_PASSWORD\n GAMESITE_KEY_ALIAS\n GAMESITE_KEY_PASSWORD\nNever commit keystore or passwords. Use EAS Build secrets or CI env.</Text>
            <Pressable onPress={()=>Linking.openURL('https://docs.expo.dev/build/setup/')} style={styles.linkBtn}><Ionicons name="open-outline" size={14} color={theme.colors.accent} /><Text style={styles.linkText}>Expo EAS Signing Docs</Text></Pressable>
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom:12 }}>
          <Text style={styles.section}>ABOUT BUILD</Text>
          <View style={{ gap:6, marginTop:10 }}>
            {[
              ['Package','com.gamesiteonline.app'],
              ['Version','2.4.0 (build 240)'],
              ['Target SDK','Android 14 (34)'],
              ['Min SDK','23'],
              ['Theme','Dark • Edge-to-edge'],
              ['GitHub API','v2022-11-28'],
              ['Security','Keystore + HTTPS'],
            ].map(([k,v],i)=><View key={i} style={styles.kv}><Text style={styles.k}>{k}</Text><Text style={styles.v}>{v}</Text></View>)}
          </View>
        </GlassCard>

        <GlassCard>
          <Pressable onPress={async()=>{ await AsyncStorage.clear(); alert('Cache cleared (safe non-sensitive data only)'); }} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={18} color="#FF5A5F" /><Text style={styles.clearText}>Clear Local Cache (safe)</Text>
          </Pressable>
        </GlassCard>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:50, paddingHorizontal:16, paddingBottom:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  backBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  title:{ color:'white', fontWeight:'900', letterSpacing:4, fontSize:14 },
  section:{ color:theme.colors.textTertiary, fontSize:11, fontWeight:'900', letterSpacing:2 },
  list:{ marginTop:10 },
  row:{ flexDirection:'row', alignItems:'center', gap:12, paddingVertical:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  iconBox:{ width:32, height:32, borderRadius:16, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  rowTitle:{ color:'white', fontWeight:'700', fontSize:13 },
  rowSub:{ color:theme.colors.textTertiary, fontSize:11, marginTop:2 },
  codeBlock:{ backgroundColor:'rgba(0,0,0,0.4)', color:theme.colors.textSecondary, fontFamily:'monospace', fontSize:11, padding:12, borderRadius:12, lineHeight:16, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  note:{ color:theme.colors.textTertiary, fontSize:10, lineHeight:14 },
  linkBtn:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(0,209,255,0.08)', borderWidth:1, borderColor:'rgba(0,209,255,0.2)', paddingHorizontal:12, paddingVertical:8, borderRadius:20, alignSelf:'flex-start' },
  linkText:{ color:theme.colors.accent, fontSize:11, fontWeight:'700' },
  kv:{ flexDirection:'row', justifyContent:'space-between' },
  k:{ color:theme.colors.textTertiary, fontSize:11, fontWeight:'600' },
  v:{ color:'white', fontSize:11, fontWeight:'700' },
  clearBtn:{ flexDirection:'row', alignItems:'center', gap:10, justifyContent:'center', paddingVertical:8 },
  clearText:{ color:'#FF5A5F', fontWeight:'700', fontSize:13 },
});
