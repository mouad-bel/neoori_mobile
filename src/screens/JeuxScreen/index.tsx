import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';
import { MOCK_GAMES } from '../../constants/mockData';

const JeuxScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const filteredGames = MOCK_GAMES;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        onMenuPress={() => navigation.openDrawer()}
        title="Jeux & Tests" 
        onProfilePress={() => setShowProfileModal(true)}
      />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Jeux & Tests de Découverte</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Rechercher..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="filter" size={20} color={colors.background} />
              <Text style={[styles.filterButtonText, { color: colors.background }]}>Filtrer</Text>
            </TouchableOpacity>
          </View>
        </View>

      {/* Available Games Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Jeux Disponibles</Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesScroll}
        >
          {filteredGames.map((game) => (
            <View key={game.id} style={[styles.gameCard, { backgroundColor: colors.cardBackground }]}>
              <ImageBackground
                source={{ uri: game.image }}
                style={styles.gameImage}
                imageStyle={styles.gameImageStyle}
              >
                <View style={styles.gameImageOverlay} />
                <View style={styles.difficultyBadge}>
                  <Text style={[styles.difficultyText, { color: colors.background }]}>{game.difficulty}</Text>
                </View>
              </ImageBackground>

              <View style={styles.gameContent}>
                <View style={[styles.gameIconContainer, { backgroundColor: colors.background }]}>
                  <Ionicons name={game.icon as any} size={24} color={colors.primary} />
                </View>

                <Text style={[styles.gameTitle, { color: colors.textPrimary }]}>{game.title}</Text>
                
                <Text style={[styles.gameDetails, { color: colors.textSecondary }]}>
                  {game.duration} • {game.questions} questions
                </Text>
                
                <Text style={[styles.gameDescription, { color: colors.textSecondary }]}>{game.description}</Text>

                <View style={styles.gameFooter}>
                  <View style={styles.credits}>
                    <Ionicons name="logo-bitcoin" size={16} color="#F59E0B" />
                    <Text style={styles.creditsText}>{game.credits} crédits</Text>
                  </View>

                  {game.progress !== undefined && (
                    <View style={styles.progressContainer}>
                      <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progression</Text>
                      <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
                        <View 
                          style={[styles.progressFill, { width: `${game.progress}%`, backgroundColor: colors.primary }]} 
                        />
                      </View>
                    </View>
                  )}

                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.actionButtonText, { color: colors.background }]}>
                      {game.status === 'in-progress' ? 'Reprendre' : 'Commencer'} →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <ProfileModal 
        visible={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80, // Space for AppHeader
  },
  header: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: SPACING.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: FONTS.sizes.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  filterButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  section: {
    padding: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    marginBottom: SPACING.xl,
  },
  gamesScroll: {
    gap: SPACING.lg,
  },
  gameCard: {
    width: 320,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: 180,
  },
  gameImageStyle: {
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderTopRightRadius: BORDER_RADIUS.md,
  },
  gameImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  difficultyBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  gameContent: {
    padding: SPACING.lg,
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  gameTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  gameDetails: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
  },
  gameDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  gameFooter: {
    gap: SPACING.md,
  },
  credits: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsText: {
    color: '#F59E0B',
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  progressContainer: {
    gap: SPACING.xs,
  },
  progressLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});

export default JeuxScreen;
