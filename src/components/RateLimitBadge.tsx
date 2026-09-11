import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

interface RateLimitBadgeProps {
  compact?: boolean;
}

export const RateLimitBadge: React.FC<RateLimitBadgeProps> = ({ compact = false }) => {
  const { rateLimit, isAuthenticated } = useAuth();
  const ratio = rateLimit.remaining / (rateLimit.limit || 60);

  const getColor = () => {
    if (ratio > 0.4) return Colors.neonGreen;
    if (ratio > 0.15) return Colors.neonAmber;
    return Colors.neonRose;
  };

  const statusColor = getColor();

  if (compact) {
    return (
      <View style={[styles.compactBadge, { borderColor: `${statusColor}40` }]}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <Text style={[styles.compactText, { color: statusColor }]}>
          {rateLimit.remaining}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.fullBadge}>
      <Ionicons name="speedometer-outline" size={14} color={statusColor} />
      <Text style={styles.fullText}>
        API Quota: <Text style={{ color: statusColor, fontWeight: '700' }}>{rateLimit.remaining}</Text> / {rateLimit.limit}
      </Text>
      {isAuthenticated ? (
        <View style={styles.authTag}>
          <Text style={styles.authTagText}>PRO (5k/hr)</Text>
        </View>
      ) : (
        <View style={styles.guestTag}>
          <Text style={styles.guestTagText}>PUBLIC (60/hr)</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  compactText: {
    fontSize: 10,
    fontWeight: '700',
  },
  fullBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 20, 36, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    gap: 6,
  },
  fullText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  authTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.neonGreen,
    marginLeft: 'auto',
  },
  authTagText: {
    fontSize: 9,
    color: Colors.neonGreen,
    fontWeight: '700',
  },
  guestTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.neonBlue,
    marginLeft: 'auto',
  },
  guestTagText: {
    fontSize: 9,
    color: Colors.neonBlue,
    fontWeight: '700',
  },
});
