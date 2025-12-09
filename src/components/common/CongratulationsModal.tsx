import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface CongratulationsModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  delay?: number; // Delay before auto-closing (in ms)
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  visible,
  onClose,
  title = 'Félicitations ! 🎉',
  message = 'Tu as terminé le jeu avec succès !',
  delay = 2000,
}) => {
  const { colors, theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      confettiAnim.setValue(0);

      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-close after delay
      const timer = setTimeout(() => {
        handleClose();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const confettiRotation = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const confettiScale = confettiAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primary + 'DD']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Confetti Animation */}
            <Animated.View
              style={[
                styles.confettiContainer,
                {
                  transform: [
                    { rotate: confettiRotation },
                    { scale: confettiScale },
                  ],
                },
              ]}
            >
              <Ionicons name="trophy" size={80} color="#FFD700" />
            </Animated.View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.background }]}>
                {title}
              </Text>
              <Text style={[styles.message, { color: colors.background }]}>
                {message}
              </Text>

              {/* Success Icons */}
              <View style={styles.iconsContainer}>
                <Animated.View
                  style={[
                    styles.iconWrapper,
                    {
                      opacity: opacityAnim,
                      transform: [
                        {
                          translateY: opacityAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={40} color="#FFD700" />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.iconWrapper,
                    {
                      opacity: opacityAnim,
                      transform: [
                        {
                          translateY: opacityAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name="star" size={40} color="#FFD700" />
                </Animated.View>
                <Animated.View
                  style={[
                    styles.iconWrapper,
                    {
                      opacity: opacityAnim,
                      transform: [
                        {
                          translateY: opacityAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name="medal" size={40} color="#FFD700" />
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gradient: {
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  confettiContainer: {
    marginBottom: SPACING.lg,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.md,
  },
  iconWrapper: {
    padding: SPACING.sm,
  },
});

export default CongratulationsModal;

