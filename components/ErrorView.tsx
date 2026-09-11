import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { GlowButton } from './GlowButton';
import { theme } from '../lib/theme';

export const ErrorView: React.FC<{ message?:string, onRetry?:()=>void, type?:string }> = ({ message='Something went wrong', onRetry, type }) => {
  const icon = type==='network' ? 'cloud-offline-outline' : type==='ratelimit' ? 'timer-outline' : type==='auth' ? 'lock-closed-outline' : 'warning-outline';
  return (
    <GlassCard style={styles.card} glow>
      <View style={styles.content}>
        <View style={styles.iconWrap}><Ionicons name={icon as any} size={28} color="#FF5A5F" /></View>
        <Text style={styles.title}>{type==='network' ? 'Offline' : type==='ratelimit' ? 'Rate Limited' : type==='auth' ? 'Session Expired' : 'Oops!'}</Text>
        <Text style={styles.msg}>{message}</Text>
        {onRetry && <GlowButton title="Retry" onPress={onRetry} />}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card:{ margin:16 },
  content:{ alignItems:'center', paddingVertical:10 },
  iconWrap:{ width:64, height:64, borderRadius:32, backgroundColor:'rgba(255,90,95,0.12)', borderWidth:1, borderColor:'rgba(255,90,95,0.25)', alignItems:'center', justifyContent:'center', marginBottom:12 },
  title:{ color:'white', fontWeight:'800', fontSize:18, marginBottom:6 },
  msg:{ color:theme.colors.textSecondary, fontSize:13, textAlign:'center', marginBottom:16, lineHeight:18 },
});
