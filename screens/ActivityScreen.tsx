import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { theme } from '../lib/theme';
import { GitHubService } from '../lib/github';

export const ActivityScreen: React.FC<{ navigation:any }> = ({ navigation }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const a = await GitHubService.getRecentActivity();
    setActivities(a);
    setRefreshing(false);
  };
  useEffect(()=>{ load(); },[]);

  const iconFor = (t:string) => {
    if (t==='PushEvent') return 'git-commit-outline';
    if (t==='StarEvent') return 'star-outline';
    if (t==='CreateEvent') return 'git-branch-outline';
    if (t==='IssuesEvent') return 'alert-circle-outline';
    return 'git-pull-request-outline';
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}><Text style={styles.title}>ACTIVITY</Text><View style={styles.live}><View style={styles.dot} /><Text style={styles.liveText}>LIVE STREAM</Text></View></View>
      <ScrollView contentContainerStyle={{ padding:16, paddingBottom:100 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true); load();}} tintColor="#00D1FF" />}>
        <GlassCard glow style={{ marginBottom:16 }}>
          <View style={styles.statsRow}>
            <View style={styles.stat}><Text style={styles.statVal}>147</Text><Text style={styles.statLbl}>Commits week</Text></View>
            <View style={styles.divider} />
            <View style={styles.stat}><Text style={styles.statVal}>23</Text><Text style={styles.statLbl}>PRs opened</Text></View>
            <View style={styles.divider} />
            <View style={styles.stat}><Text style={styles.statVal}>89</Text><Text style={styles.statLbl}>Issues triaged</Text></View>
          </View>
        </GlassCard>
        {activities.map((a,i)=>(
          <GlassCard key={i} style={{ marginBottom:10 }}>
            <View style={styles.row}>
              <View style={styles.iconWrap}><Ionicons name={iconFor(a.type) as any} size={18} color="#00D1FF" /></View>
              <View style={{ flex:1 }}>
                <Text style={styles.repo}>{a.repo}</Text>
                <Text style={styles.desc}>{a.description}</Text>
                <View style={styles.timeRow}><Ionicons name="time-outline" size={12} color={theme.colors.textTertiary} /><Text style={styles.time}>{a.time}</Text></View>
              </View>
              <View style={styles.typeBadge}><Text style={styles.typeText}>{a.type.replace('Event','')}</Text></View>
            </View>
          </GlassCard>
        ))}
        <GlassCard><Text style={{ color:theme.colors.textSecondary, fontSize:12, textAlign:'center' }}>End of activity feed • Background sync enabled</Text></GlassCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ paddingTop:56, paddingHorizontal:20, paddingBottom:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  title:{ color:'white', fontSize:20, fontWeight:'900', letterSpacing:4 },
  live:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(0,255,163,0.12)', borderWidth:1, borderColor:'rgba(0,255,163,0.25)', paddingHorizontal:10, paddingVertical:4, borderRadius:12 },
  dot:{ width:6, height:6, borderRadius:3, backgroundColor:'#00FFA3' },
  liveText:{ color:'#00FFA3', fontSize:9, fontWeight:'900', letterSpacing:1 },
  statsRow:{ flexDirection:'row', alignItems:'center' },
  stat:{ flex:1, alignItems:'center' },
  statVal:{ color:'white', fontWeight:'900', fontSize:18 },
  statLbl:{ color:theme.colors.textTertiary, fontSize:10, fontWeight:'700', marginTop:2 },
  divider:{ width:1, height:30, backgroundColor:'rgba(255,255,255,0.08)' },
  row:{ flexDirection:'row', gap:12, alignItems:'flex-start' },
  iconWrap:{ width:40, height:40, borderRadius:20, backgroundColor:'rgba(0,209,255,0.12)', borderWidth:1, borderColor:'rgba(0,209,255,0.2)', alignItems:'center', justifyContent:'center' },
  repo:{ color:'white', fontWeight:'700', fontSize:13 },
  desc:{ color:theme.colors.textSecondary, fontSize:12, marginTop:2 },
  timeRow:{ flexDirection:'row', alignItems:'center', gap:4, marginTop:6 },
  time:{ color:theme.colors.textTertiary, fontSize:10 },
  typeBadge:{ backgroundColor:'rgba(255,255,255,0.06)', paddingHorizontal:8, paddingVertical:3, borderRadius:10, borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  typeText:{ color:theme.colors.textTertiary, fontSize:9, fontWeight:'800' },
});
