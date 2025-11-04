import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import AppHeader from '../../components/navigation/AppHeader';
import { MainDrawerParamList } from '../../types';

const JeuxScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  
  return (
    <View style={styles.container}>
      <AppHeader onMenuPress={() => navigation.openDrawer()} title="Jeux & Tests" />
      <ScrollView style={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={styles.title}>Jeux & Tests</Text>
        <Text style={styles.description}>
          Testez vos compétences avec des jeux et quiz interactifs
        </Text>
        <Text style={styles.comingSoon}>🎮 Fonctionnalité à venir</Text>
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
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxxl,
  },
  comingSoon: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default JeuxScreen;

