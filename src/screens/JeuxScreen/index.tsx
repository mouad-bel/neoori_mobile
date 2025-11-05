import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';
import { MOCK_GAMES } from '../../constants/mockData';

const JeuxScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const filteredGames = MOCK_GAMES.filter(game => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return game.status === 'in-progress';
    if (activeTab === 'completed') return game.status === 'completed';
    return true;
  });

  const inProgressCount = MOCK_GAMES.filter(g => g.status === 'in-progress').length;
  const completedCount = MOCK_GAMES.filter(g => g.status === 'completed').length;

  return (
    <View style={styles.container}>
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
        <View style={styles.header}>
          <View style={styles.newBadge}>
            <Ionicons name="flash" size={14} color={COLORS.background} />
            <Text style={styles.newBadgeText}>Nouveau</Text>
          </View>
        
        <Text style={styles.title}>Jeux & Tests de Découverte</Text>
        
        <Text style={styles.description}>
          Découvre tes forces en quelques minutes. Chaque jeu enrichit ton profil IA et 
          débloque des crédits pour accéder à des services premium.
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>100% gratuit</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>Résultats instantanés</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>Crédits à gagner</Text>
          </View>
        </View>
      </View>

      {/* Why Participate Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="star" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Pourquoi participer ?</Text>
        </View>

        <View style={styles.benefitsGrid}>
          <View style={styles.benefitCard}>
            <View style={[styles.benefitIcon, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="trending-up" size={28} color="#10B981" />
            </View>
            <Text style={styles.benefitTitle}>Profil IA Enrichi</Text>
            <Text style={styles.benefitDescription}>
              Chaque jeu complété affine ton profil et améliore la précision des 
              recommandations personnalisées
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.benefitIcon, { backgroundColor: '#3B82F620' }]}>
              <Ionicons name="shield-checkmark" size={28} color="#3B82F6" />
            </View>
            <Text style={styles.benefitTitle}>Crédits Gagnés</Text>
            <Text style={styles.benefitDescription}>
              Débloque des crédits à chaque jeu terminé pour accéder à des services 
              et formations premium
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.benefitIcon, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="radio-button-on" size={28} color="#8B5CF6" />
            </View>
            <Text style={styles.benefitTitle}>Auto-Découverte</Text>
            <Text style={styles.benefitDescription}>
              Prends conscience de tes forces cachées et identifie tes axes de 
              progression prioritaires
            </Text>
          </View>
        </View>
      </View>

      {/* Available Games Section */}
      <View style={styles.section}>
        <View style={styles.gamesHeader}>
          <Text style={styles.sectionTitle}>Jeux Disponibles</Text>
          
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'all' && styles.tabActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                Tous ({MOCK_GAMES.length})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'in-progress' && styles.tabActive]}
              onPress={() => setActiveTab('in-progress')}
            >
              <Text style={[styles.tabText, activeTab === 'in-progress' && styles.tabTextActive]}>
                En cours ({inProgressCount})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
              onPress={() => setActiveTab('completed')}
            >
              <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
                Complétés ({completedCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesScroll}
        >
          {filteredGames.map((game) => (
            <View key={game.id} style={styles.gameCard}>
              <ImageBackground
                source={{ uri: game.image }}
                style={styles.gameImage}
                imageStyle={styles.gameImageStyle}
              >
                <View style={styles.gameImageOverlay} />
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{game.difficulty}</Text>
                </View>
              </ImageBackground>

              <View style={styles.gameContent}>
                <View style={styles.gameIconContainer}>
                  <Ionicons name={game.icon as any} size={24} color={COLORS.primary} />
                </View>

                <Text style={styles.gameTitle}>{game.title}</Text>
                
                <Text style={styles.gameDetails}>
                  {game.duration} • {game.questions} questions
                </Text>
                
                <Text style={styles.gameDescription}>{game.description}</Text>

                <View style={styles.gameFooter}>
                  <View style={styles.credits}>
                    <Ionicons name="logo-bitcoin" size={16} color="#F59E0B" />
                    <Text style={styles.creditsText}>{game.credits} crédits</Text>
                  </View>

                  {game.progress !== undefined && (
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressLabel}>Progression</Text>
                      <View style={styles.progressBar}>
                        <View 
                          style={[styles.progressFill, { width: `${game.progress}%` }]} 
                        />
                      </View>
                    </View>
                  )}

                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>
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
    backgroundColor: COLORS.background,
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
  newBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
  },
  newBadgeText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.sm,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  section: {
    padding: SPACING.xl,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  benefitsGrid: {
    gap: SPACING.lg,
  },
  benefitCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  benefitTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  benefitDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  gamesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    flexWrap: 'wrap',
  },
  tabs: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
  },
  tabActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  gamesScroll: {
    gap: SPACING.lg,
  },
  gameCard: {
    width: 320,
    backgroundColor: COLORS.cardBackground,
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
    color: COLORS.background,
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  gameTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  gameDetails: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  gameDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  actionButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});

export default JeuxScreen;
