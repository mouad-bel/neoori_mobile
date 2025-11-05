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
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

const RecompensesScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const currentCredits = 75;
  const categories = ['#Carrière', '#Formation', '#Conseil', '#Support'];

  const badges = [
    {
      id: '1',
      name: 'Explorateur',
      description: "A complété son premier test d'intérêts",
      icon: 'star',
      color: '#10B981',
      unlocked: true,
      progress: 100,
    },
    {
      id: '2',
      name: 'Communicant',
      description: 'A obtenu un score élevé en communication',
      icon: 'people',
      color: '#3B82F6',
      unlocked: true,
      progress: 100,
    },
    {
      id: '3',
      name: 'Profil complet',
      description: 'A rempli toutes les sections du profil',
      icon: 'person',
      color: '#8B5CF6',
      unlocked: false,
      progress: 65,
    },
    {
      id: '4',
      name: 'Mentor',
      description: 'A aidé 3 autres utilisateurs',
      icon: 'people-outline',
      color: '#F97316',
      unlocked: false,
      progress: 33,
    },
  ];

  const tasks = [
    {
      id: '1',
      title: 'Terminer un test',
      description: "Complète n'importe quel test dans la section Jeux & Tests",
      credits: 15,
      completed: true,
      icon: 'checkmark-circle',
      iconColor: '#10B981',
    },
    {
      id: '2',
      title: 'Compléter le profil',
      description: 'Ajoute toutes les informations demandées dans ton profil',
      credits: 20,
      completed: false,
      icon: 'person-outline',
      iconColor: colors.textSecondary,
      actionText: 'Commencer maintenant',
    },
    {
      id: '3',
      title: 'Échanger avec le coach',
      description: 'Pose au moins 3 questions à ton coach IA',
      credits: 10,
      completed: true,
      icon: 'checkmark-circle',
      iconColor: '#10B981',
    },
    {
      id: '4',
      title: 'Télécharger un document',
      description: 'Ajoute ton CV ou un bulletin de notes à ton profil',
      credits: 15,
      completed: false,
      icon: 'document-outline',
      iconColor: colors.textSecondary,
      actionText: 'Commencer maintenant',
    },
  ];

  const rewards = [
    {
      id: '1',
      title: 'Atelier CV',
      description: 'Session personnalisée pour optimiser ton CV avec un expert',
      category: 'Carrière',
      credits: 50,
      validity: 'Valable 30 jours',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
      available: true,
      popular: true,
    },
    {
      id: '2',
      title: 'Session mentor',
      description: '30 minutes d\'échange avec un mentor dans ton domaine',
      category: 'Conseil',
      credits: 100,
      validity: 'Valable 60 jours',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      available: false,
      popular: false,
    },
    {
      id: '3',
      title: 'Pack conseils express',
      description: '3 questions prioritaires à notre équipe d\'experts',
      category: 'Support',
      credits: 75,
      validity: 'Valable 45 jours',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      available: true,
      popular: true,
    },
    {
      id: '4',
      title: 'Webinaire exclusif',
      description: 'Accès à un webinaire exclusif sur les tendances du marché',
      category: 'Formation',
      credits: 60,
      validity: 'Prochain événement',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
      available: true,
      popular: false,
    },
  ];

  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        onMenuPress={() => navigation.openDrawer()}
        onProfilePress={() => setShowProfileModal(true)}
        title="Récompenses"
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadges}>
            <View style={[styles.heroBadge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.heroBadgeText}>Récompenses</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: colors.surfaceBackground }]}>
              <Text style={[styles.heroBadgeText, { color: colors.textSecondary }]}>
                {unlockedBadges} badges débloqués
              </Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            Récompenses & Crédits pour{' '}
            <Text style={{ color: '#10B981' }}>valoriser tes efforts</Text>
          </Text>
          <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
            Tes efforts te récompensent. Gagne des crédits et débloque des avantages exclusifs pour
            accélérer ton parcours professionnel.
          </Text>

          {/* Category Tags */}
          <View style={styles.categoryTags}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryTag,
                  { backgroundColor: colors.surfaceBackground },
                  selectedCategory === category && { backgroundColor: '#10B981' },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryTagText,
                    { color: colors.textPrimary },
                    selectedCategory === category && { color: 'white' },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Current Credits Section */}
        <View style={[styles.creditsCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.creditsLeft}>
            <View style={styles.creditsIcon}>
              <Ionicons name="logo-bitcoin" size={32} color="#10B981" />
            </View>
            <View style={styles.creditsInfo}>
              <Text style={[styles.creditsAmount, { color: '#10B981' }]} numberOfLines={1}>
                {currentCredits} crédits
              </Text>
              <Text style={[styles.creditsSubtext, { color: colors.textSecondary }]} numberOfLines={2}>
                Ton solde actuel • Dernière activité: aujourd'hui
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.earnMoreButton, { backgroundColor: '#10B981' }]}>
            <Text style={styles.earnMoreButtonText} numberOfLines={1}>
              Gagner plus de crédits →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Wrapper */}
        <View style={styles.contentWrapper}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Badges Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="trophy" size={24} color="#10B981" />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Badges gagnés
                </Text>
              </View>
              <Text style={[styles.sectionProgress, { color: colors.textSecondary }]}>
                {unlockedBadges}/{badges.length} débloqués
              </Text>

              <View style={styles.badgesGrid}>
                {badges.map((badge) => (
                  <View
                    key={badge.id}
                    style={[
                      styles.badgeCard,
                      {
                        backgroundColor: badge.unlocked
                          ? badge.color
                          : colors.surfaceBackground,
                      },
                    ]}
                  >
                    <Ionicons
                      name={badge.icon as any}
                      size={32}
                      color={badge.unlocked ? 'white' : colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.badgeName,
                        { color: badge.unlocked ? 'white' : colors.textPrimary },
                      ]}
                    >
                      {badge.name}
                    </Text>
                    <Text
                      style={[
                        styles.badgeDescription,
                        { color: badge.unlocked ? 'rgba(255,255,255,0.9)' : colors.textSecondary },
                      ]}
                    >
                      {badge.description}
                    </Text>
                    {!badge.unlocked && (
                      <View style={styles.badgeProgressContainer}>
                        <View style={[styles.badgeProgressBar, { backgroundColor: colors.border }]}>
                          <View
                            style={[
                              styles.badgeProgressFill,
                              { width: `${badge.progress}%`, backgroundColor: badge.color },
                            ]}
                          />
                        </View>
                        <Text style={[styles.badgeProgressText, { color: badge.color }]}>
                          {badge.progress}%
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* How to Earn Credits Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="gift" size={24} color="#10B981" />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Comment gagner des crédits
                </Text>
              </View>
              <Text style={[styles.sectionProgress, { color: colors.textSecondary }]}>
                {completedTasks}/{tasks.length} complétées
              </Text>

              <View style={styles.tasksList}>
                {tasks.map((task) => (
                  <View key={task.id} style={[styles.taskCard, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.taskHeader}>
                      <View style={styles.taskLeft}>
                        <View
                          style={[
                            styles.taskIconContainer,
                            { backgroundColor: task.completed ? '#10B98120' : colors.surfaceBackground },
                          ]}
                        >
                          <Ionicons name={task.icon as any} size={24} color={task.iconColor} />
                        </View>
                        <View style={styles.taskInfo}>
                          <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>
                            {task.title}
                          </Text>
                          <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>
                            {task.description}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.taskRight}>
                        <Text style={[styles.taskCredits, { color: '#10B981' }]}>
                          +{task.credits} crédits
                        </Text>
                      </View>
                    </View>
                    {!task.completed && task.actionText && (
                      <TouchableOpacity style={styles.taskAction}>
                        <Text style={[styles.taskActionText, { color: colors.primary }]}>
                          {task.actionText} »
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Unlockable Rewards Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="gift-outline" size={24} color="#10B981" />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  À débloquer
                </Text>
              </View>
              <Text style={[styles.sectionProgress, { color: colors.textSecondary }]}>
                {rewards.filter(r => r.available).length} disponibles
              </Text>

              <View style={styles.rewardsList}>
                {rewards.map((reward) => (
                  <View key={reward.id} style={[styles.rewardCard, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.rewardImageContainer}>
                      <Image source={{ uri: reward.image }} style={styles.rewardImage} />
                      <View style={styles.rewardBadges}>
                        <View style={[styles.categoryBadge, { backgroundColor: '#8B5CF6' }]}>
                          <Text style={styles.categoryBadgeText}>{reward.category}</Text>
                        </View>
                        {reward.popular && (
                          <View style={[styles.popularBadge, { backgroundColor: '#F59E0B' }]}>
                            <Ionicons name="star" size={12} color="white" />
                            <Text style={styles.popularBadgeText}>Populaire</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.rewardContent}>
                      <Text style={[styles.rewardTitle, { color: colors.textPrimary }]}>
                        {reward.title}
                      </Text>
                      <Text style={[styles.rewardDescription, { color: colors.textSecondary }]}>
                        {reward.description}
                      </Text>
                      <View style={styles.rewardFooter}>
                        <Text style={[styles.rewardValidity, { color: colors.textTertiary }]}>
                          {reward.validity}
                        </Text>
                        <View style={styles.rewardCredits}>
                          <Ionicons name="logo-bitcoin" size={16} color="#10B981" />
                          <Text style={[styles.rewardCreditsText, { color: '#10B981' }]}>
                            {reward.credits} crédits
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.unlockButton,
                          {
                            backgroundColor: reward.available ? '#10B981' : colors.surfaceBackground,
                          },
                        ]}
                        disabled={!reward.available}
                      >
                        <Text
                          style={[
                            styles.unlockButtonText,
                            { color: reward.available ? 'white' : colors.textSecondary },
                          ]}
                        >
                          {reward.available ? 'Débloquer' : 'Indisponible'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Motivational Section */}
            <View style={[styles.motivationCard, { backgroundColor: '#8B5CF620' }]}>
              <Text style={[styles.motivationTitle, { color: colors.textPrimary }]}>
                Tes efforts te donnent du pouvoir d'action
              </Text>
              <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
                Chaque action que tu entreprends sur la plateforme te rapproche de tes objectifs et te
                permet de débloquer des ressources précieuses pour ton avenir professionnel.
              </Text>
              <TouchableOpacity style={[styles.motivationButton, { backgroundColor: '#8B5CF6' }]}>
                <Ionicons name="ribbon-outline" size={20} color="white" />
                <Text style={styles.motivationButtonText}>Découvrir les opportunités</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  heroSection: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  heroBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  heroBadgeText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
    lineHeight: 40,
  },
  heroDescription: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryTagText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  creditsCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.lg,
  },
  creditsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  creditsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditsInfo: {
    flex: 1,
  },
  creditsAmount: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  creditsSubtext: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  earnMoreButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  earnMoreButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  contentWrapper: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  leftColumn: {
    flex: isLargeScreen ? 1 : 1,
    gap: SPACING.lg,
  },
  rightColumn: {
    flex: 1,
    gap: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  sectionProgress: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.lg,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  badgeCard: {
    width: isLargeScreen ? '48%' : '100%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  badgeName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  badgeDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  badgeProgressContainer: {
    marginTop: SPACING.sm,
  },
  badgeProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  badgeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  badgeProgressText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semiBold,
  },
  tasksList: {
    gap: SPACING.md,
  },
  taskCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  taskLeft: {
    flexDirection: 'row',
    gap: SPACING.md,
    flex: 1,
  },
  taskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.xs,
  },
  taskDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  taskRight: {
    alignItems: 'flex-end',
  },
  taskCredits: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  taskAction: {
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
  },
  taskActionText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  rewardsList: {
    gap: SPACING.lg,
  },
  rewardCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  rewardImageContainer: {
    position: 'relative',
    height: 160,
  },
  rewardImage: {
    width: '100%',
    height: '100%',
  },
  rewardBadges: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  rewardContent: {
    padding: SPACING.lg,
  },
  rewardTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  rewardDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  rewardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  rewardValidity: {
    fontSize: FONTS.sizes.xs,
  },
  rewardCredits: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rewardCreditsText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  unlockButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  unlockButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  motivationCard: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  motivationTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
  },
  motivationText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  motivationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  motivationButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
});

export default RecompensesScreen;

