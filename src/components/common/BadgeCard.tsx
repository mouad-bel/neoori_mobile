import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
}

interface BadgeCardProps {
  badge: Badge;
  isNewlyUnlocked?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isNewlyUnlocked = false }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation when badge is newly unlocked
  useEffect(() => {
    if (isNewlyUnlocked && badge.unlocked) {
      // Celebration animation sequence
      Animated.sequence([
        // Scale up and rotate
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            tension: 100,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Bounce back
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();

      // Pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }
  }, [isNewlyUnlocked, badge.unlocked]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: badge.unlocked ? colors.cardBackground : colors.background,
          opacity: badge.unlocked ? 1 : 0.5,
          borderColor: badge.unlocked ? colors.primary : colors.border,
          borderWidth: badge.unlocked && isNewlyUnlocked ? 3 : 1,
          transform: [
            { scale: scaleAnim },
            { rotate },
          ],
        },
      ]}
    >
      {isNewlyUnlocked && badge.unlocked && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              backgroundColor: colors.primary,
              opacity: glowOpacity,
            },
          ]}
          pointerEvents="none"
        />
      )}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            backgroundColor: badge.unlocked ? `${colors.primary}20` : `${colors.textSecondary}20`,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Ionicons
          name={badge.icon as any}
          size={32}
          color={badge.unlocked ? colors.primary : colors.textSecondary}
        />
        {isNewlyUnlocked && badge.unlocked && (
          <View style={styles.sparkleContainer}>
            <Ionicons name="star" size={20} color={colors.primary} />
          </View>
        )}
      </Animated.View>
      <Text style={[styles.name, { color: colors.textPrimary }]}>{badge.name}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
        {badge.description}
      </Text>
      {badge.unlocked && badge.unlockedDate && (
        <Text style={[styles.date, { color: colors.textTertiary }]}>
          Débloqué le {new Date(badge.unlockedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </Text>
      )}
      {isNewlyUnlocked && badge.unlocked && (
        <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.newBadgeText, { color: colors.background }]}>NOUVEAU!</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
  description: {
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
    lineHeight: 16,
  },
  date: {
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs,
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS.md,
    zIndex: -1,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 10,
  },
  newBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
});

export default BadgeCard;

