import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { theme } from '../lib/theme';

export const CodeEditorScreen: React.FC<{ navigation:any, route:any }> = ({ navigation, route }) => {
  const { owner, repo, path, branch, content: initialContent } = route.params;
  const [content, setContent] = useState(initialContent || '');
  const [commitMsg, setCommitMsg] = useState(`Update ${path}`);
  const [editBranch, setEditBranch] = useState(branch);
  const [showCommit, setShowCommit] = useState(false);

  const handleSave = () => {
    setShowCommit(true);
  };

  const handleConfirmCommit = () => {
    Alert.alert('Commit Confirmation', `Commit to ${owner}/${repo} on branch ${editBranch}?`, [
      { text:'Cancel', style:'cancel' },
      { text:'Commit', onPress:()=>{ Alert.alert('Committed', `Successfully committed changes to ${path} on ${editBranch} (demo). In production, this calls GitHub Contents API PUT /repos/{owner}/{repo}/contents/{path} with SHA and message.`); navigation.goBack(); } }
    ]);
  };

  const diffPreview = `@@ ${path}\n+ ${content.slice(0,120)}...\n- previous content truncated`;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Pressable onPress={()=>navigation.goBack()} style={styles.hBtn}><Ionicons name="close" size={20} color="white" /></Pressable>
        <View style={{flex:1}}><Text style={styles.title}>EDIT • {path.split('/').pop()}</Text><Text style={styles.sub}>{owner}/{repo} • {editBranch}</Text></View>
        <Pressable onPress={()=>Alert.alert('Undo','Undo last edit (demo)')} style={styles.hBtn}><Ionicons name="arrow-undo-outline" size={18} color="white" /></Pressable>
        <Pressable onPress={()=>Alert.alert('Redo','Redo (demo)')} style={styles.hBtn}><Ionicons name="arrow-redo-outline" size={18} color="white" /></Pressable>
      </View>

      {!showCommit ? (
        <>
          <View style={styles.editorToolbar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:8 }}>
              {['Copy','Select All','Find','Bracket','Save'].map(a=>(
                <Pressable key={a} onPress={()=>{ if(a==='Save') handleSave(); }} style={styles.toolChip}><Text style={styles.toolText}>{a}</Text></Pressable>
              ))}
              <View style={styles.branchChip}><Ionicons name="git-branch-outline" size={12} color={theme.colors.accent} /><TextInput value={editBranch} onChangeText={setEditBranch} style={styles.branchInput} placeholderTextColor={theme.colors.textTertiary} /></View>
            </ScrollView>
          </View>
          <View style={styles.editorWrap}>
            <ScrollView style={{ flex:1 }}>
              <View style={styles.lineGutter}>
                <TextInput value={content} onChangeText={setContent} multiline style={styles.editor} placeholder="// Start coding..." placeholderTextColor={theme.colors.textTertiary} autoCapitalize="none" autoCorrect={false} spellCheck={false} />
              </View>
            </ScrollView>
          </View>
          <View style={styles.bottomBar}>
            <Text style={styles.metaText}>{content.split('\n').length} lines • {content.length} chars • {editBranch}</Text>
            <GlowButton title="Review → Commit" onPress={handleSave} />
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={{ padding:16, paddingBottom:100 }}>
          <GlassCard glow style={{ marginBottom:12 }}>
            <Text style={styles.reviewTitle}>Review Changes</Text>
            <View style={styles.diffBox}><Text style={styles.diffText}>{diffPreview}</Text></View>
            <View style={styles.commitBox}>
              <Text style={styles.commitLabel}>COMMIT MESSAGE</Text>
              <View style={styles.commitInputWrap}><TextInput value={commitMsg} onChangeText={setCommitMsg} style={styles.commitInput} placeholder="Commit message..." placeholderTextColor={theme.colors.textTertiary} multiline /></View>
              <Text style={styles.commitLabel}>BRANCH</Text>
              <View style={styles.commitInputWrap}><Ionicons name="git-branch-outline" size={14} color={theme.colors.accent} style={{ marginLeft:10 }} /><TextInput value={editBranch} onChangeText={setEditBranch} style={styles.commitInput} /></View>
            </View>
            <View style={{ gap:10, marginTop:16 }}>
              <GlowButton title={`Commit to ${editBranch}`} onPress={handleConfirmCommit} fullWidth />
              <GlowButton title="Back to Editor" variant="glass" onPress={()=>setShowCommit(false)} fullWidth />
            </View>
            <Text style={styles.note}>In production this performs: GET latest SHA → PUT /repos/{'{owner}'}/{'{repo}'}/contents/{'{path}'} with base64 content, message, branch, SHA. Permission checks via GitHub API. Destructive actions require confirmation per spec.</Text>
          </GlassCard>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background },
  header:{ flexDirection:'row', alignItems:'center', gap:10, paddingTop:50, paddingHorizontal:16, paddingBottom:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  hBtn:{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  title:{ color:'white', fontWeight:'800', fontSize:12, letterSpacing:1 },
  sub:{ color:theme.colors.textTertiary, fontSize:11, marginTop:2 },
  editorToolbar:{ padding:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  toolChip:{ paddingHorizontal:12, paddingVertical:6, borderRadius:20, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  toolText:{ color:theme.colors.textSecondary, fontSize:11, fontWeight:'700' },
  branchChip:{ flexDirection:'row', alignItems:'center', backgroundColor:'rgba(0,209,255,0.12)', borderWidth:1, borderColor:'rgba(0,209,255,0.25)', borderRadius:20, paddingHorizontal:10, gap:6 },
  branchInput:{ color:'white', fontSize:11, fontWeight:'700', minWidth:60 },
  editorWrap:{ flex:1, margin:12, backgroundColor:'rgba(10,16,32,0.85)', borderRadius:14, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  lineGutter:{ padding:12 },
  editor:{ color:'#C9D1D9', fontSize:13, fontFamily:'monospace', lineHeight:20, minHeight:400, textAlignVertical:'top' },
  bottomBar:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.06)', backgroundColor:'rgba(5,7,14,0.9)' },
  metaText:{ color:theme.colors.textTertiary, fontSize:11 },
  reviewTitle:{ color:'white', fontWeight:'900', fontSize:18, letterSpacing:1, marginBottom:12 },
  diffBox:{ backgroundColor:'rgba(0,0,0,0.3)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:12, padding:12 },
  diffText:{ color:'#00FFA3', fontSize:11, fontFamily:'monospace', lineHeight:16 },
  commitBox:{ marginTop:16 },
  commitLabel:{ color:theme.colors.textTertiary, fontSize:10, fontWeight:'800', letterSpacing:1, marginBottom:6, marginTop:10 },
  commitInputWrap:{ flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:12, minHeight:44 },
  commitInput:{ flex:1, color:'white', fontSize:13, paddingHorizontal:12, paddingVertical:10 },
  note:{ color:theme.colors.textTertiary, fontSize:10, lineHeight:14, marginTop:12, textAlign:'center' },
});
