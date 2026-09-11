import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Logo } from '../components/Logo';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface IntroScreenProps {
  onFinish: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onFinish }) => {
  const { setHasSeenIntro } = useApp();

  // Animation values
  const bgFade = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoTilt = useRef(new Animated.Value(0)).current;
  const sweepPos = useRef(new Animated.Value(-150)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(25)).current;
  const particleFade = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;

  // Particle positions
  const particleAnims = useRef(
    Array.from({ length: 12 }).map(() => ({
      x: Math.random() * 260 - 130,
      y: Math.random() * 260 - 130,
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // 1. Dark background appears
    Animated.timing(bgFade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 2. Logo fades in + scales
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 900,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Blue/cyan light particles move around it
    Animated.sequence([
      Animated.delay(600),
      Animated.timing(particleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    particleAnims.forEach((p, idx) => {
      Animated.sequence([
        Animated.delay(700 + idx * 80),
        Animated.parallel([
          Animated.spring(p.scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(p.opacity, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });

    // 4. Glass reflection sweeps across the logo
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(sweepPos, {
        toValue: 200,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Subtle 3D/parallax animation
    Animated.sequence([
      Animated.delay(1500),
      Animated.sequence([
        Animated.timing(logoTilt, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoTilt, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Subtle glow pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 0.9,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 6. Show: GAMESITEONLINE
    Animated.sequence([
      Animated.delay(1800),
      Animated.parallel([
        Animated.timing(textFade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(textSlide, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Auto transition after cinematic sequence finishes
    const timer = setTimeout(() => {
      handleComplete();
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = async () => {
    await setHasSeenIntro(true);
    onFinish();
  };

  const tiltInterpolate = logoTilt.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '8deg'],
  });

  return (
    <View style={styles.container}>
      {/* Dark background */}
      <Animated.View style={[styles.bgBackdrop, { opacity: bgFade }]} />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleComplete} activeOpacity={0.7}>
        <Text style={styles.skipText}>SKIP INTRO</Text>
      </TouchableOpacity>

      <View style={styles.centerStage}>
        {/* Particle halos */}
        <Animated.View style={[styles.particleField, { opacity: particleFade }]}>
          {particleAnims.map((p, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particleDot,
                {
                  transform: [
                    { translateX: p.x },
                    { translateY: p.y },
                    { scale: p.scale },
                  ],
                  opacity: p.opacity,
                  backgroundColor: i % 2 === 0 ? Colors.neonCyan : Colors.neonBlue,
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Pulsing neon aura */}
        <Animated.View
          style={[
            styles.neonAura,
            {
              opacity: glowPulse,
            },
          ]}
        />

        {/* Logo Container with 3D tilt */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoFade,
              transform: [
                { scale: logoScale },
                { rotateY: tiltInterpolate },
              ],
            },
          ]}
        >
          <Logo size={120} glow={false} />

          {/* Glass reflection sweep */}
          <Animated.View
            style={[
              styles.sweepBand,
              {
                transform: [{ translateX: sweepPos }, { rotate: '25deg' }],
              },
            ]}
          />
        </Animated.View>

        {/* Title: GAMESITEONLINE */}
        <Animated.View
          style={[
            styles.titleBox,
            {
              opacity: textFade,
              transform: [{ translateY: textSlide }],
            },
          ]}
        >
          <Text style={styles.titleText}>GAMESITEONLINE</Text>
          <Text style={styles.subTitleText}>GITHUB-POWERED GAMING ENGINE</Text>
          <View style={styles.tagRow}>
            <View style={styles.neonChip}>
              <Text style={styles.neonChipText}>v1.0.0 PRO</Text>
            </View>
            <View style={styles.neonChip}>
              <Text style={styles.neonChipText}>58+ GAME REPOS</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Tap to enter prompt */}
      <Animated.View style={[styles.bottomPrompt, { opacity: textFade }]}>
        <TouchableOpacity style={styles.enterBtn} onPress={handleComplete}>
          <Text style={styles.enterBtnText}>INITIALIZE PLATFORM</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bgBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070B14',
  },
  skipBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 10,
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 320,
    height: 320,
  },
  particleField: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particleDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  neonAura: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.35)',
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 8,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'rgba(13, 20, 36, 0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.4)',
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  sweepBand: {
    position: 'absolute',
    width: 45,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    top: -30,
  },
  titleBox: {
    alignItems: 'center',
    marginTop: 32,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textAlign: 'center',
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  subTitleText: {
    fontSize: 11,
    color: Colors.neonCyan,
    letterSpacing: 2,
    marginTop: 6,
    fontWeight: '700',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  neonChip: {
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  neonChipText: {
    fontSize: 10,
    color: Colors.neonCyan,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomPrompt: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  enterBtn: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: Colors.neonCyan,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  enterBtnText: {
    color: Colors.neonCyan,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
