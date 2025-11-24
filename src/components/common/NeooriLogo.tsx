import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../store/ThemeContext';

interface NeooriLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  showText?: boolean;
}

const NeooriLogo: React.FC<NeooriLogoProps> = ({ 
  size = 'medium',
  style,
  showText = true 
}) => {
  const { theme, colors } = useTheme();
  const isDarkMode = theme === 'dark';

  const sizeConfig = {
    small: { icon: 24, text: 16, spacing: 6 },
    medium: { icon: 36, text: 24, spacing: 8 },
    large: { icon: 56, text: 36, spacing: 12 },
  };

  const config = sizeConfig[size];

  // Logo image source - using require() ensures proper bundling for production
  // Use dark logo for dark mode, regular logo for light mode
  const logoSource: ImageSourcePropType = isDarkMode
    ? require('../../../assets/images/darklogo.png')
    : require('../../../assets/images/logo.png');

  return (
    <View style={[styles.container, style]}>
      {/* Logo Image - Circular */}
      <View style={[
        styles.logoContainer,
        {
          width: config.icon,
          height: config.icon,
          borderRadius: config.icon / 2,
        }
      ]}>
        <Image
          source={logoSource}
          style={[
            styles.logoImage,
            {
              width: config.icon,
              height: config.icon,
              borderRadius: config.icon / 2,
            }
          ]}
          resizeMode="cover"
        />
      </View>

      {/* Wordmark "neoori" */}
      {showText && (
        <View style={[styles.textContainer, { marginLeft: config.spacing }]}>
          {/* 'n' - theme color */}
          <Text style={[
            styles.text,
            {
              fontSize: config.text,
              color: colors.textPrimary,
            }
          ]}>n</Text>
          
          {/* 'e' - theme color */}
          <Text style={[
            styles.text,
            {
              fontSize: config.text,
              color: colors.textPrimary,
            }
          ]}>e</Text>
          
          {/* First 'o' - theme color */}
          <Text style={[
            styles.text,
            {
              fontSize: config.text,
              color: colors.textPrimary,
            }
          ]}>o</Text>
          
          {/* Second 'o' - orange */}
          <Text style={[
            styles.text,
            {
              fontSize: config.text,
              color: colors.primary,
            }
          ]}>o</Text>
          
          {/* 'r' - theme color */}
          <Text style={[
            styles.text,
            {
              fontSize: config.text,
              color: colors.textPrimary,
            }
          ]}>r</Text>
          
          {/* 'i' - orange */}
          <Text style={[
            styles.text,
            {
              fontSize: config.text,
              color: colors.primary,
            }
          ]}>i</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  logoImage: {
    // Image will be circular with borderRadius
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

export default NeooriLogo;
