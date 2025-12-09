import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONFETTI_COUNT = 50;

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  size: number;
}

interface ConfettiAnimationProps {
  visible: boolean;
  duration?: number;
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ visible, duration = 2000 }) => {
  const confettiPieces = useRef<ConfettiPiece[]>([]);
  const animations = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    if (visible) {
      // Initialize confetti pieces
      confettiPieces.current = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        x: new Animated.Value(Math.random() * SCREEN_WIDTH),
        y: new Animated.Value(-20),
        rotation: new Animated.Value(0),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
      }));

      // Start animations
      animations.current = confettiPieces.current.map((piece) => {
        const fallAnimation = Animated.parallel([
          Animated.timing(piece.y, {
            toValue: SCREEN_HEIGHT + 100,
            duration: duration + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(piece.x, {
            toValue: piece.x._value + (Math.random() - 0.5) * 200,
            duration: duration + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: Math.random() * 360,
            duration: duration + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ]);

        fallAnimation.start();
        return fallAnimation;
      });
    } else {
      // Reset animations
      animations.current.forEach((anim) => anim.stop());
      confettiPieces.current.forEach((piece) => {
        piece.y.setValue(-20);
        piece.x.setValue(Math.random() * SCREEN_WIDTH);
        piece.rotation.setValue(0);
      });
    }

    return () => {
      animations.current.forEach((anim) => anim.stop());
    };
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece) => {
        const rotation = piece.rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={piece.id}
            style={[
              styles.confetti,
              {
                left: piece.x,
                top: piece.y,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                transform: [{ rotate: rotation }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});

export default ConfettiAnimation;

