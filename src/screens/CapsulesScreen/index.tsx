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
import { MainDrawerParamList, CapsuleVideo, ArticleContent } from '../../types';
import { MOCK_CAPSULE_VIDEOS, MOCK_ARTICLES } from '../../constants/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const CapsulesScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'Lecture courte':
        return '#FF6B35'; // Brand Orange
      case 'Témoignage':
        return '#FF8C42'; // Brand Orange Light
      case 'Étude approfondie':
        return '#FFB380'; // Brand Orange Peach
      default:
        return colors.primary;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'Lecture courte':
        return 'document-text';
      case 'Témoignage':
        return 'person';
      case 'Étude approfondie':
        return 'analytics';
      default:
        return 'document';
    }
  };

  const renderCapsuleCard = ({ item }: { item: CapsuleVideo }) => (
    <TouchableOpacity
      style={[styles.capsuleCard, { backgroundColor: colors.cardBackground }]}
      activeOpacity={0.9}
    >
      <View style={styles.capsuleImageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.capsuleImage} />
        <View style={styles.capsuleOverlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={32} color="white" />
          </View>
        </View>
        <View style={styles.capsuleBadges}>
          <View style={[styles.videoBadge, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.videoBadgeText}>Vidéo</Text>
          </View>
          <View style={[styles.durationBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
      </View>
      <View style={styles.capsuleContent}>
        <Text style={[styles.capsuleTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.capsuleDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.capsuleFooter}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: item.author.avatar }} style={styles.authorAvatar} />
            <Text style={[styles.authorName, { color: colors.textSecondary }]}>
              {item.author.name}
            </Text>
          </View>
          <View style={styles.capsuleActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderArticleCard = (item: ArticleContent, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.articleCard,
        { backgroundColor: colors.cardBackground },
        index % 2 === 0 ? styles.articleCardLeft : styles.articleCardRight,
      ]}
      activeOpacity={0.9}
    >
      <View
        style={[
          styles.contentTypeBadge,
          { backgroundColor: getContentTypeColor(item.contentType) },
        ]}
      >
        <Ionicons
          name={getContentTypeIcon(item.contentType) as any}
          size={12}
          color="white"
        />
        <Text style={styles.contentTypeText}>{item.contentType}</Text>
      </View>
      <Image source={{ uri: item.thumbnail }} style={styles.articleThumbnail} />
      <View style={styles.articleContent}>
        <Text style={[styles.articleCategory, { color: colors.primary }]}>
          {item.category}
        </Text>
        <Text style={[styles.articleTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.articleDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.articleFooter}>
          <View style={styles.articleAuthor}>
            <Image source={{ uri: item.author.avatar }} style={styles.articleAuthorAvatar} />
            <Text style={[styles.articleAuthorName, { color: colors.textSecondary }]}>
              {item.author.name}
            </Text>
          </View>
          <View style={styles.articleMeta}>
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {item.readingTime}
            </Text>
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>•</Text>
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {item.publishedAt}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        onMenuPress={() => navigation.openDrawer()} 
        onProfilePress={() => setShowProfileModal(true)}
        title="Capsules & Lectures" 
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadges}>
            <View style={[styles.heroBadge, { backgroundColor: '#FF6B35' }]}>
              <Ionicons name="videocam" size={14} color="white" />
              <Text style={styles.heroBadgeText}>Capsules & lectures</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: '#A855F7' }]}>
              <Text style={styles.heroBadgeText}>12 contenus disponibles</Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            Capsules vidéo & lectures pour{' '}
            <Text style={{ color: '#60A5FA' }}>booster ton inspiration</Text>
          </Text>

          {/* Search and Filters */}
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

        {/* Capsules vidéo Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="videocam" size={24} color="#EF4444" />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Capsules vidéo
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={MOCK_CAPSULE_VIDEOS}
            renderItem={renderCapsuleCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.capsulesList}
            snapToInterval={CARD_WIDTH + SPACING.lg}
            decelerationRate="fast"
          />
        </View>

        {/* Articles & lectures Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="document-text" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Articles & lectures
        </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.articlesGrid}>
            {MOCK_ARTICLES.map((article, index) => renderArticleCard(article, index))}
          </View>
      </View>
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
  capsulesList: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  capsuleCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.lg,
  },
  capsuleImageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  capsuleImage: {
    width: '100%',
    height: '100%',
  },
  capsuleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capsuleBadges: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  videoBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  videoBadgeText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  durationBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  durationText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  capsuleContent: {
    padding: SPACING.lg,
  },
  capsuleTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  capsuleDescription: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  capsuleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  authorName: {
    fontSize: FONTS.sizes.sm,
  },
  capsuleActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  articlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl - SPACING.sm,
  },
  articleCard: {
    width: (width - SPACING.xl * 2 - SPACING.sm * 2) / 2,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  articleCardLeft: {
    marginLeft: SPACING.sm,
    marginRight: SPACING.sm / 2,
  },
  articleCardRight: {
    marginLeft: SPACING.sm / 2,
    marginRight: SPACING.sm,
  },
  contentTypeBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    zIndex: 1,
  },
  contentTypeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
  },
  articleThumbnail: {
    width: '100%',
    height: 100,
  },
  articleContent: {
    padding: SPACING.md,
  },
  articleCategory: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  articleTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  articleDescription: {
    fontSize: FONTS.sizes.xs,
    lineHeight: 16,
    marginBottom: SPACING.md,
  },
  articleFooter: {
    gap: SPACING.sm,
  },
  articleAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  articleAuthorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  articleAuthorName: {
    fontSize: 10,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: 10,
  },
});

export default CapsulesScreen;

