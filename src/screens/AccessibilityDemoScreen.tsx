import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { FONTS, SPACING } from '../constants/theme';
import AppHeader from '../components/navigation/AppHeader';
import { MainDrawerParamList } from '../types';
import ThemeToggle from '../components/ui/ThemeToggle';

const ColorSwatch = ({ color, name }: { color: string; name: string }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.colorSwatchContainer}>
      <View style={[styles.colorSwatch, { backgroundColor: color }]} />
      <Text style={[styles.colorName, { color: colors.textPrimary }]}>{name}</Text>
      <Text style={[styles.colorValue, { color: colors.textSecondary }]}>{color}</Text>
    </View>
  );
};

const TextSample = ({ style, label, text }: { style: any; label: string; text: string }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.textSampleContainer}>
      <Text style={[styles.textSampleLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[style, { color: (style as any).color || colors.textPrimary }]}>{text}</Text>
    </View>
  );
};

const ButtonSample = ({ 
  label, 
  variant = 'primary' 
}: { 
  label: string; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' 
}) => {
  const { colors } = useTheme();
  
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: { backgroundColor: colors.primary },
          text: { color: '#FFFFFF' }
        };
      case 'secondary':
        return {
          button: { backgroundColor: colors.cardBackground },
          text: { color: colors.textPrimary }
        };
      case 'outline':
        return {
          button: { 
            backgroundColor: 'transparent', 
            borderWidth: 1, 
            borderColor: colors.primary 
          },
          text: { color: colors.primary }
        };
      case 'danger':
        return {
          button: { backgroundColor: colors.error },
          text: { color: '#FFFFFF' }
        };
    }
  };
  
  const buttonStyles = getButtonStyles();
  
  return (
    <TouchableOpacity 
      style={[styles.button, buttonStyles.button]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.buttonText, buttonStyles.text]}>{label}</Text>
    </TouchableOpacity>
  );
};

const AccessibilityDemoScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors, theme, toggleTheme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader onMenuPress={() => navigation.openDrawer()} title="Accessibilité" />
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Démo d'Accessibilité
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>
              Thème Actuel: {theme === 'dark' ? 'Sombre' : 'Clair'}
            </Text>
            <View style={styles.themeToggleContainer}>
              <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>
                Changer de thème:
              </Text>
              <ThemeToggle showLabel={true} />
            </View>
          </View>
          
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Palette de Couleurs
          </Text>
          
          <View style={styles.colorsContainer}>
            <ColorSwatch color={colors.background} name="Background" />
            <ColorSwatch color={colors.cardBackground} name="Card Background" />
            <ColorSwatch color={colors.primary} name="Primary" />
            <ColorSwatch color={colors.primaryDark} name="Primary Dark" />
            <ColorSwatch color={colors.textPrimary} name="Text Primary" />
            <ColorSwatch color={colors.textSecondary} name="Text Secondary" />
            <ColorSwatch color={colors.error} name="Error" />
            <ColorSwatch color={colors.success} name="Success" />
            <ColorSwatch color={colors.warning} name="Warning" />
          </View>
          
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Typographie
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <TextSample 
              style={{ fontSize: FONTS.sizes.xxxl, fontWeight: FONTS.weights.bold }} 
              label="Titre (xxxl)" 
              text="Grand Titre" 
            />
            <TextSample 
              style={{ fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.bold }} 
              label="Titre (xxl)" 
              text="Titre Moyen" 
            />
            <TextSample 
              style={{ fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.semiBold }} 
              label="Sous-titre (xl)" 
              text="Sous-titre" 
            />
            <TextSample 
              style={{ fontSize: FONTS.sizes.md }} 
              label="Texte (md)" 
              text="Texte standard pour le contenu principal" 
            />
            <TextSample 
              style={{ fontSize: FONTS.sizes.sm, color: colors.textSecondary }} 
              label="Texte secondaire (sm)" 
              text="Texte secondaire ou explicatif" 
            />
          </View>
          
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Boutons
          </Text>
          
          <View style={styles.buttonsContainer}>
            <ButtonSample label="Bouton Primaire" variant="primary" />
            <ButtonSample label="Bouton Secondaire" variant="secondary" />
            <ButtonSample label="Bouton Contour" variant="outline" />
            <ButtonSample label="Bouton Danger" variant="danger" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    marginTop: 100, // Pour laisser de l'espace pour le header
  },
  content: {
    padding: SPACING.xxxl,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xl,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.md,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  themeLabel: {
    fontSize: FONTS.sizes.md,
    marginRight: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorSwatchContainer: {
    width: '30%',
    marginBottom: SPACING.lg,
  },
  colorSwatch: {
    height: 50,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  colorName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  colorValue: {
    fontSize: FONTS.sizes.xs,
  },
  textSampleContainer: {
    marginBottom: SPACING.lg,
  },
  textSampleLabel: {
    fontSize: FONTS.sizes.xs,
    marginBottom: SPACING.xs,
  },
  buttonsContainer: {
    marginBottom: SPACING.xl,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  buttonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
});

export default AccessibilityDemoScreen;
