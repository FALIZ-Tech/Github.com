import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GitHubService } from '../lib/github';
import { theme } from '../lib/theme';

type TabType = 'overview' | 'code' | 'commits' | 'branches' | 'issues' | 'prs' | 'releases';

export const RepoDetailsScreen: React.FC<{ navigation:any, route:any }> = ({ navigation, route }) => {
  const { repo } = route.params;
  const [tab, setTab] = useState<TabType>('overview');
  const [details, setDetails] = useState<any>(repo);
  const [files, setFiles] = useState<any[]>([]);
  const [pathStack, setPathStack] = useState<string[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [prs, setPrs] = useState<any[]>([]);
  const [releases, setReleases] = useState<any[]>([]);
  const [currentBranch, setCurrentBranch] = useState(repo.default_branch || 'main');

  useEffect(()=>{
    (async()=>{
      try {
        const d = await GitHubService.getRepo(repo.full_name.split('/')[0], repo.name);
        setDetails(d);
      } catch {}
      loadTab('overview');
    })();
  },[]);

  const loadTab = async (t:TabType) => {
    setTab(t);
    const owner = repo.full_name.split('/')[0];
    const name = repo.name;
    if (t==='code') {
      const curPath = pathStack.join('/');
      const f = await GitHubService.getContents(owner, name, curPath, currentBranch);
      setFiles(Array.isArray(f) ? f : []);
    }
    if (t==='commits') {
      const c = await GitHubService.getCommits(owner, name, currentBranch);
      setCommits(c);
    }
    if (t==='branches') {
      const b = await GitHubService.getBranches(owner, name);
      setBranches(b);
    }
    if (t==='issues') {
      const is = await GitHubService.getIssues(owner, name);
      setIssues(is);
    }
    if (t==='prs') {
      const p = await GitHubService.getPulls(owner, name);
      setPrs(p);
    }
    if (t==='releases') {
      const r = await GitHubService.getReleases(owner, name);
      setReleases(r);
    }
  };

  const currentPath = pathStack.join('/');

  const openPath = async (item:any) => {
    if (item.type==='dir') {
      const newStack = [...pathStack, item.name];
      setPathStack(newStack);
      const owner = repo.full_name.split('/')[0];
      const f = await GitHubService.getContents(owner, repo.name, newStack.join('/'), currentBranch);
      setFiles(Array.isArray(f) ? f : []);
    } else {
      navigation.navigate('FileViewer', { owner: repo.full_name.split('/')[0], repo: repo.name, path: item.path, branch: currentBranch, file: item });
    }
  };

  const goBackPath = async () => {
    const newStack = pathStack.slice(0,-1);
    setPathStack(newStack);
    const owner = repo.full_name.split('/')[0];
    const f = await GitHubService.getContents(owner, repo.name, newStack.join('/'), currentBranch);
    setFiles(Array.isArray(f) ? f : []);
  };

  const tabs: { key:TabType, label:string, icon:string }[] = [
    { key:'overview', label:'Overview', icon:'information-circle-outline' },
    { key:'code', label:'Code', icon:'code-slash-outline' },
    { key:'commits', label:'Commits', icon:'git-commit-outline' },
    { key:'branches', label:'Branches', icon:'git-branch-outline' },
    { key:'issues', label:'Issues', icon:'alert-circle-outline' },
    { key:'prs', label:'PRs', icon:'git-pull-request-outline' },
    { key:'releases', label:'Releases', icon:'pricetag-outline' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Pressable onPress={()=>navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={20} color="white" /></Pressable>
        <View style={{ flex:1 }}>
          <View style={styles.repoTitleRow}><Ionicons name={details.private ? 'lock-closed' : 'book'} size={16} color={theme.colors.accent} /><Text style={styles.repoName} numberOfLines={1}>{details.full_name || repo.full_name}</Text></View>
          <Text style={styles.branchLabel}>on {currentBranch} • {currentPath || '/'}</Text>
        </View>
        <Pressable style={styles.starBtn}><Ionicons name="star-outline" size={18} color={theme.colors.star} /><Text style={styles.starText}>{details.stargazers_count}</Text></Pressable>
      </View>

      <View style={styles.tabsScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:8, paddingHorizontal:16 }}>
          {tabs.map(t=>(
            <Pressable key={t.key} onPress={()=>loadTab(t.key)} style={[styles.tabBtn, tab===t.key && styles.tabActive]}><Ionicons name={t.icon as any} size={14} color={tab===t.key?'white':theme.colors.textSecondary} /><Text style={[styles.tabText, tab===t.key && {color:'white'}]}>{t.label}</Text></Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding:16, paddingBottom:100 }}>
        {tab==='overview' && (
          <>
            <GlassCard glow style={{ marginBottom:12 }}>
              <Text style={styles.desc}>{details.description}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statPill}><Ionicons name="star" size={12} color={theme.colors.star} /><Text style={styles.statTxt}>{details.stargazers_count} stars</Text></View>
                <View style={styles.statPill}><Ionicons name="git-network-outline" size={12} color={theme.colors.textSecondary} /><Text style={styles.statTxt}>{details.forks_count} forks</Text></View>
                <View style={styles.statPill}><Ionicons name="eye-outline" size={12} color={theme.colors.textSecondary} /><Text style={styles.statTxt}>{details.watchers_count} watchers</Text></View>
                <View style={styles.statPill}><Ionicons name="alert-circle-outline" size={12} color={theme.colors.textSecondary} /><Text style={styles.statTxt}>{details.open_issues_count} issues</Text></View>
              </View>
              <View style={styles.metaGrid}>
                <View style={styles.metaItem}><Text style={styles.metaKey}>License</Text><Text style={styles.metaVal}>{details.license?.name || 'MIT'}</Text></View>
                <View style={styles.metaItem}><Text style={styles.metaKey}>Default Branch</Text><Text style={styles.metaVal}>{details.default_branch}</Text></View>
                <View style={styles.metaItem}><Text style={styles.metaKey}>Language</Text><Text style={styles.metaVal}>{details.language}</Text></View>
                <View style={styles.metaItem}><Text style={styles.metaKey}>Updated</Text><Text style={styles.metaVal}>{new Date(details.updated_at).toLocaleDateString()}</Text></View>
              </View>
              {details.topics?.length>0 && <View style={styles.topics}><Text style={styles.topicsTitle}>TOPICS</Text><View style={styles.topicRow}>{details.topics.map((t:string)=><View key={t} style={styles.topicChip}><Text style={styles.topicTxt}>{t}</Text></View>)}</View></View>}
            </GlassCard>
            <GlassCard><Text style={{ color:theme.colors.textSecondary, fontSize:12, textAlign:'center' }}>GitHub API • Secure token • No permission bypass</Text></GlassCard>
          </>
        )}

        {tab==='code' && (
          <>
            <View style={styles.pathBar}>
              <Pressable onPress={goBackPath} disabled={pathStack.length===0} style={[styles.pathBack, pathStack.length===0 && { opacity:0.4 }]}><Ionicons name="chevron-back" size={16} color="white" /></Pressable>
              <Text style={styles.pathText}>{currentPath || '/'}</Text>
              <Pressable onPress={()=>setPathStack([])}><Text style={{ color:theme.colors.accent, fontSize:11, fontWeight:'800' }}>ROOT</Text></Pressable>
            </View>
            {files.map((f:any,i:number)=>(
              <Pressable key={i} onPress={()=>openPath(f)}><GlassCard style={{ marginBottom:8 }}><View style={styles.fileRow}><View style={[styles.fileIcon, { backgroundColor: f.type==='dir' ? 'rgba(0,209,255,0.12)' : 'rgba(255,255,255,0.06)' }]}><Ionicons name={f.type==='dir' ? 'folder' : (f.name.endsWith('.md') ? 'document-text-outline' : 'code-slash-outline')} size={16} color={f.type==='dir' ? '#00D1FF' : theme.colors.textSecondary} /></View><View style={{flex:1}}><Text style={styles.fileName}>{f.name}</Text><Text style={styles.fileMeta}>{f.type} • {f.size ? `${(f.size/1024).toFixed(1)} KB` : ''}</Text></View><Ionicons name="chevron-forward" size={14} color={theme.colors.textTertiary} /></View></GlassCard></Pressable>
            ))}
          </>
        )}

        {tab==='commits' && (
          <>
            {commits.map((c:any,i:number)=>(
              <GlassCard key={i} style={{ marginBottom:10 }}>
                <View style={styles.commitRow}><View style={styles.commitIcon}><Ionicons name="git-commit-outline" size={16} color="#00D1FF" /></View><View style={{flex:1}}><Text style={styles.commitMsg} numberOfLines={2}>{c.message || c.commit?.message}</Text><View style={styles.commitMetaRow}><Text style={styles.commitAuthor}>{c.author?.login || c.author || 'gamesiteonline'}</Text><Text style={styles.dot}>•</Text><Text style={styles.commitTime}>{formatAgo(c.date || c.commit?.author?.date)}</Text><Text style={styles.dot}>•</Text><Text style={styles.sha}>{(c.sha||'').slice(0,7)}</Text></View></View></View>
              </GlassCard>
            ))}
          </>
        )}

        {tab==='branches' && (
          <>
            <View style={styles.branchSelectorRow}><Text style={styles.curBranch}>Current: {currentBranch}</Text></View>
            {branches.map((b:any,i:number)=>(
              <Pressable key={i} onPress={()=>{ setCurrentBranch(b.name); loadTab('code'); }}><GlassCard style={{ marginBottom:8 }}><View style={styles.branchRow}><Ionicons name="git-branch-outline" size={16} color={b.name===currentBranch ? '#00FFA3' : '#8B5CF6'} /><Text style={[styles.branchName, b.name===currentBranch && { color:'#00FFA3' }]}>{b.name}</Text>{b.name===currentBranch && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>CURRENT</Text></View>}</View></GlassCard></Pressable>
            ))}
          </>
        )}

        {tab==='issues' && (
          <>
            {issues.map((iss:any)=>(
              <GlassCard key={iss.id} style={{ marginBottom:10 }}>
                <View style={styles.issueRow}><Ionicons name={iss.state==='open' ? 'alert-circle' : 'checkmark-circle'} size={18} color={iss.state==='open' ? '#00FFA3' : '#8B949E'} /><View style={{ flex:1, marginLeft:8 }}><Text style={styles.issueTitle} numberOfLines={2}>#{iss.number} {iss.title}</Text><View style={styles.issueMeta}><Text style={styles.issueAuthor}>by {iss.author?.login || iss.author || iss.user?.login}</Text><View style={styles.commentBadge}><Ionicons name="chatbubble-outline" size={10} color={theme.colors.textSecondary} /><Text style={styles.commentText}>{iss.comments || iss.comments_count || 0}</Text></View></View><View style={styles.labelRow}>{iss.labels?.map((l:any,j:number)=><View key={j} style={[styles.labelChip,{ backgroundColor: `${l.color || '#00D1FF'}22`, borderColor:`${l.color}55` }]}><Text style={[styles.labelText,{ color:l.color || '#00D1FF' }]}>{l.name}</Text></View>)}</View></View></View>
              </GlassCard>
            ))}
          </>
        )}

        {tab==='prs' && (
          <>
            {prs.map((p:any)=>(
              <GlassCard key={p.id} style={{ marginBottom:10 }}>
                <View style={styles.issueRow}><Ionicons name="git-pull-request-outline" size={18} color="#00D1FF" /><View style={{ flex:1, marginLeft:8 }}><Text style={styles.issueTitle}>#{p.number} {p.title}</Text><Text style={styles.issueAuthor}>{p.author?.login || p.author} • +{p.additions || 0} -{p.deletions || 0}</Text></View><View style={[styles.stateBadge, { backgroundColor: p.state==='open' ? 'rgba(0,255,163,0.12)' : 'rgba(139,148,158,0.12)' }]}><Text style={[styles.stateText, { color: p.state==='open' ? '#00FFA3' : '#8B949E' }]}>{p.state.toUpperCase()}</Text></View></View>
              </GlassCard>
            ))}
          </>
        )}

        {tab==='releases' && (
          <>
            {releases.map((rel:any)=>(
              <GlassCard key={rel.id} glow style={{ marginBottom:12 }}>
                <View style={styles.releaseHeader}><View style={styles.releaseIcon}><Ionicons name="pricetag-outline" size={18} color="#FFC857" /></View><View style={{flex:1}}><Text style={styles.releaseName}>{rel.name || rel.tag_name}</Text><Text style={styles.releaseTag}>{rel.tag_name} • {new Date(rel.published_at).toLocaleDateString()}</Text></View></View>
                <Text style={styles.releaseBody} numberOfLines={6}>{rel.body?.slice(0,400)}</Text>
                {rel.assets?.length>0 && <View style={styles.assets}>{rel.assets.map((a:any,i:number)=><View key={i} style={styles.assetRow}><Ionicons name="download-outline" size={14} color={theme.colors.accent} /><Text style={styles.assetName}>{a.name} • {(a.size/1024/1024).toFixed(1)} MB • {a.download_count} dl</Text></View>)}</View>}
              </GlassCard>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

function formatAgo(iso?:string){ if(!iso) return ''; const d=Date.now()-new Date(iso).getTime(); const m=Math.floor(d/60000); if(m<60) return `${m}m ago`; const h=Math.floor(m/60); if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`; }

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ flexDirection:'row', alignItems:'center', gap:10, paddingTop:50, paddingHorizontal:16, paddingBottom:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  backBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  repoTitleRow:{ flexDirection:'row', alignItems:'center', gap:6 },
  repoName:{ color:'white', fontWeight:'800', fontSize:14, flex:1 },
  branchLabel:{ color:theme.colors.textTertiary, fontSize:11, marginTop:2 },
  starBtn:{ flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(255,200,87,0.12)', paddingHorizontal:10, paddingVertical:6, borderRadius:20, borderWidth:1, borderColor:'rgba(255,200,87,0.25)' },
  starText:{ color:theme.colors.star, fontWeight:'800', fontSize:12 },
  tabsScroll:{ borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)', paddingVertical:10 },
  tabBtn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:14, paddingVertical:8, borderRadius:20, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  tabActive:{ backgroundColor:'rgba(0,209,255,0.18)', borderColor:'rgba(0,209,255,0.35)' },
  tabText:{ color:theme.colors.textSecondary, fontSize:11, fontWeight:'800' },
  desc:{ color:theme.colors.textSecondary, fontSize:13, lineHeight:18 },
  statsRow:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:12 },
  statPill:{ flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(255,255,255,0.06)', paddingHorizontal:8, paddingVertical:4, borderRadius:12, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  statTxt:{ color:theme.colors.textSecondary, fontSize:11, fontWeight:'600' },
  metaGrid:{ flexDirection:'row', flexWrap:'wrap', gap:10, marginTop:14 },
  metaItem:{ width:'48%', backgroundColor:'rgba(255,255,255,0.04)', padding:10, borderRadius:12, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  metaKey:{ color:theme.colors.textTertiary, fontSize:9, fontWeight:'800', letterSpacing:1 },
  metaVal:{ color:'white', fontWeight:'700', fontSize:12, marginTop:4 },
  topics:{ marginTop:14 },
  topicsTitle:{ color:theme.colors.textTertiary, fontSize:10, fontWeight:'800', letterSpacing:1, marginBottom:8 },
  topicRow:{ flexDirection:'row', flexWrap:'wrap', gap:6 },
  topicChip:{ backgroundColor:'rgba(0,209,255,0.12)', borderWidth:1, borderColor:'rgba(0,209,255,0.25)', paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  topicTxt:{ color:theme.colors.accent, fontSize:11, fontWeight:'600' },
  pathBar:{ flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:12, padding:10, marginBottom:12 },
  pathBack:{ width:28, height:28, borderRadius:14, backgroundColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center' },
  pathText:{ color:'white', fontSize:12, fontWeight:'700', flex:1 },
  fileRow:{ flexDirection:'row', alignItems:'center', gap:10 },
  fileIcon:{ width:32, height:32, borderRadius:16, alignItems:'center', justifyContent:'center' },
  fileName:{ color:'white', fontWeight:'600', fontSize:13 },
  fileMeta:{ color:theme.colors.textTertiary, fontSize:11, marginTop:2 },
  commitRow:{ flexDirection:'row', gap:10 },
  commitIcon:{ width:32, height:32, borderRadius:16, backgroundColor:'rgba(0,209,255,0.12)', alignItems:'center', justifyContent:'center' },
  commitMsg:{ color:'white', fontWeight:'600', fontSize:13 },
  commitMetaRow:{ flexDirection:'row', alignItems:'center', gap:6, marginTop:4 },
  commitAuthor:{ color:theme.colors.accent, fontSize:11, fontWeight:'700' },
  dot:{ color:theme.colors.textTertiary },
  commitTime:{ color:theme.colors.textTertiary, fontSize:11 },
  sha:{ color:theme.colors.textTertiary, fontSize:10, fontFamily:'monospace' },
  branchSelectorRow:{ marginBottom:10 },
  curBranch:{ color:theme.colors.textSecondary, fontSize:12, fontWeight:'600' },
  branchRow:{ flexDirection:'row', alignItems:'center', gap:10 },
  branchName:{ color:'white', fontWeight:'700', fontSize:13, flex:1 },
  currentBadge:{ backgroundColor:'rgba(0,255,163,0.15)', borderWidth:1, borderColor:'rgba(0,255,163,0.3)', paddingHorizontal:8, paddingVertical:2, borderRadius:10 },
  currentBadgeText:{ color:'#00FFA3', fontSize:9, fontWeight:'900' },
  issueRow:{ flexDirection:'row' },
  issueTitle:{ color:'white', fontWeight:'700', fontSize:13 },
  issueMeta:{ flexDirection:'row', alignItems:'center', gap:8, marginTop:4 },
  issueAuthor:{ color:theme.colors.textTertiary, fontSize:11 },
  commentBadge:{ flexDirection:'row', alignItems:'center', gap:3, backgroundColor:'rgba(255,255,255,0.06)', paddingHorizontal:6, paddingVertical:2, borderRadius:10 },
  commentText:{ color:theme.colors.textSecondary, fontSize:10, fontWeight:'700' },
  labelRow:{ flexDirection:'row', gap:6, marginTop:8, flexWrap:'wrap' },
  labelChip:{ paddingHorizontal:8, paddingVertical:3, borderRadius:10, borderWidth:1 },
  labelText:{ fontSize:10, fontWeight:'800' },
  stateBadge:{ paddingHorizontal:8, paddingVertical:3, borderRadius:10 },
  stateText:{ fontSize:9, fontWeight:'900', letterSpacing:1 },
  releaseHeader:{ flexDirection:'row', gap:10, marginBottom:10 },
  releaseIcon:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,200,87,0.12)', borderWidth:1, borderColor:'rgba(255,200,87,0.25)', alignItems:'center', justifyContent:'center' },
  releaseName:{ color:'white', fontWeight:'800', fontSize:14 },
  releaseTag:{ color:theme.colors.textTertiary, fontSize:11, marginTop:2 },
  releaseBody:{ color:theme.colors.textSecondary, fontSize:12, lineHeight:16, marginTop:4 },
  assets:{ marginTop:10, gap:6 },
  assetRow:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(255,255,255,0.04)', padding:8, borderRadius:10, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  assetName:{ color:theme.colors.textSecondary, fontSize:11, flex:1 },
});
