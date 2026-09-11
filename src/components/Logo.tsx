import React from 'react';
import { View, StyleSheet, Image, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../theme/colors';

interface LogoProps {
  size?: number;
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'dark' | 'blueprint';
}

export const Logo: React.FC<LogoProps> = ({
  size = 48,
  glow = true,
  style,
  variant = 'dark',
}) => {
  const imageSource =
    variant === 'blueprint'
      ? require('../../assets/icon.png')
      : require('../../assets/android-icon-foreground.png');

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        glow && styles.glowContainer,
        style,
      ]}
    >
      {/* Outer subtle glow ring */}
      {glow && (
        <View
          style={[
            styles.glowRing,
            {
              width: size * 1.15,
              height: size * 1.15,
              borderRadius: (size * 1.15) / 2,
            },
          ]}
        />
      )}
      <Image
        source={imageSource}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowContainer: {
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
});
