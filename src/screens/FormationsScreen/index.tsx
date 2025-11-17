import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList, Formation } from '../../types';
import { MOCK_FORMATIONS } from '../../constants/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

const FormationsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes catégories');
  const [selectedLevel, setSelectedLevel] = useState('Tous niveaux');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const featuredFormations = MOCK_FORMATIONS.filter(f => f.isFeatured);
  const recommendedFormations = MOCK_FORMATIONS.filter(f => f.matchPercentage && f.matchPercentage >= 85);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant':
        return '#FF6B35';
      case 'Intermédiaire':
        return '#F59E0B';
      case 'Avancé':
        return '#EF4444';
      default:
        return colors.primary;
    }
  };

  const renderFeaturedCard = ({ item }: { item: Formation }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { backgroundColor: colors.cardBackground }]}
      activeOpacity={0.9}
    >
      <View style={styles.featuredImageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={28} color="white" />
          </View>
        </View>
        <View style={styles.featuredBadges}>
          <View style={[styles.categoryBadge, { backgroundColor: '#FF6B35' }]}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
          {item.matchPercentage && (
            <View style={[styles.matchBadge, { backgroundColor: '#FF8C42' }]}>
              <Text style={styles.matchBadgeText}>{item.matchPercentage}% match</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.featuredContent}>
        <Text style={[styles.featuredTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.featuredDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.featuredFooter}>
          <View style={styles.providerInfo}>
            <Image source={{ uri: item.provider.logo }} style={styles.providerLogo} />
            <Text style={[styles.providerName, { color: colors.textSecondary }]}>
              {item.provider.name}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
              {item.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendedCard = ({ item }: { item: Formation }) => (
    <TouchableOpacity
      style={[styles.recommendedCard, { backgroundColor: colors.cardBackground }]}
      activeOpacity={0.9}
    >
      <View style={styles.recommendedImageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.recommendedImage} />
        <View style={styles.recommendedOverlay} />
        <View style={styles.recommendedBadges}>
          <View style={[styles.categoryBadge, { backgroundColor: '#FF6B35' }]}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
          {item.matchPercentage && (
            <View style={[styles.matchBadge, { backgroundColor: '#FF8C42' }]}>
              <Text style={styles.matchBadgeText}>{item.matchPercentage}% match</Text>
            </View>
          )}
        </View>
        <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
          <Text style={styles.levelBadgeText}>{item.level}</Text>
        </View>
      </View>
      <View style={styles.recommendedContent}>
        <View style={styles.providerRow}>
          <Image source={{ uri: item.provider.logo }} style={styles.providerLogoSmall} />
          <Text style={[styles.providerNameSmall, { color: colors.textSecondary }]}>
            {item.provider.name}
          </Text>
        </View>
        <Text style={[styles.recommendedTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.recommendedDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.recommendedMeta}>
          <Text style={[styles.metaText, { color: colors.textTertiary }]}>
            {item.duration}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={[styles.metaText, { color: colors.textPrimary }]}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.recommendedFooter}>
          <Text style={[styles.freeText, { color: colors.textSecondary }]}>Gratuit</Text>
          <TouchableOpacity style={[styles.explorerButton, { backgroundColor: '#FF6B35' }]}>
            <Ionicons name="play" size={16} color="white" />
            <Text style={styles.explorerButtonText}>Explorer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAllFormationsCard = ({ item }: { item: Formation }) => (
    <TouchableOpacity
      style={[styles.allFormationsCard, { backgroundColor: colors.cardBackground }]}
      activeOpacity={0.9}
    >
      <View style={styles.allFormationsImageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.allFormationsImage} />
        <View style={styles.allFormationsOverlay} />
        <View style={[styles.categoryBadge, { backgroundColor: '#FF6B35', position: 'absolute', top: SPACING.md, left: SPACING.md }]}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.allFormationsContent}>
        <View style={styles.providerRow}>
          <Image source={{ uri: item.provider.logo }} style={styles.providerLogoSmall} />
          <Text style={[styles.providerNameSmall, { color: colors.textSecondary }]}>
            {item.provider.name}
          </Text>
        </View>
        <Text style={[styles.allFormationsTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.allFormationsFooter}>
          <View style={styles.ratingReviewContainer}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={[styles.ratingReviewText, { color: colors.textPrimary }]}>
              {item.rating} ({item.reviewCount})
            </Text>
          </View>
          <Text style={[styles.freeText, { color: colors.textSecondary }]}>
            {item.isFree ? 'Gratuit' : 'Payant'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        onMenuPress={() => navigation.openDrawer()} 
        onProfilePress={() => setShowProfileModal(true)}
        title="Formations" 
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadges}>
            <View style={[styles.heroBadge, { backgroundColor: '#FF6B35' }]}>
              <Ionicons name="school" size={14} color="white" />
              <Text style={styles.heroBadgeText}>Formations</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: '#FF6B35' }]}>
              <Text style={styles.heroBadgeText}>{MOCK_FORMATIONS.length} formations disponibles</Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            Des formations pour{' '}
            <Text style={{ color: '#A78BFA' }}>développer tes compétences</Text>
          </Text>
          <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
            Accède à des formations de qualité, sélectionnées par notre IA en fonction de ton profil
            et de tes objectifs professionnels.
          </Text>

          {/* Search and Filters */}
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: colors.surfaceBackground }]}>
              <Ionicons name="search" size={20} color={colors.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Rechercher une formation..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.filtersRow}>
              <TouchableOpacity
                style={[styles.filterButton, { backgroundColor: colors.surfaceBackground }]}
              >
                <Text style={[styles.filterText, { color: colors.textPrimary }]}>
                  {selectedCategory}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, { backgroundColor: colors.surfaceBackground }]}
              >
                <Text style={[styles.filterText, { color: colors.textPrimary }]}>
                  {selectedLevel}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Featured Formations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Formations en vedette
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredFormations}
            renderItem={renderFeaturedCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={CARD_WIDTH + SPACING.lg}
            decelerationRate="fast"
          />
        </View>

        {/* Recommended Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="thumbs-up" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Recommandé pour toi
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedFormations}
            renderItem={renderRecommendedCard}
            keyExtractor={(item) => item.id + '_rec'}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={CARD_WIDTH + SPACING.lg}
            decelerationRate="fast"
          />
        </View>

        {/* All Formations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="list" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Toutes les formations
        </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={MOCK_FORMATIONS}
            renderItem={renderAllFormationsCard}
            keyExtractor={(item) => item.id + '_all'}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={CARD_WIDTH + SPACING.lg}
            decelerationRate="fast"
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
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
  searchContainer: {
    gap: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  filterText: {
    fontSize: FONTS.sizes.sm,
  },
  section: {
    marginTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  seeAllText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
  horizontalList: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  featuredCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.lg,
  },
  featuredImageContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadges: {
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
  matchBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  matchBadgeText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  featuredContent: {
    padding: SPACING.lg,
  },
  featuredTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  featuredDescription: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  providerLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  providerName: {
    fontSize: FONTS.sizes.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  ratingText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  recommendedCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.lg,
  },
  recommendedImageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  recommendedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  recommendedBadges: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelBadgeText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  recommendedContent: {
    padding: SPACING.lg,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  providerLogoSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  providerNameSmall: {
    fontSize: FONTS.sizes.xs,
  },
  recommendedTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  recommendedDescription: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
  },
  recommendedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  freeText: {
    fontSize: FONTS.sizes.sm,
  },
  explorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  explorerButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  allFormationsCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.lg,
  },
  allFormationsImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  allFormationsImage: {
    width: '100%',
    height: '100%',
  },
  allFormationsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  allFormationsContent: {
    padding: SPACING.lg,
  },
  allFormationsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
  },
  allFormationsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  ratingReviewText: {
    fontSize: FONTS.sizes.xs,
  },
});

export default FormationsScreen;

