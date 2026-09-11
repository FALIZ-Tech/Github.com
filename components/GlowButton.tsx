import React from 'react';
import { Pressable, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = { title:string, onPress:()=>void, variant?:'primary'|'glass'|'danger', icon?:React.ReactNode, loading?:boolean, disabled?:boolean, fullWidth?:boolean };

export const GlowButton: React.FC<Props> = ({ title, onPress, variant='primary', icon, loading, disabled, fullWidth }) => {
  if (variant==='primary') {
    return (
      <Pressable onPress={onPress} disabled={disabled||loading} style={({pressed})=>[styles.btnWrap, fullWidth&&{alignSelf:'stretch'}, pressed&&{opacity:0.9, transform:[{scale:0.98}]}]}>
        <LinearGradient colors={['#00D1FF','#3A86FF']} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.primary, disabled&&{opacity:0.5}]}>
          <View style={styles.row}>{loading ? <ActivityIndicator color="white" /> : icon}<Text style={styles.primaryText}>{title}</Text></View>
        </LinearGradient>
        <View style={styles.glow} />
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} disabled={disabled||loading} style={({pressed})=>[styles.glassWrap, fullWidth&&{alignSelf:'stretch'}, pressed&&{transform:[{scale:0.98}]}]}>
      <View style={[styles.glass, variant==='danger'&&styles.danger]}>{loading?<ActivityIndicator color="white" />:icon}<Text style={[styles.glassText, variant==='danger'&&{color:'#FF5A5F'}]}>{title}</Text></View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnWrap:{ position:'relative', borderRadius:14, overflow:'visible' },
  primary:{ borderRadius:14, paddingVertical:14, paddingHorizontal:22, alignItems:'center', justifyContent:'center' },
  primaryText:{ color:'white', fontWeight:'800', fontSize:15, letterSpacing:0.5, marginLeft:8 },
  glow:{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,209,255,0.25)', borderRadius:14, zIndex:-1, transform:[{scale:1.1}], opacity:0.5 },
  row:{ flexDirection:'row', alignItems:'center', justifyContent:'center' },
  glassWrap:{ borderRadius:14 },
  glass:{ borderRadius:14, paddingVertical:14, paddingHorizontal:22, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.12)', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8 },
  danger:{ backgroundColor:'rgba(255,90,95,0.12)', borderColor:'rgba(255,90,95,0.3)' },
  glassText:{ color:'white', fontWeight:'700', fontSize:14 }
});
