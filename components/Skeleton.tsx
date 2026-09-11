import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export const SkeletonLine: React.FC<{ width?: any, height?: number, style?: any }> = ({ width='100%', height=14, style }) => {
  const opacity = useSharedValue(0.3);
  useEffect(()=>{ opacity.value = withRepeat(withTiming(1,{duration:900}),-1,true); },[]);
  const anim = useAnimatedStyle(()=>({ opacity: opacity.value }));
  return <Animated.View style={[styles.line,{width,height},style,anim]}><LinearGradient colors={['rgba(255,255,255,0.04)','rgba(255,255,255,0.09)','rgba(255,255,255,0.04)']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View>;
};

export const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    <SkeletonLine width="60%" height={18} />
    <View style={{height:10}} />
    <SkeletonLine width="90%" />
    <View style={{height:6}} />
    <SkeletonLine width="70%" />
    <View style={{height:12}} />
    <View style={{flexDirection:'row', gap:8}}><SkeletonLine width={60} height={22} style={{borderRadius:20}} /><SkeletonLine width={60} height={22} style={{borderRadius:20}} /></View>
  </View>
);

const styles = StyleSheet.create({
  line: { backgroundColor:'rgba(255,255,255,0.06)', borderRadius:6, overflow:'hidden' },
  card: { backgroundColor:'rgba(22,32,56,0.55)', borderRadius:20, padding:16, borderWidth:1, borderColor:'rgba(255,255,255,0.06)', marginBottom:12 }
});
