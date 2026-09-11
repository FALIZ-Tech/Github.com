import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GitHubService } from '../lib/github';
import { theme } from '../lib/theme';

type SearchType = 'repositories' | 'users' | 'issues';

export const SearchScreen: React.FC<{ navigation:any }> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<SearchType>('repositories');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQ, setDebouncedQ] = useState('');

  useEffect(()=>{
    const t = setTimeout(()=>setDebouncedQ(query), 500);
    return ()=>clearTimeout(t);
  },[query]);

  useEffect(()=>{
    if (!debouncedQ) { setResults([]); return; }
    (async()=>{
      setLoading(true);
      try {
        if (type==='repositories') {
          const r = await GitHubService.searchRepos(debouncedQ);
          setResults(r.items || []);
        } else if (type==='users') {
          const r = await GitHubService.searchUsers(debouncedQ);
          setResults(r.items || []);
        } else {
          const r = await GitHubService.searchIssues(debouncedQ);
          setResults(r.items || []);
        }
      } catch { setResults([]); }
      finally { setLoading(false); }
    })();
  },[debouncedQ, type]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Pressable onPress={()=>navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={20} color="white" /></Pressable>
        <Text style={styles.title}>GLOBAL SEARCH</Text>
        <View style={{ width:36 }} />
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}><Ionicons name="search" size={18} color={theme.colors.textTertiary} /><TextInput value={query} onChangeText={setQuery} placeholder={`Search ${type}...`} placeholderTextColor={theme.colors.textTertiary} style={styles.input} autoFocus returnKeyType="search" /><Pressable onPress={()=>setQuery('')} style={styles.clearBtn}><Ionicons name="close-circle" size={16} color={theme.colors.textTertiary} /></Pressable></View>
        <View style={styles.typeRow}>{(['repositories','users','issues'] as SearchType[]).map(t=><Pressable key={t} onPress={()=>setType(t)} style={[styles.typeBtn, type===t && styles.typeActive]}><Ionicons name={t==='repositories' ? 'book-outline' : t==='users' ? 'people-outline' : 'alert-circle-outline'} size={14} color={type===t?'white':theme.colors.textSecondary} /><Text style={[styles.typeText, type===t && {color:'white'}]}>{t.toUpperCase()}</Text></Pressable>)}</View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item,i)=>String(item.id||i)}
        contentContainerStyle={{ padding:16, paddingBottom:100 }}
        ListHeaderComponent={loading ? <Text style={{ color:theme.colors.textTertiary, textAlign:'center', marginBottom:8 }}>Searching GitHub API...</Text> : (debouncedQ ? <Text style={{ color:theme.colors.textTertiary, fontSize:11, marginBottom:8 }}>{results.length} results for "{debouncedQ}"</Text> : <GlassCard><View style={styles.empty}><Ionicons name="search-outline" size={32} color={theme.colors.textTertiary} /><Text style={styles.emptyTitle}>Search GitHub</Text><Text style={styles.emptyDesc}>Debounced search for repos, users, issues, PRs. Respects rate limits. Try: gaming, neon, react-native</Text><View style={styles.suggests}>{['gamesite', 'neon-glass', 'react-native', 'github-api'].map(s=><Pressable key={s} onPress={()=>setQuery(s)} style={styles.suggestChip}><Text style={styles.suggestText}>{s}</Text></Pressable>)}</View></View></GlassCard>)}
        renderItem={({item})=>{
          if (type==='repositories') {
            return (
              <Pressable onPress={()=>navigation.navigate('RepoDetails',{repo:item})}><GlassCard style={{ marginBottom:10 }}><View style={styles.repoRow}><Ionicons name="book-outline" size={16} color={theme.colors.accent} /><Text style={styles.repoName} numberOfLines={1}>{item.full_name || item.name}</Text></View><Text style={styles.repoDesc} numberOfLines={2}>{item.description}</Text><View style={styles.repoMeta}><View style={styles.metaPill}><Ionicons name="star" size={10} color={theme.colors.star} /><Text style={styles.metaTxt}>{item.stargazers_count}</Text></View><Text style={styles.lang}>{item.language}</Text></View></GlassCard></Pressable>
            );
          }
          if (type==='users') {
            return (
              <GlassCard style={{ marginBottom:10 }}><View style={styles.userRow}><View style={styles.userAvatarPlaceholder}><Ionicons name="person" size={16} color="white" /></View><View style={{flex:1}}><Text style={styles.repoName}>{item.login}</Text><Text style={styles.repoDesc}>GitHub User • gamesiteonline org</Text></View><Ionicons name="open-outline" size={16} color={theme.colors.textTertiary} /></View></GlassCard>
            );
          }
          return (
            <GlassCard style={{ marginBottom:10 }}><Text style={styles.repoName} numberOfLines={2}>#{item.number} {item.title}</Text><Text style={styles.repoDesc} numberOfLines={2}>{item.state} • comments {item.comments}</Text></GlassCard>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingTop:50, paddingHorizontal:16, paddingBottom:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  backBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  title:{ color:'white', fontWeight:'900', letterSpacing:3, fontSize:14 },
  searchWrap:{ padding:16, gap:12 },
  searchBox:{ flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.08)', borderWidth:1, borderColor:'rgba(255,255,255,0.12)', borderRadius:14, paddingHorizontal:12, height:50, gap:8 },
  input:{ flex:1, color:'white', fontSize:14 },
  clearBtn:{ padding:4 },
  typeRow:{ flexDirection:'row', gap:8 },
  typeBtn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:7, borderRadius:20, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', flex:1, justifyContent:'center' },
  typeActive:{ backgroundColor:'rgba(0,209,255,0.18)', borderColor:'rgba(0,209,255,0.35)' },
  typeText:{ color:theme.colors.textSecondary, fontSize:10, fontWeight:'800', letterSpacing:0.5 },
  empty:{ alignItems:'center', paddingVertical:20 },
  emptyTitle:{ color:'white', fontWeight:'800', fontSize:16, marginTop:12 },
  emptyDesc:{ color:theme.colors.textSecondary, fontSize:12, textAlign:'center', marginTop:8, lineHeight:18 },
  suggests:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:12, justifyContent:'center' },
  suggestChip:{ backgroundColor:'rgba(0,209,255,0.12)', borderWidth:1, borderColor:'rgba(0,209,255,0.25)', paddingHorizontal:10, paddingVertical:5, borderRadius:20 },
  suggestText:{ color:theme.colors.accent, fontSize:11, fontWeight:'700' },
  repoRow:{ flexDirection:'row', alignItems:'center', gap:8 },
  repoName:{ color:'white', fontWeight:'700', fontSize:13, flex:1 },
  repoDesc:{ color:theme.colors.textSecondary, fontSize:12, marginTop:4, lineHeight:16 },
  repoMeta:{ flexDirection:'row', gap:10, marginTop:8, alignItems:'center' },
  metaPill:{ flexDirection:'row', alignItems:'center', gap:3, backgroundColor:'rgba(255,200,87,0.12)', paddingHorizontal:6, paddingVertical:2, borderRadius:10 },
  metaTxt:{ color:theme.colors.star, fontSize:10, fontWeight:'700' },
  lang:{ color:theme.colors.textTertiary, fontSize:11 },
  userRow:{ flexDirection:'row', alignItems:'center', gap:12 },
  userAvatarPlaceholder:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(0,209,255,0.2)', alignItems:'center', justifyContent:'center' },
});
