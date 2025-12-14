import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS, COLORS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

const DashboardScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const userName = user?.name?.split(' ')[1] || 'Fahmani';
  const profileCompletion = 65;
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const stats = [
    {
      id: '1',
      icon: 'grid-outline',
      title: 'Tests complétés',
      value: '3',
      change: '+1',
      iconBg: COLORS.primary,
    },
    {
      id: '2',
      icon: 'ribbon-outline',
      title: 'Crédits disponibles',
      value: '75',
      change: '+15',
      iconBg: COLORS.primary,
    },
    {
      id: '3',
      icon: 'trending-up-outline',
      title: 'Recommandations',
      value: '8',
      change: null,
      iconBg: COLORS.primaryLight,
    },
    {
      id: '4',
      icon: 'person-outline',
      title: 'Profil complété',
      value: '65%',
      change: null,
      iconBg: COLORS.accentPeach,
    },
  ];

  const profileSections = [
    { id: '1', title: 'Informations de base', status: 'completed', icon: 'checkmark-circle' },
    { id: '2', title: 'Expériences', status: 'completed', icon: 'checkmark-circle' },
    { id: '3', title: 'Compétences', status: 'in-progress', icon: 'time-outline' },
    { id: '4', title: 'Documents', status: 'to-complete', icon: 'document-outline' },
  ];

  const gamesTests = [
    {
      id: '1',
      icon: 'star-outline',
      title: 'Intérêts & Motivation',
      description: 'Découvrez ce qui vous anime',
      progress: 100,
      action: 'Refaire',
    },
    {
      id: '2',
      icon: 'people-outline',
      title: 'Soft skills en action',
      description: 'Évaluez vos compétences relationnelles',
      progress: 25,
      action: 'Continuer',
    },
  ];

  const recommendations = [
    {
      id: '1',
      title: 'Marketing Digital Fondamentaux',
      type: 'Formation',
      match: 87,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    },
    {
      id: '2',
      title: 'Chargé(e) de Communication',
      type: 'Opportunité',
      match: 92,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    },
  ];

  const recentActivities = [
    { id: '1', text: 'Vous avez complété le test "Intérêts & Motivation"', time: 'Il y a 2 jours' },
    { id: '2', text: 'Vous avez gagné 15 crédits', time: 'Il y a 2 jours' },
    { id: '3', text: 'Vous avez mis à jour votre profil', time: 'Il y a 5 jours' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.primary; // Brand orange
      case 'in-progress':
        return COLORS.accentPeach; // Light orange/peach
      case 'to-complete':
        return colors.textTertiary;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'in-progress':
        return 'En cours';
      case 'to-complete':
        return 'À compléter';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        onProfilePress={() => setShowProfileModal(true)}
        title="Tableau de bord"
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Gradient - Strong Beautiful Orange Composition */}
        <LinearGradient
          colors={[
            '#FF7D4A', // Strong vibrant orange - top
            '#FF9D6B', // Warm orange - middle
            '#FFB896'  // Soft peach-orange - bottom
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroBadge}>
            <Ionicons name="flash" size={14} color="white" />
            <Text style={styles.heroBadgeText}>Tableau de bord</Text>
          </View>
          <Text style={styles.heroGreeting}>Bonjour {userName}! 👋</Text>
          <Text style={styles.heroWelcome}>
            Bienvenue sur votre espace personnalisé. Continuez votre parcours et découvrez de
            nouvelles opportunités.
          </Text>

          <View style={styles.heroCards}>
            <View style={styles.heroCard}>
              <Text style={styles.heroCardLabel}>Progression</Text>
              <Text style={styles.heroCardValue}>{profileCompletion}%</Text>
              <View style={styles.heroProgressBar}>
                <View style={[styles.heroProgressFill, { width: `${profileCompletion}%` }]} />
              </View>
            </View>
            <View style={styles.heroCard}>
              <Text style={styles.heroCardLabel}>Aujourd'hui</Text>
              <Text style={styles.heroCardValue}>{currentDate}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.id} style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.iconBg + '20' }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.iconBg} />
              </View>
              <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{stat.title}</Text>
              <View style={styles.statBottom}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value}</Text>
                {stat.change && (
                  <View style={styles.statChange}>
                    <Ionicons name="trending-up" size={14} color={colors.primary} />
                    <Text style={[styles.statChangeText, { color: colors.primary }]}>{stat.change}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Main Content Wrapper */}
        <View style={styles.contentWrapper}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Profile Progression Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Progression de votre profil
                </Text>
                <TouchableOpacity style={[styles.completeButton, { backgroundColor: colors.primary }]}>
                  <Text style={styles.completeButtonText}>Compléter →</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.profileProgressInfo}>
                <Text style={[styles.profileProgressText, { color: colors.textSecondary }]}>
                  {profileCompletion}% complété
                </Text>
                <View style={styles.profileProgressBar}>
                  <View
                    style={[styles.profileProgressFill, { width: `${profileCompletion}%` }]}
                  />
                </View>
              </View>
              <View style={styles.profileSectionsGrid}>
                {profileSections.map((section) => (
                  <View
                    key={section.id}
                    style={[
                      styles.profileSectionCard,
                      { backgroundColor: colors.surfaceBackground },
                    ]}
                  >
                    <Ionicons
                      name={section.icon as any}
                      size={24}
                      color={getStatusColor(section.status)}
                    />
                    <Text style={[styles.profileSectionTitle, { color: colors.textPrimary }]}>
                      {section.title}
                    </Text>
                    <Text
                      style={[
                        styles.profileSectionStatus,
                        { color: getStatusColor(section.status) },
                      ]}
                    >
                      {getStatusText(section.status)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Jeux & Tests Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Jeux & Tests
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Jeux')}>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tous →</Text>
                </TouchableOpacity>
              </View>
              {gamesTests.map((game) => (
                <View key={game.id} style={styles.gameCard}>
                  <View style={styles.gameHeader}>
                    <Ionicons name={game.icon as any} size={24} color={colors.textPrimary} />
                    <View style={styles.gameInfo}>
                      <Text style={[styles.gameTitle, { color: colors.textPrimary }]}>
                        {game.title}
                      </Text>
                      <Text style={[styles.gameDescription, { color: colors.textSecondary }]}>
                        {game.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.gameProgress}>
                    <Text style={[styles.gameProgressLabel, { color: colors.textSecondary }]}>
                      Progression
                    </Text>
                    <View style={styles.gameProgressBar}>
                      <View
                        style={[styles.gameProgressFill, { width: `${game.progress}%` }]}
                      />
                    </View>
                    <Text style={[styles.gameProgressPercent, { color: colors.primary }]}>
                      {game.progress}%
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.gameActionButton, { backgroundColor: colors.primary }]}
                  >
                    <Text style={styles.gameActionText}>{game.action}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Recommandations Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Recommandations pour vous
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir toutes →</Text>
                </TouchableOpacity>
              </View>
              {recommendations.map((rec) => (
                <View key={rec.id} style={styles.recommendationCard}>
                  <View style={styles.recommendationImageContainer}>
                    <Image source={{ uri: rec.image }} style={styles.recommendationImage} />
                    <View style={[styles.matchBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.matchBadgeText}>{rec.match}% match</Text>
                    </View>
                  </View>
                  <View style={styles.recommendationContent}>
                    <Text style={[styles.recommendationTitle, { color: colors.textPrimary }]}>
                      {rec.title}
                    </Text>
                    <Text style={[styles.recommendationType, { color: colors.textSecondary }]}>
                      {rec.type}
                    </Text>
                    <TouchableOpacity>
                      <Text style={[styles.learnMoreText, { color: colors.primary }]}>
                        En savoir plus
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Coach IA Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.coachHeader}>
                <View style={[styles.coachIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Ionicons name="chatbubble-outline" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.coachTitleContainer}>
                  <Text style={[styles.coachTitle, { color: colors.textPrimary }]}>Coach IA</Text>
                  <Text style={[styles.coachAvailability, { color: colors.primary }]}>
                    Disponible 24/7
                  </Text>
                </View>
              </View>
              <Text style={[styles.coachMessage, { color: colors.textPrimary }]}>
                Bonjour Sophie ! Votre profil progresse bien. Que diriez-vous de compléter la section
                compétences aujourd'hui ?
              </Text>
              <TouchableOpacity style={[styles.coachButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.coachButtonText}>Discuter avec mon coach →</Text>
              </TouchableOpacity>
            </View>

            {/* Activités récentes Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Activités récentes
              </Text>
              <View style={styles.activitiesList}>
                {recentActivities.map((activity) => (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={styles.greenDot} />
                    <View style={styles.activityContent}>
                      <Text style={[styles.activityText, { color: colors.textPrimary }]}>
                        {activity.text}
                      </Text>
                      <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                        {activity.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Vos crédits Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.creditsHeaderRow}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Vos crédits
                </Text>
                <Text style={[styles.creditsValue, { color: colors.primary }]}>75</Text>
              </View>
              <Text style={[styles.creditsDescription, { color: colors.textSecondary }]}>
                Utilisez vos crédits pour débloquer des services premium comme des sessions de
                mentorat ou des ateliers spécialisés.
              </Text>
              <TouchableOpacity
                style={[styles.rewardsButton, { backgroundColor: colors.surfaceBackground }]}
                onPress={() => navigation.navigate('Recompenses')}
              >
                <Text style={[styles.rewardsButtonText, { color: colors.textPrimary }]}>
                  Voir les récompenses →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Floating Chat Button */}
        <TouchableOpacity style={styles.floatingChatButton}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.floatingButtonGradient}
          >
            <Ionicons name="chatbubble-outline" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
      <ProfileModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    marginTop: 100,
  },
  heroGradient: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
  },
  heroBadgeText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  heroGreeting: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    color: 'white',
    marginBottom: SPACING.md,
  },
  heroWelcome: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  heroCards: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  heroCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  heroCardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  heroCardValue: {
    color: 'white',
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  heroProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    marginTop: -SPACING.xxxl,
    marginBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  statCard: {
    width: isLargeScreen ? '23%' : '48%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statTitle: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.sm,
  },
  statBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statChangeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semiBold,
  },
  contentWrapper: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  leftColumn: {
    flex: isLargeScreen ? 1.5 : 1,
    gap: SPACING.lg,
  },
  rightColumn: {
    flex: 1,
    gap: SPACING.lg,
  },
  section: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  completeButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  completeButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  seeAllText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  profileProgressInfo: {
    marginBottom: SPACING.lg,
  },
  profileProgressText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  profileProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  profileProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  profileSectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileSectionCard: {
    width: '48%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  profileSectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  profileSectionStatus: {
    fontSize: FONTS.sizes.xs,
  },
  gameCard: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  gameHeader: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.xs,
  },
  gameDescription: {
    fontSize: FONTS.sizes.sm,
  },
  gameProgress: {
    marginBottom: SPACING.md,
  },
  gameProgressLabel: {
    fontSize: FONTS.sizes.xs,
    marginBottom: SPACING.xs,
  },
  gameProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  gameProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  gameProgressPercent: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semiBold,
  },
  gameActionButton: {
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  gameActionText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  recommendationCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  recommendationImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  recommendationImage: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  matchBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
  },
  recommendationContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recommendationTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.xs,
  },
  recommendationType: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  learnMoreText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  coachHeader: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  coachIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachTitleContainer: {
    flex: 1,
  },
  coachTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: 2,
  },
  coachAvailability: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  coachMessage: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  coachButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  coachButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  activitiesList: {
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  activityItem: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: FONTS.sizes.xs,
  },
  creditsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  creditsValue: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
  },
  creditsDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  rewardsButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  rewardsButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});

export default DashboardScreen;

