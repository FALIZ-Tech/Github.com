import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../lib/theme';

type Props = { children: React.ReactNode; style?: ViewStyle; intensity?: number; glow?: boolean; noBlur?: boolean; };

export const GlassCard: React.FC<Props> = ({ children, style, intensity=30, glow=false, noBlur=false }) => {
  return (
    <View style={[styles.wrapper, glow && styles.glowWrapper, style]}>
      {glow && <View style={styles.glow} />}
      <View style={styles.card}>
        {!noBlur ? <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} /> : null}
        <View style={styles.innerBorder} />
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { borderRadius: theme.radii.lg, overflow: 'hidden' },
  glowWrapper: { shadowColor: theme.colors.accent, shadowOffset: { width:0, height:0 }, shadowOpacity:0.25, shadowRadius:18, elevation:6 },
  glow: { position:'absolute', top:-20, left:-20, right:-20, bottom:-20, backgroundColor:'rgba(0,209,255,0.08)', borderRadius:30 },
  card: { backgroundColor:'rgba(22,32,56,0.60)', borderRadius:theme.radii.lg, borderWidth:1, borderColor:'rgba(255,255,255,0.09)', overflow:'hidden', position:'relative' },
  innerBorder: { ...StyleSheet.absoluteFillObject, borderRadius:theme.radii.lg, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' } as any,
  content: { padding:16 }
});
