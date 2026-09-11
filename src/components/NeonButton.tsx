import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../theme/colors';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.btnPrimary;
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'danger':
        return styles.btnDanger;
      case 'ghost':
        return styles.btnGhost;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.btnSm;
      case 'lg':
        return styles.btnLg;
      default:
        return styles.btnMd;
    }
  };

  const getTextVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.textPrimary;
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'danger':
        return styles.textDanger;
      case 'ghost':
        return styles.textGhost;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getSizeStyle(),
        getContainerStyle(),
        disabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#070B14' : Colors.neonCyan}
        />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
              color={
                variant === 'primary'
                  ? '#070B14'
                  : variant === 'danger'
                  ? Colors.neonRose
                  : Colors.neonCyan
              }
              style={styles.icon}
            />
          )}
          <Text style={[styles.textBase, getTextVariantStyle(), textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  textBase: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnSm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnMd: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  btnLg: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  btnPrimary: {
    backgroundColor: Colors.neonCyan,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  textPrimary: {
    color: '#070B14',
    fontSize: 14,
  },
  btnSecondary: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  textSecondary: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  btnOutline: {
    backgroundColor: 'rgba(0, 240, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: Colors.neonCyan,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  textOutline: {
    color: Colors.neonCyan,
    fontSize: 14,
  },
  btnDanger: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1.5,
    borderColor: Colors.neonRose,
  },
  textDanger: {
    color: Colors.neonRose,
    fontSize: 14,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  textGhost: {
    color: Colors.neonCyan,
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.45,
  },
});
