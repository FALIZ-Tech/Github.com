import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GitHubService } from '../lib/github';
import { theme } from '../lib/theme';

export const FileViewerScreen: React.FC<{ navigation:any, route:any }> = ({ navigation, route }) => {
  const { owner, repo, path, branch } = route.params;
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try {
        const c = await GitHubService.getFileContent(owner, repo, path, branch);
        setContent(c);
      } catch (e:any) {
        setContent(`// Error loading ${path}\n// ${e.message}`);
      } finally { setLoading(false); }
    })();
  },[]);

  const lines = content.split('\n');

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Pressable onPress={()=>navigation.goBack()} style={styles.hBtn}><Ionicons name="chevron-back" size={20} color="white" /></Pressable>
        <View style={{flex:1}}><Text style={styles.path} numberOfLines={1}>{path}</Text><Text style={styles.branch}>on {branch}</Text></View>
        <Pressable onPress={()=>Share.share({ message: content })} style={styles.hBtn}><Ionicons name="share-outline" size={18} color="white" /></Pressable>
        <Pressable onPress={()=>navigation.navigate('CodeEditor', { owner, repo, path, branch, content })} style={styles.editBtn}><Ionicons name="create-outline" size={16} color="white" /><Text style={styles.editText}>Edit</Text></Pressable>
      </View>

      <View style={styles.toolbar}>
        <Pressable onPress={()=>{ /* copy */ Alert.alert('Copied', 'File content copied (demo)') }} style={styles.tBtn}><Ionicons name="copy-outline" size={14} color={theme.colors.textSecondary} /><Text style={styles.tText}>Copy</Text></Pressable>
        <Pressable style={styles.tBtn}><Ionicons name="search-outline" size={14} color={theme.colors.textSecondary} /><Text style={styles.tText}>Find</Text></Pressable>
        <Text style={styles.linesMeta}>{lines.length} lines • {content.length} chars</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom:40 }}>
        {loading ? <GlassCard><Text style={{ color:theme.colors.textSecondary }}>Loading file...</Text></GlassCard> : (
          <View style={styles.codeWrap}>
            {lines.slice(0,400).map((line,i)=>(
              <View key={i} style={styles.lineRow}>
                <Text style={styles.lineNo}>{i+1}</Text>
                <Text style={styles.lineText} selectable>{highlightLine(line)}</Text>
              </View>
            ))}
            {lines.length>400 && <Text style={{ color:theme.colors.textTertiary, marginTop:12, textAlign:'center' }}>+ {lines.length-400} more lines (virtualized in production)</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

function highlightLine(line:string): string { return line; }

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ flexDirection:'row', alignItems:'center', gap:10, paddingTop:50, paddingHorizontal:16, paddingBottom:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  hBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  path:{ color:'white', fontWeight:'700', fontSize:13 },
  branch:{ color:theme.colors.textTertiary, fontSize:11, marginTop:2 },
  editBtn:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(0,209,255,0.15)', borderWidth:1, borderColor:'rgba(0,209,255,0.3)', paddingHorizontal:12, paddingVertical:6, borderRadius:20 },
  editText:{ color:'white', fontWeight:'800', fontSize:12 },
  toolbar:{ flexDirection:'row', alignItems:'center', gap:8, padding:12 },
  tBtn:{ flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'rgba(255,255,255,0.06)', paddingHorizontal:10, paddingVertical:6, borderRadius:12, borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  tText:{ color:theme.colors.textSecondary, fontSize:11, fontWeight:'600' },
  linesMeta:{ marginLeft:'auto', color:theme.colors.textTertiary, fontSize:11, fontWeight:'600' },
  scroll:{ flex:1 },
  codeWrap:{ backgroundColor:'rgba(10,16,32,0.8)', marginHorizontal:16, borderRadius:14, borderWidth:1, borderColor:'rgba(255,255,255,0.06)', padding:12 },
  lineRow:{ flexDirection:'row', gap:12 },
  lineNo:{ color:'rgba(255,255,255,0.25)', fontSize:11, width:36, textAlign:'right', fontFamily:'monospace' },
  lineText:{ color:'#C9D1D9', fontSize:12, fontFamily:'monospace', flex:1, lineHeight:18 },
});
