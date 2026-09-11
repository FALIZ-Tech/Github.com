import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'glow' | 'subtle' | 'accent';
  activeOpacity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  activeOpacity = 0.8,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'glow':
        return styles.cardGlow;
      case 'accent':
        return styles.cardAccent;
      case 'subtle':
        return styles.cardSubtle;
      default:
        return styles.cardDefault;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.base, getVariantStyle(), style]}
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.base, getVariantStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    overflow: 'hidden',
  },
  cardDefault: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  cardGlow: {
    borderColor: 'rgba(0, 240, 255, 0.35)',
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardAccent: {
    backgroundColor: 'rgba(14, 30, 60, 0.88)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  cardSubtle: {
    backgroundColor: 'rgba(13, 20, 36, 0.55)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
});
