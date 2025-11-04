import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import AppHeader from '../../components/navigation/AppHeader';
import { MainDrawerParamList } from '../../types';

const AboutScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader onMenuPress={() => navigation.openDrawer()} title="À propos" />
      <ScrollView style={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>À propos de Neoori</Text>
        
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Notre Mission</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Neoori est une plateforme d'apprentissage professionnel qui révolutionne 
            la façon dont vous développez votre carrière. Nous utilisons le format 
            vidéo court pour rendre l'apprentissage engageant et accessible.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Format Innovant</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Inspiré par les formats de contenu court, Neoori offre des vidéos 
            professionnelles personnalisées selon vos objectifs de carrière.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Matching Intelligent</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Notre algorithme analyse vos intérêts et votre parcours pour vous 
            recommander le contenu le plus pertinent pour votre développement.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>© 2025 Neoori. Tous droits réservés.</Text>
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
    marginBottom: SPACING.xxxl,
  },
  card: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.md,
  },
  cardText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
  },
  footer: {
    marginTop: SPACING.xxxl,
    alignItems: 'center',
  },
  version: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  copyright: {
    fontSize: FONTS.sizes.sm,
  },
});

export default AboutScreen;

