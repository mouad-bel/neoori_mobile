import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  buttonStyle?: ViewStyle; // Style for the TouchableOpacity button itself
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  animated?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  children,
  style,
  buttonStyle,
  textStyle,
  disabled = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  animated = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated && !disabled) {
      // Subtle bounce animation on mount
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  const handlePressIn = () => {
    if (animated && !disabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && !disabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (disabled) return;
    
    if (animated) {
      // Bounce animation on press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    onPress();
  };

  const bounceTranslateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleAnim },
            { translateY: bounceTranslateY },
          ],
        },
        style, // Layout styles (flex, etc.) go on the animated view
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.button,
          buttonStyle, // Visual styles (backgroundColor, borderRadius, padding, etc.) go on the button
          disabled && styles.disabled,
        ]}
      >
        {icon && iconPosition === 'left' && (
          <Ionicons name={icon} size={20} style={styles.iconLeft} />
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <Ionicons name={icon} size={20} style={styles.iconRight} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default AnimatedButton;

