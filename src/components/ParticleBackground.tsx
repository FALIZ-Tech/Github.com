import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PARTICLE_COUNT = 18;

interface ParticleData {
  id: number;
  x: number;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
  color: string;
  duration: number;
}

export const ParticleBackground: React.FC = () => {
  const { settings } = useApp();
  const particlesRef = useRef<ParticleData[]>([]);

  if (particlesRef.current.length === 0) {
    const colors = [Colors.neonCyan, Colors.neonBlue, '#38BDF8', '#818CF8'];
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      y: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(Math.random() * 0.4 + 0.1),
      size: Math.random() * 3 + 1.5,
      color: colors[i % colors.length],
      duration: Math.random() * 8000 + 7000,
    }));
  }

  useEffect(() => {
    if (!settings.particles) return;

    const animations = particlesRef.current.map(p => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(p.y, {
              toValue: -20,
              duration: p.duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(p.opacity, {
                toValue: 0.7,
                duration: p.duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(p.opacity, {
                toValue: 0.1,
                duration: p.duration / 2,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(p.y, {
            toValue: SCREEN_HEIGHT + 20,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return loop;
    });

    return () => {
      animations.forEach(a => a.stop());
    };
  }, [settings.particles]);

  if (!settings.particles) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Background radial gradient simulation & grid lines */}
      <View style={styles.gridOverlay} />
      {particlesRef.current.map(p => (
        <Animated.View
          key={p.id}
          style={[
            styles.particle,
            {
              left: p.x,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              shadowColor: p.color,
              shadowOpacity: 0.8,
              shadowRadius: 6,
              opacity: p.opacity,
              transform: [{ translateY: p.y }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    elevation: 2,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.03,
    borderWidth: 0.5,
    borderColor: '#00F0FF',
  },
});
