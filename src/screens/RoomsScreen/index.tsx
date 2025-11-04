import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { FONTS, SPACING } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import AppHeader from '../../components/navigation/AppHeader';
import { MainDrawerParamList } from '../../types';

const RoomsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader onMenuPress={() => navigation.openDrawer()} title="Rooms" />
      <ScrollView style={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Rooms</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Rejoignez des salles de discussion et échangez avec des professionnels
        </Text>
        <Text style={[styles.comingSoon, { color: colors.primary }]}>💬 Fonctionnalité à venir</Text>
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
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONTS.sizes.lg,
    marginBottom: SPACING.xxxl,
  },
  comingSoon: {
    fontSize: FONTS.sizes.xl,
    textAlign: 'center',
  },
});

export default RoomsScreen;

