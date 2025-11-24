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
import { MainDrawerParamList, JobOffer } from '../../types';
import { MOCK_JOB_OFFERS } from '../../constants/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const OffresScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(MOCK_JOB_OFFERS.filter(job => job.isFavorite).map(job => job.id))
  );

  const recommendedOffers = MOCK_JOB_OFFERS.filter(job => job.isRecommended);

  const toggleFavorite = (jobId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(jobId)) {
        newFavorites.delete(jobId);
      } else {
        newFavorites.add(jobId);
      }
      return newFavorites;
    });
  };

  const getWorkTypeIcon = (workType: string) => {
    switch (workType) {
      case 'Télétravail':
        return 'home';
      case 'Hybride':
        return 'business';
      case 'Sur site':
        return 'location';
      default:
        return 'business';
    }
  };

  const renderRecommendedCard = ({ item }: { item: JobOffer }) => (
    <TouchableOpacity
      style={[styles.recommendedCard, { backgroundColor: colors.cardBackground }]}
      activeOpacity={0.9}
    >
      {/* Company Logo */}
      <View style={styles.cardHeader}>
        {item.companyLogo && (
          <Image source={{ uri: item.companyLogo }} style={styles.companyLogo} />
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
            size={24}
            color={favorites.has(item.id) ? '#EF4444' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Job Title */}
      <Text style={[styles.jobTitle, { color: colors.textPrimary }]} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Company & Category */}
      <View style={styles.companyRow}>
        <Text style={[styles.companyName, { color: colors.textPrimary }]}>
          {item.company}
        </Text>
        <View style={[styles.categoryBadge, { backgroundColor: '#FF6B3520' }]}>
          <Text style={[styles.categoryText, { color: '#FF6B35' }]}>{item.category}</Text>
        </View>
      </View>

      {/* Job Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={colors.textTertiary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.location}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name={getWorkTypeIcon(item.workType) as any} size={16} color={colors.textTertiary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.workType}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="briefcase" size={16} color={colors.textTertiary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.contractType}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={colors.textTertiary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.experienceLevel}
          </Text>
        </View>
      </View>

      {/* Match Percentage */}
      {item.matchPercentage && (
        <View style={styles.matchContainer}>
          <Ionicons name="checkmark-circle" size={16} color="#FF6B35" />
          <Text style={[styles.matchText, { color: '#FF6B35' }]}>
            Recommandée selon ton profil {item.matchPercentage}%
          </Text>
        </View>
      )}

      {/* Salary */}
      <Text style={[styles.salary, { color: '#FF6B35' }]}>{item.salary}</Text>

      {/* Skills */}
      <View style={styles.skillsContainer}>
        {item.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={[styles.skillBadge, { backgroundColor: colors.surfaceBackground }]}>
            <Text style={[styles.skillText, { color: colors.textSecondary }]}>{skill}</Text>
          </View>
        ))}
        {item.skills.length > 3 && (
          <View style={[styles.skillBadge, { backgroundColor: colors.surfaceBackground }]}>
            <Text style={[styles.skillText, { color: colors.textSecondary }]}>
              +{item.skills.length - 3}
            </Text>
          </View>
        )}
      </View>

      {/* Posted Date */}
      <Text style={[styles.postedDate, { color: colors.textTertiary }]}>
        Postée {item.postedDate}
      </Text>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.detailsButton, { backgroundColor: colors.surfaceBackground }]}
        >
          <Text style={[styles.detailsButtonText, { color: colors.textPrimary }]}>
            Voir les détails
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.applyButton, { backgroundColor: '#FF6B35' }]}>
          <Text style={styles.applyButtonText}>Candidater →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderJobCard = (item: JobOffer) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.jobCard, { backgroundColor: colors.cardBackground }]}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        {item.companyLogo && (
          <Image source={{ uri: item.companyLogo }} style={styles.companyLogoSmall} />
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={favorites.has(item.id) ? '#EF4444' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.jobTitleSmall, { color: colors.textPrimary }]} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.companyRowSmall}>
        <Text style={[styles.companyNameSmall, { color: colors.textSecondary }]}>
          {item.company}
        </Text>
        <Text style={[styles.separator, { color: colors.textTertiary }]}> - </Text>
        <Text style={[styles.categoryTextSmall, { color: '#FF6B35' }]}>{item.category}</Text>
      </View>

      <View style={styles.detailsContainerSmall}>
        <View style={styles.detailRowSmall}>
          <Ionicons name="location" size={14} color={colors.textTertiary} />
          <Text style={[styles.detailTextSmall, { color: colors.textSecondary }]}>
            {item.location}
          </Text>
          <Text style={[styles.separator, { color: colors.textTertiary }]}> - </Text>
          <Text style={[styles.detailTextSmall, { color: colors.textSecondary }]}>
            {item.workType}
          </Text>
        </View>
        <View style={styles.detailRowSmall}>
          <Ionicons name="briefcase" size={14} color={colors.textTertiary} />
          <Text style={[styles.detailTextSmall, { color: colors.textSecondary }]}>
            {item.contractType}
          </Text>
          <Text style={[styles.separator, { color: colors.textTertiary }]}> - </Text>
          <Text style={[styles.detailTextSmall, { color: colors.textSecondary }]}>
            {item.experienceLevel}
          </Text>
        </View>
      </View>

      {item.matchPercentage && item.matchPercentage >= 80 && (
        <View style={styles.matchContainerSmall}>
          <Ionicons name="checkmark-circle" size={14} color="#FF6B35" />
          <Text style={[styles.matchTextSmall, { color: '#FF6B35' }]}>
            Recommandée ton profil {item.matchPercentage}%
          </Text>
        </View>
      )}

      <View style={styles.skillsContainerSmall}>
        {item.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={[styles.skillBadgeSmall, { backgroundColor: colors.surfaceBackground }]}>
            <Text style={[styles.skillTextSmall, { color: colors.textSecondary }]}>{skill}</Text>
          </View>
        ))}
        {item.skills.length > 3 && (
          <View style={[styles.skillBadgeSmall, { backgroundColor: colors.surfaceBackground }]}>
            <Text style={[styles.skillTextSmall, { color: colors.textSecondary }]}>
              +{item.skills.length - 3}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.postedDateSmall, { color: colors.textTertiary }]}>
        Postée {item.postedDate}
      </Text>

      <View style={styles.actionButtonsSmall}>
        <TouchableOpacity
          style={[styles.detailsButtonSmall, { backgroundColor: colors.surfaceBackground }]}
        >
          <Text style={[styles.detailsButtonTextSmall, { color: colors.textPrimary }]}>
            Voir les détails
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.applyButtonSmall, { backgroundColor: '#FF6B35' }]}>
          <Text style={styles.applyButtonTextSmall}>Candidater</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        onMenuPress={() => navigation.openDrawer()} 
        onProfilePress={() => setShowProfileModal(true)}
        title="Offres d'emploi" 
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadges}>
            <View style={[styles.heroBadge, { backgroundColor: '#FF6B35' }]}>
              <Ionicons name="briefcase" size={14} color="white" />
              <Text style={styles.heroBadgeText}>Offres d'emploi</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: colors.surfaceBackground }]}>
              <Text style={[styles.heroBadgeText, { color: colors.textSecondary }]}>
                {MOCK_JOB_OFFERS.length} opportunités disponibles
              </Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            Trouve ton opportunité idéale pour{' '}
            <Text style={{ color: '#FF6B35' }}>ta carrière</Text>
          </Text>

          {/* Search and Filter */}
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: colors.surfaceBackground }]}>
              <Ionicons name="search" size={20} color={colors.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Rechercher un poste, une entreprise, une compétence..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: '#FF6B35' }]}>
              <Ionicons name="options" size={20} color="white" />
              <Text style={styles.filterButtonText}>Filtrer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Offers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Offres recommandées pour toi
              </Text>
            </View>
          </View>

          {/* Info Banner */}
          <View style={[styles.infoBanner, { backgroundColor: '#FF8C4220' }]}>
            <View style={styles.infoBannerContent}>
              <Ionicons name="information-circle" size={16} color="#FF8C42" />
              <Text style={[styles.infoBannerText, { color: colors.textSecondary }]}>
                Ces offres ont été sélectionnées pour toi en fonction de ton profil.
              </Text>
            </View>
            <View style={[styles.personalizedBadge, { backgroundColor: '#FF6B35' }]}>
              <Text style={styles.personalizedBadgeText}>{recommendedOffers.length}</Text>
            </View>
          </View>

          {/* Recommended Jobs Horizontal Scroll */}
          <FlatList
            data={recommendedOffers}
            renderItem={renderRecommendedCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={CARD_WIDTH + SPACING.lg}
            decelerationRate="fast"
          />
        </View>

        {/* All Offers Section */}
        <View style={styles.section}>
          <View style={styles.allOffersHeaderContainer}>
            <View style={styles.allOffersTitle}>
              <Ionicons name="list" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Explorer toutes les offres
              </Text>
            </View>
            <TouchableOpacity style={[styles.sortButton, { backgroundColor: colors.surfaceBackground }]}>
              <Text style={[styles.sortButtonText, { color: colors.textSecondary }]}>
                Trier par :
              </Text>
              <Text style={[styles.sortButtonValue, { color: colors.textPrimary }]}>
                Alignées avec ton profil
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Grid View */}
          <View style={styles.jobsGrid}>
            {MOCK_JOB_OFFERS.map((job, index) => (
              <View key={job.id} style={styles.gridItem}>
                {renderJobCard(job)}
              </View>
            ))}
          </View>

          {/* Load More Button */}
          <TouchableOpacity style={[styles.loadMoreButton, { backgroundColor: colors.surfaceBackground }]}>
            <Text style={[styles.loadMoreButtonText, { color: colors.textPrimary }]}>
              Charger plus d'offres
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Partner Companies Section */}
        <View style={[styles.partnerSection, { backgroundColor: colors.surfaceBackground }]}>
          <View style={styles.partnerHeader}>
            <Ionicons name="business" size={24} color={colors.primary} />
            <Text style={[styles.partnerTitle, { color: colors.textPrimary }]}>
              Entreprises partenaires
            </Text>
          </View>
          <Text style={[styles.partnerDescription, { color: colors.textSecondary }]}>
            Découvre les entreprises qui recrutent activement et créent les opportunités de demain
            pour ta carrière.
        </Text>
          <TouchableOpacity style={[styles.partnerButton, { backgroundColor: '#FF6B35' }]}>
            <Text style={styles.partnerButtonText}>Voir toutes les entreprises →</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  filterButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  infoBannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoBannerText: {
    flex: 1,
    fontSize: FONTS.sizes.xs,
    lineHeight: 16,
  },
  personalizedBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalizedBadgeText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  horizontalList: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  recommendedCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginRight: SPACING.lg,
    minHeight: 420,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
  },
  companyLogoSmall: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  jobTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  companyName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: FONTS.sizes.sm,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: SPACING.sm,
  },
  matchText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  salary: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginVertical: SPACING.sm,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  skillBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillText: {
    fontSize: FONTS.sizes.xs,
  },
  postedDate: {
    fontSize: FONTS.sizes.xs,
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  applyButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  allOffersHeaderContainer: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  allOffersTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  sortButtonText: {
    fontSize: FONTS.sizes.xs,
  },
  sortButtonValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  jobsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: SPACING.lg,
  },
  jobCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    height: 280,
  },
  jobTitleSmall: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  companyRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  companyNameSmall: {
    fontSize: FONTS.sizes.xs,
  },
  separator: {
    fontSize: FONTS.sizes.xs,
  },
  categoryTextSmall: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  detailsContainerSmall: {
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  detailRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailTextSmall: {
    fontSize: 10,
  },
  matchContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.xs,
  },
  matchTextSmall: {
    fontSize: 10,
    fontWeight: FONTS.weights.medium,
  },
  skillsContainerSmall: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  skillBadgeSmall: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillTextSmall: {
    fontSize: 10,
  },
  postedDateSmall: {
    fontSize: 10,
    marginBottom: SPACING.sm,
  },
  actionButtonsSmall: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  detailsButtonSmall: {
    flex: 1,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  detailsButtonTextSmall: {
    fontSize: 10,
    fontWeight: FONTS.weights.semiBold,
  },
  applyButtonSmall: {
    flex: 1,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  applyButtonTextSmall: {
    color: 'white',
    fontSize: 10,
    fontWeight: FONTS.weights.semiBold,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  loadMoreButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  partnerSection: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xxxl,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  partnerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  partnerDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  partnerButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  partnerButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
});

export default OffresScreen;

