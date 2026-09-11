import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
export const AnimatedCounter: React.FC<{ value:number, style?:TextStyle, duration?:number }> = ({ value, style, duration=800 }) => {
  const [display, setDisplay]=useState(0);
  useEffect(()=>{ const st=Date.now(); const anim=()=>{ const el=Date.now()-st; const p=Math.min(el/duration,1); const eased=1-Math.pow(1-p,3); setDisplay(Math.floor(eased*value)); if(p<1) requestAnimationFrame(anim); }; anim(); },[value]);
  return <Text style={style}>{display.toLocaleString()}</Text>;
};
