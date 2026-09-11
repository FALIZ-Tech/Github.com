import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GitHubService } from '../lib/github';
import { theme } from '../lib/theme';

export const NotificationsScreen: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all'|'unread'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await GitHubService.getNotifications();
      setItems(data.length ? data : require('../lib/mockData').mockNotifications);
    } catch {
      setItems(require('../lib/mockData').mockNotifications);
    } finally { setRefreshing(false); }
  },[]);

  useEffect(()=>{ load(); },[]);

  const iconFor = (type:string) => {
    if (type==='mention') return { icon:'at-outline', color:'#8B5CF6' };
    if (type==='pr') return { icon:'git-pull-request-outline', color:'#00FFA3' };
    if (type==='issue') return { icon:'alert-circle-outline', color:'#FFC857' };
    if (type==='star') return { icon:'star-outline', color:'#FFC857' };
    return { icon:'git-commit-outline', color:'#00D1FF' };
  };

  const filtered = filter==='unread' ? items.filter(i=>i.unread) : items;
  const unreadCount = items.filter(i=>i.unread).length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <View><Text style={styles.title}>NOTIFICATIONS</Text><Text style={styles.sub}>{unreadCount} unread • {items.length} total</Text></View>
        <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>
      </View>

      <View style={styles.filterRow}>
        {(['all','unread'] as const).map(f=>(
          <Pressable key={f} onPress={()=>setFilter(f)} style={[styles.fBtn, filter===f && styles.fActive]}><Text style={[styles.fText, filter===f && {color:'white'}]}>{f.toUpperCase()}</Text></Pressable>
        ))}
        <View style={{ flex:1 }} />
        <Pressable onPress={()=>setItems(prev=>prev.map(p=>({...p, unread:false})))} style={styles.markBtn}><Ionicons name="checkmark-done-outline" size={14} color={theme.colors.textSecondary} /><Text style={styles.markText}>Mark read</Text></Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i=>String(i.id)}
        contentContainerStyle={{ padding:16, paddingBottom:100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{ setRefreshing(true); load(); }} tintColor="#00D1FF" />}
        renderItem={({item})=>{
          const meta = iconFor(item.type);
          return (
            <GlassCard style={{ marginBottom:10, opacity: item.unread ? 1 : 0.75 }} glow={item.unread}>
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: `${meta.color}18`, borderColor: `${meta.color}30` }]}><Ionicons name={meta.icon as any} size={18} color={meta.color} /></View>
                <View style={{ flex:1 }}>
                  <Text style={[styles.itemTitle, item.unread && { color:'white', fontWeight:'800' }]} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.metaRow}><Text style={styles.repo}>{item.repo}</Text><Text style={styles.dot}>•</Text><Text style={styles.time}>{item.time}</Text></View>
                </View>
                {item.unread && <View style={styles.unreadDot} />}
              </View>
            </GlassCard>
          );
        }}
        ListEmptyComponent={<GlassCard><Text style={{ color:theme.colors.textSecondary, textAlign:'center' }}>No notifications.</Text></GlassCard>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ paddingTop:56, paddingHorizontal:20, paddingBottom:12, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end' },
  title:{ color:'white', fontSize:20, fontWeight:'900', letterSpacing:4 },
  sub:{ color:theme.colors.textTertiary, fontSize:11, fontWeight:'700', marginTop:4 },
  badge:{ backgroundColor:'#FF5A5F', width:28, height:28, borderRadius:14, alignItems:'center', justifyContent:'center' },
  badgeText:{ color:'white', fontWeight:'900', fontSize:12 },
  filterRow:{ flexDirection:'row', gap:8, paddingHorizontal:16, marginBottom:8, alignItems:'center' },
  fBtn:{ paddingHorizontal:14, paddingVertical:6, borderRadius:20, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  fActive:{ backgroundColor:'rgba(0,209,255,0.15)', borderColor:'rgba(0,209,255,0.3)' },
  fText:{ color:theme.colors.textSecondary, fontSize:11, fontWeight:'800', letterSpacing:1 },
  markBtn:{ flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:6, borderRadius:20, backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  markText:{ color:theme.colors.textSecondary, fontSize:11, fontWeight:'600' },
  row:{ flexDirection:'row', gap:12, alignItems:'center' },
  iconWrap:{ width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center', borderWidth:1 },
  itemTitle:{ color:theme.colors.textSecondary, fontSize:13, fontWeight:'600', lineHeight:18 },
  metaRow:{ flexDirection:'row', alignItems:'center', gap:6, marginTop:4 },
  repo:{ color:theme.colors.accent, fontSize:11, fontWeight:'700' },
  dot:{ color:theme.colors.textTertiary },
  time:{ color:theme.colors.textTertiary, fontSize:11 },
  unreadDot:{ width:8, height:8, borderRadius:4, backgroundColor:'#00D1FF', shadowColor:'#00D1FF', shadowOpacity:0.8, shadowRadius:6 },
});
