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
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import AppHeader from '../../components/navigation/AppHeader';
import { Room } from '../../types';
import { MOCK_ROOMS } from '../../constants/mockData';

const getTypeIcon = (type: Room['type']) => {
  switch (type) {
    case 'École': return 'school';
    case 'Entreprise': return 'briefcase';
    case 'Association': return 'people';
    case 'Communauté': return 'globe';
  }
};

const getTypeColor = (type: Room['type']) => {
  switch (type) {
    case 'École': return '#3B82F6';
    case 'Entreprise': return '#8B5CF6';
    case 'Association': return '#EC4899';
    case 'Communauté': return '#10B981';
  }
};

const RoomCard: React.FC<{ room: Room; compact?: boolean }> = ({ room, compact }) => (
  <View style={[styles.roomCard, compact && styles.roomCardCompact]}>
    <ImageBackground
      source={{ uri: room.image }}
      style={styles.roomImage}
      imageStyle={styles.roomImageStyle}
    >
      <View style={styles.roomImageOverlay} />
      
      {/* Type Badge */}
      <View style={[styles.typeBadge, { backgroundColor: getTypeColor(room.type) + '20' }]}>
        <Ionicons name={getTypeIcon(room.type) as any} size={14} color={getTypeColor(room.type)} />
        <Text style={[styles.typeText, { color: getTypeColor(room.type) }]}>{room.type}</Text>
      </View>

      {/* Access Badge */}
      <View style={styles.accessBadge}>
        {room.access !== 'Publique' && (
          <Ionicons name="lock-closed" size={12} color={COLORS.textPrimary} />
        )}
        <Text style={styles.accessText}>{room.access}</Text>
      </View>
    </ImageBackground>

    <View style={styles.roomContent}>
      <Text style={styles.roomTitle}>{room.title}</Text>
      <Text style={styles.roomDescription} numberOfLines={2}>{room.description}</Text>

      <View style={styles.roomTags}>
        {room.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.roomFooter}>
        <View style={styles.roomMeta}>
          <Ionicons name="people" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{room.members} membres</Text>
        </View>
        <Text style={styles.activityText}>{room.lastActivity}</Text>
      </View>

      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Rejoindre</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RoomsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeRooms = MOCK_ROOMS.filter(room => room.isActive);

  return (
    <View style={styles.container}>
      <AppHeader title="Rooms" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.breadcrumb}>
            <Ionicons name="cube" size={20} color={COLORS.primary} />
            <Text style={styles.breadcrumbText}>{MOCK_ROOMS.length} espaces disponibles</Text>
          </View>

          <Text style={styles.title}>Rooms partenaires pour collaborer et échanger</Text>
          
          <Text style={styles.subtitle}>
            Rejoins les espaces de collaboration de nos partenaires — écoles, entreprises, associations.
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={20} color={COLORS.background} />
              <Text style={styles.filterButtonText}>Filtrer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Rooms Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Les rooms les plus actives</Text>
            <View style={styles.carouselNav}>
              <TouchableOpacity style={styles.navButton}>
                <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton}>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeRoomsScroll}
          >
            {activeRooms.map((room) => (
              <RoomCard key={room.id} room={room} compact />
            ))}
          </ScrollView>
        </View>

        {/* All Rooms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toutes les rooms ({MOCK_ROOMS.length})</Text>
          
          <View style={styles.roomsGrid}>
            {MOCK_ROOMS.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Tu représentes une organisation ?</Text>
          <Text style={styles.ctaDescription}>
            Crée ta propre room et connecte ta communauté à Neoori. Bénéficie d'un espace dédié 
            pour échanger, collaborer et grandir ensemble.
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Ionicons name="add-circle" size={24} color={COLORS.background} />
            <Text style={styles.ctaButtonText}>Demander l'ouverture d'une room</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingTop: 80,
  },
  header: {
    padding: SPACING.xl,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  breadcrumbText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  filterButtonText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  section: {
    padding: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  carouselNav: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRoomsScroll: {
    gap: SPACING.lg,
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
    marginTop: SPACING.xl,
  },
  roomCard: {
    width: '100%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  roomCardCompact: {
    width: 300,
  },
  roomImage: {
    width: '100%',
    height: 140,
  },
  roomImageStyle: {
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderTopRightRadius: BORDER_RADIUS.md,
  },
  roomImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  typeBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    gap: SPACING.xs,
  },
  typeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  accessBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    gap: SPACING.xs,
  },
  accessText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  roomContent: {
    padding: SPACING.lg,
  },
  roomTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  roomDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  roomTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    fontWeight: '500',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  roomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    fontWeight: '500',
  },
  activityText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
  },
  joinButton: {
    backgroundColor: '#10B981',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  joinButtonText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  ctaSection: {
    padding: SPACING.xl,
    margin: SPACING.xl,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.md,
  },
  ctaButtonText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});

export default RoomsScreen;
