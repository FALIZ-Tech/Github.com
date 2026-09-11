import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { theme } from '../lib/theme';

const langColors: Record<string,string> = { TypeScript:'#2B7489', JavaScript:'#F1E05A', Rust:'#DEA584', Go:'#00ADD8', Python:'#3572A5', 'C++':'#F34B7D' };

export const RepoCard: React.FC<{ repo:any, onPress:()=>void, isFav?:boolean, onToggleFav?:()=>void }> = ({ repo, onPress, isFav, onToggleFav }) => (
  <Pressable onPress={onPress} style={({pressed})=>[pressed&&{transform:[{scale:0.98}], opacity:0.9}]}>
    <GlassCard glow style={styles.card}>
      <View style={styles.header}>
        <View style={{flex:1}}>
          <View style={styles.titleRow}>
            <Ionicons name={repo.private ? 'lock-closed' : 'book-outline'} size={16} color={theme.colors.textSecondary} />
            <Text style={styles.name} numberOfLines={1}>{repo.name}</Text>
            <View style={[styles.privBadge,{backgroundColor: repo.private?'rgba(255,90,95,0.15)':'rgba(0,255,163,0.15)'}]}><Text style={[styles.privText,{color: repo.private?'#FF5A5F':'#00FFA3'}]}>{repo.private?'Private':'Public'}</Text></View>
          </View>
          <Text style={styles.desc} numberOfLines={2}>{repo.description}</Text>
        </View>
        {onToggleFav && <Pressable onPress={onToggleFav} style={styles.favBtn}><Ionicons name={isFav?'star':'star-outline'} size={18} color={isFav?theme.colors.star:theme.colors.textTertiary} /></Pressable>}
      </View>
      <View style={styles.topicsRow}>{repo.topics?.slice(0,3).map((t:string)=><View key={t} style={styles.topic}><Text style={styles.topicText}>{t}</Text></View>)}</View>
      <View style={styles.stats}>
        <View style={styles.stat}><View style={[styles.dot,{backgroundColor:langColors[repo.language]||'#8B949E'}]} /><Text style={styles.statText}>{repo.language}</Text></View>
        <View style={styles.stat}><Ionicons name="star" size={14} color={theme.colors.star} /><Text style={styles.statText}>{repo.stargazers_count}</Text></View>
        <View style={styles.stat}><Ionicons name="git-network-outline" size={14} color={theme.colors.textSecondary} /><Text style={styles.statText}>{repo.forks_count}</Text></View>
        <View style={styles.stat}><Ionicons name="alert-circle-outline" size={14} color={theme.colors.textSecondary} /><Text style={styles.statText}>{repo.open_issues_count}</Text></View>
        <Text style={styles.updated}>Updated {formatRelative(repo.updated_at)}</Text>
      </View>
    </GlassCard>
  </Pressable>
);

function formatRelative(iso:string){ const diff=Date.now()-new Date(iso).getTime(); const mins=Math.floor(diff/60000); if(mins<60) return `${mins}m ago`; const hrs=Math.floor(mins/60); if(hrs<24) return `${hrs}h ago`; return `${Math.floor(hrs/24)}d ago`; }

const styles = StyleSheet.create({
  card:{ marginBottom:12 },
  header:{ flexDirection:'row', alignItems:'flex-start' },
  titleRow:{ flexDirection:'row', alignItems:'center', gap:6, marginBottom:6 },
  name:{ color:theme.colors.accent, fontWeight:'700', fontSize:16, flexShrink:1 },
  privBadge:{ paddingHorizontal:8, paddingVertical:2, borderRadius:20, marginLeft:6 },
  privText:{ fontSize:10, fontWeight:'700', textTransform:'uppercase', letterSpacing:0.5 },
  desc:{ color:theme.colors.textSecondary, fontSize:13, lineHeight:18 },
  favBtn:{ padding:6, marginLeft:8, backgroundColor:'rgba(255,255,255,0.06)', borderRadius:20 },
  topicsRow:{ flexDirection:'row', gap:6, marginTop:10, flexWrap:'wrap' },
  topic:{ backgroundColor:'rgba(0,209,255,0.12)', borderColor:'rgba(0,209,255,0.25)', borderWidth:1, paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  topicText:{ color:theme.colors.accent, fontSize:11, fontWeight:'600' },
  stats:{ flexDirection:'row', alignItems:'center', marginTop:12, gap:12, flexWrap:'wrap' },
  stat:{ flexDirection:'row', alignItems:'center', gap:4 },
  dot:{ width:10, height:10, borderRadius:5 },
  statText:{ color:theme.colors.textSecondary, fontSize:12, fontWeight:'600' },
  updated:{ color:theme.colors.textTertiary, fontSize:11, marginLeft:'auto' },
});
