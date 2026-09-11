import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { RepoCard } from '../components/RepoCard';
import { SkeletonCard } from '../components/Skeleton';
import { ErrorView } from '../components/ErrorView';
import { GitHubService } from '../lib/github';
import { FavoritesService } from '../lib/favorites';
import { theme } from '../lib/theme';

export const RepositoriesScreen: React.FC<{ navigation:any }> = ({ navigation }) => {
  const [repos, setRepos] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'updated'|'stars'|'name'>('updated');
  const [filter, setFilter] = useState<'all'|'public'|'private'|'favorites'>('all');
  const [favs, setFavs] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const load = useCallback(async (p=1, append=false) => {
    try {
      if (!append) setLoading(true);
      setError(null);
      const data = await GitHubService.getRepos({ page:p, per_page:20, sort });
      const favsList = await FavoritesService.get();
      setFavs(favsList);
      if (append) {
        setRepos(prev => [...prev, ...data]);
      } else {
        setRepos(data);
      }
      setPage(p);
    } catch (e:any) {
      setError(e);
    } finally { setLoading(false); setRefreshing(false); }
  }, [sort]);

  useEffect(()=>{ load(1,false); },[sort]);

  useEffect(()=>{
    let result = [...repos];
    if (search) {
      result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter==='public') result = result.filter(r=>!r.private);
    if (filter==='private') result = result.filter(r=>r.private);
    if (filter==='favorites') result = result.filter(r=>favs.includes(r.id));
    if (sort==='stars') result.sort((a,b)=>b.stargazers_count-a.stargazers_count);
    if (sort==='name') result.sort((a,b)=>a.name.localeCompare(b.name));
    setFiltered(result);
  },[repos, search, filter, favs, sort]);

  const onRefresh = () => { setRefreshing(true); load(1,false); };
  const loadMore = () => { if (repos.length >= 20) load(page+1,true); };

  const toggleFav = async (id:number) => {
    const newFavs = await FavoritesService.toggle(id);
    setFavs(newFavs);
  };

  if (loading && repos.length===0) {
    return (
      <View style={styles.container}><LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} /><View style={{ padding:20, paddingTop:60 }}>{[1,2,3,4].map(i=><SkeletonCard key={i} />)}</View></View>
    );
  }

  if (error && repos.length===0) {
    return (
      <View style={styles.container}><LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} /><View style={{ paddingTop:100 }}><ErrorView message={error.message} type={error.type} onRetry={()=>load(1,false)} /></View></View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Text style={styles.title}>REPOSITORIES</Text>
        <Text style={styles.count}>{filtered.length} items • {favs.length} favorites</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}><Ionicons name="search" size={18} color={theme.colors.textTertiary} /><TextInput value={search} onChangeText={setSearch} placeholder="Search repos, topics..." placeholderTextColor={theme.colors.textTertiary} style={styles.input} /></View>
        <Pressable onPress={()=>navigation.navigate('Search')} style={styles.filterBtn}><Ionicons name="globe-outline" size={18} color="white" /></Pressable>
      </View>

      <View style={styles.chipsRow}>
        <ScrollChips options={[{label:'All',value:'all'},{label:'Public',value:'public'},{label:'Private',value:'private'},{label:'★ Fav',value:'favorites'}]} selected={filter} onSelect={setFilter as any} />
      </View>
      <View style={styles.sortRow}>
        {(['updated','stars','name'] as const).map(s=>(
          <Pressable key={s} onPress={()=>setSort(s)} style={[styles.sortChip, sort===s && styles.sortActive]}><Text style={[styles.sortText, sort===s && {color:'white'}]}>{s.toUpperCase()}</Text></Pressable>
        ))}
        <View style={{ flex:1 }} /><Pressable onPress={onRefresh} style={styles.sortChip}><Ionicons name="refresh" size={14} color={theme.colors.textSecondary} /></Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item)=>String(item.id)}
        renderItem={({item})=> <RepoCard repo={item} onPress={()=>navigation.navigate('RepoDetails',{repo:item})} isFav={favs.includes(item.id)} onToggleFav={()=>toggleFav(item.id)} />}
        contentContainerStyle={{ padding:16, paddingBottom:100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D1FF" />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<GlassCard style={{ marginTop:20 }}><Text style={{ color:theme.colors.textSecondary, textAlign:'center' }}>No repositories found.</Text></GlassCard>}
      />
    </View>
  );
};

const ScrollChips: React.FC<{ options:{label:string,value:string}[], selected:string, onSelect:(v:string)=>void }> = ({ options, selected, onSelect }) => (
  <View style={{ flexDirection:'row', gap:8 }}>{options.map(o=><Pressable key={o.value} onPress={()=>onSelect(o.value)} style={[chipStyles.chip, selected===o.value && chipStyles.active]}><Text style={[chipStyles.text, selected===o.value && {color:'white'}]}>{o.label}</Text></Pressable>)}</View>
);

const chipStyles = StyleSheet.create({
  chip:{ paddingHorizontal:14, paddingVertical:7, borderRadius:20, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  active:{ backgroundColor:'rgba(0,209,255,0.18)', borderColor:'rgba(0,209,255,0.35)' },
  text:{ color:theme.colors.textSecondary, fontSize:12, fontWeight:'700' },
});

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ paddingTop:56, paddingHorizontal:20, paddingBottom:12 },
  title:{ color:'white', fontSize:20, fontWeight:'900', letterSpacing:4 },
  count:{ color:theme.colors.textTertiary, fontSize:11, fontWeight:'700', letterSpacing:1, marginTop:4 },
  searchRow:{ flexDirection:'row', paddingHorizontal:16, gap:10, marginBottom:10 },
  searchBox:{ flex:1, flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:14, paddingHorizontal:12, height:46, gap:8 },
  input:{ flex:1, color:'white', fontSize:14 },
  filterBtn:{ width:46, height:46, borderRadius:14, backgroundColor:'rgba(0,209,255,0.12)', borderWidth:1, borderColor:'rgba(0,209,255,0.25)', alignItems:'center', justifyContent:'center' },
  chipsRow:{ paddingHorizontal:16, marginBottom:10 },
  sortRow:{ flexDirection:'row', gap:8, paddingHorizontal:16, marginBottom:8, alignItems:'center' },
  sortChip:{ paddingHorizontal:12, paddingVertical:6, borderRadius:20, backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  sortActive:{ backgroundColor:'rgba(0,209,255,0.15)', borderColor:'rgba(0,209,255,0.3)' },
  sortText:{ color:theme.colors.textSecondary, fontSize:10, fontWeight:'800', letterSpacing:1 },
});
