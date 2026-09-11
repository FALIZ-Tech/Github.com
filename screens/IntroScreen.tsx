import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withRepeat, Easing, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../lib/theme';
import { ParticleBackground } from '../components/ParticleBackground';

const { width, height } = Dimensions.get('window');

export const IntroScreen: React.FC<{ onFinish:()=>void, onSkip:()=>void }> = ({ onFinish, onSkip }) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const logoRotateY = useSharedValue(-15);
  const textOpacity = useSharedValue(0);
  const reflectionX = useSharedValue(-width);
  const glowScale = useSharedValue(0.8);
  const bgOpacity = useSharedValue(0);

  useEffect(()=>{
    bgOpacity.value = withTiming(1,{duration:800});
    logoOpacity.value = withDelay(300, withTiming(1,{duration:900}));
    logoScale.value = withDelay(300, withTiming(1,{duration:1200, easing:Easing.out(Easing.back(1.4))}));
    logoRotateY.value = withDelay(300, withRepeat(withSequence(withTiming(8,{duration:2000}), withTiming(-8,{duration:2000})), -1, true));
    reflectionX.value = withDelay(1200, withTiming(width*1.5,{duration:1200, easing:Easing.inOut(Easing.ease)}));
    textOpacity.value = withDelay(1000, withTiming(1,{duration:800}));
    glowScale.value = withRepeat(withTiming(1.2,{duration:1800}),-1,true);
    const t = setTimeout(()=>onFinish(), 3800);
    return ()=>clearTimeout(t);
  },[]);

  const logoStyle = useAnimatedStyle(()=>({ opacity:logoOpacity.value, transform:[{scale:logoScale.value},{perspective:800},{rotateY:`${logoRotateY.value}deg`}] }));
  const reflectionStyle = useAnimatedStyle(()=>({ transform:[{translateX:reflectionX.value},{skewX:'-20deg'}] }));
  const textStyle = useAnimatedStyle(()=>({ opacity:textOpacity.value }));
  const bgStyle = useAnimatedStyle(()=>({ opacity:bgOpacity.value }));
  const glowAnimStyle = useAnimatedStyle(()=>({ transform:[{scale:glowScale.value}], opacity:0.6 }));

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}><LinearGradient colors={['#05070E','#0A1020','#111A2E']} style={StyleSheet.absoluteFill} /></Animated.View>
      <ParticleBackground />
      <View style={styles.glowCenter}><Animated.View style={[styles.glowCircle, glowAnimStyle]}><LinearGradient colors={['rgba(0,209,255,0.25)','rgba(58,134,255,0.15)','transparent']} style={StyleSheet.absoluteFill} /></Animated.View></View>
      <View style={styles.content}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
          <Animated.View style={[styles.reflection, reflectionStyle]}><LinearGradient colors={['transparent','rgba(255,255,255,0.8)','transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></Animated.View>
        </Animated.View>
        <Animated.View style={[styles.textWrap, textStyle]}>
          <Text style={styles.title}>GAMESITEONLINE</Text>
          <View style={styles.divider}><LinearGradient colors={['transparent','#00D1FF','transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></View>
          <Text style={styles.subtitle}>GitHub-Powered Gaming & Developer Platform</Text>
        </Animated.View>
        <View style={styles.versionBox}><View style={styles.versionDot} /><Text style={styles.versionText}>SECURE • NEON • GLASSMORPHISM</Text></View>
      </View>
      <Pressable onPress={onSkip} style={styles.skipBtn}><Text style={styles.skipText}>SKIP INTRO →</Text></Pressable>
      <View style={styles.bottomAccent}><LinearGradient colors={['transparent','#00D1FF','#3A86FF','transparent']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:theme.colors.background, alignItems:'center', justifyContent:'center' },
  content:{ alignItems:'center', justifyContent:'center', zIndex:2, paddingHorizontal:30 },
  glowCenter:{ position:'absolute', width:width*0.9, height:width*0.9, top:height*0.32-width*0.45, left:width*0.05, alignItems:'center', justifyContent:'center' },
  glowCircle:{ width:'100%', height:'100%', borderRadius:999, overflow:'hidden' },
  logoWrap:{ width:180, height:180, borderRadius:40, overflow:'hidden', backgroundColor:'rgba(255,255,255,0.03)', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center', shadowColor:'#00D1FF', shadowOpacity:0.4, shadowRadius:30, elevation:20 },
  logo:{ width:160, height:160 },
  reflection:{ position:'absolute', top:-10, bottom:-10, width:60, opacity:0.7 },
  textWrap:{ marginTop:40, alignItems:'center' },
  title:{ color:'white', fontSize:32, fontWeight:'900', letterSpacing:6, textShadowColor:'rgba(0,209,255,0.8)', textShadowRadius:20 },
  divider:{ height:2, width:200, marginVertical:14, overflow:'hidden', borderRadius:2 },
  subtitle:{ color:theme.colors.textSecondary, fontSize:12, letterSpacing:2, fontWeight:'600', textAlign:'center' },
  versionBox:{ flexDirection:'row', alignItems:'center', gap:8, marginTop:30, backgroundColor:'rgba(255,255,255,0.05)', paddingHorizontal:16, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  versionDot:{ width:8, height:8, borderRadius:4, backgroundColor:'#00FFA3', shadowColor:'#00FFA3', shadowOpacity:0.8, shadowRadius:8 },
  versionText:{ color:theme.colors.textTertiary, fontSize:10, letterSpacing:2, fontWeight:'700' },
  skipBtn:{ position:'absolute', bottom:50, right:24, backgroundColor:'rgba(255,255,255,0.06)', paddingHorizontal:16, paddingVertical:10, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  skipText:{ color:'white', fontSize:11, fontWeight:'700', letterSpacing:1 },
  bottomAccent:{ position:'absolute', bottom:0, left:0, right:0, height:2 },
});
