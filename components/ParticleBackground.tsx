import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const particles = Array.from({ length: 18 }).map((_, i) => ({ id:i, x: Math.random()*width, y: Math.random()*height*0.85, size: 1+Math.random()*2.5, delay: i*140 }));

const Particle: React.FC<{ p: typeof particles[0] }> = ({ p }) => {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(0);
  const tx = useSharedValue(0);
  useEffect(()=>{ opacity.value = withDelay(p.delay, withRepeat(withTiming(0.6,{duration:1800}),-1,true)); ty.value = withDelay(p.delay, withRepeat(withTiming(-28,{duration:3800+Math.random()*2000, easing:Easing.inOut(Easing.ease)}),-1,true)); tx.value = withDelay(p.delay, withRepeat(withTiming((Math.random()-0.5)*36,{duration:3400}),-1,true)); },[]);
  const style = useAnimatedStyle(()=>({ opacity: opacity.value, transform:[{translateY:ty.value},{translateX:tx.value}] }));
  return <Animated.View style={[styles.particle,{left:p.x, top:p.y, width:p.size, height:p.size}, style]} />;
};

export const ParticleBackground: React.FC = () => {
  return <View style={StyleSheet.absoluteFill} pointerEvents="none">{particles.map(p=><Particle key={p.id} p={p} />)}</View>;
};

const styles = StyleSheet.create({ particle:{ position:'absolute', borderRadius:999, backgroundColor:'#00D1FF', shadowColor:'#00D1FF', shadowOpacity:0.8, shadowRadius:6 } });
