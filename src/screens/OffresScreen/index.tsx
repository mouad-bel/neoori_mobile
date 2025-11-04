import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const OffresScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Offres d'emploi</Text>
        <Text style={styles.description}>
          Explorez les opportunités de carrière adaptées à votre profil
        </Text>
        <Text style={styles.comingSoon}>💼 Fonctionnalité à venir</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

export default OffresScreen;

