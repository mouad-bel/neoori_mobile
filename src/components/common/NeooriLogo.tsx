import React from 'react';
import { View, StyleSheet, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../store/ThemeContext';

interface NeooriLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  showText?: boolean; // Kept for backward compatibility but not used
}

const NeooriLogo: React.FC<NeooriLogoProps> = ({ 
  size = 'medium',
  style,
  showText = true // Not used anymore, logo image contains the text
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Size configuration - explicit width and height to prevent expansion
  const sizeConfig = {
    small: { width: 60, height: 30 },
    medium: { width: 100, height: 50 },
    large: { width: 140, height: 70 },
  };

  const config = sizeConfig[size];

  // Logo image source - using require() ensures proper bundling for production
  // Use negative/inverted logo for dark mode, original logo for light mode
  // These logos already contain the "neoori" text, so we don't render text separately
  const logoSource: ImageSourcePropType = isDarkMode
    ? require('../../../assets/images/png/logo mode négatif alternative@2x-8.png')
    : require('../../../assets/images/png/logo origine_1@2x-8.png');

  return (
    <View style={[styles.container, { width: config.width, height: config.height }, style]}>
      <Image
        source={logoSource}
        style={[
          styles.logoImage,
          {
            width: config.width,
            height: config.height,
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Fixed size container - prevents expansion
    overflow: 'hidden',
  },
  logoImage: {
    // Explicit size constraints
  },
});

export default NeooriLogo;
