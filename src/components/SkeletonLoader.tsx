import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../theme/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.75,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export const RepoCardSkeleton: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.row}>
      <Skeleton width={32} height={32} borderRadius={8} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Skeleton width="65%" height={16} />
        <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
    <Skeleton width="95%" height={14} style={{ marginTop: 14 }} />
    <Skeleton width="75%" height={14} style={{ marginTop: 6 }} />
    <View style={[styles.row, { marginTop: 16, gap: 12 }]}>
      <Skeleton width={60} height={16} borderRadius={6} />
      <Skeleton width={50} height={16} borderRadius={6} />
      <Skeleton width={70} height={16} borderRadius={6} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  cardSkeleton: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
