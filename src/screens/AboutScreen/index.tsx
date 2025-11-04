import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import AppHeader from '../../components/navigation/AppHeader';
import { MainDrawerParamList } from '../../types';

const AboutScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  
  return (
    <View style={styles.container}>
      <AppHeader onMenuPress={() => navigation.openDrawer()} title="À propos" />
      <ScrollView style={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={styles.title}>À propos de Neoori</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notre Mission</Text>
          <Text style={styles.cardText}>
            Neoori est une plateforme d'apprentissage professionnel qui révolutionne 
            la façon dont vous développez votre carrière. Nous utilisons le format 
            vidéo court pour rendre l'apprentissage engageant et accessible.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Format Innovant</Text>
          <Text style={styles.cardText}>
            Inspiré par les formats de contenu court, Neoori offre des vidéos 
            professionnelles personnalisées selon vos objectifs de carrière.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Matching Intelligent</Text>
          <Text style={styles.cardText}>
            Notre algorithme analyse vos intérêts et votre parcours pour vous 
            recommander le contenu le plus pertinent pour votre développement.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2024 Neoori. Tous droits réservés.</Text>
        </View>
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxxl,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  cardText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  footer: {
    marginTop: SPACING.xxxl,
    alignItems: 'center',
  },
  version: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  copyright: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
});

export default AboutScreen;

