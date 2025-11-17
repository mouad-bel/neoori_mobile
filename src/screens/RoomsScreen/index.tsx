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
import { Room, MainDrawerParamList } from '../../types';
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
    case 'École': return '#FF6B35';
    case 'Entreprise': return '#FF8C42';
    case 'Association': return '#FFB380';
    case 'Communauté': return '#FF6B35';
  }
};

const RoomCard: React.FC<{ room: Room; compact?: boolean }> = ({ room, compact }) => {
  const { colors, theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <View style={[styles.roomCard, { backgroundColor: colors.cardBackground }, compact && styles.roomCardCompact]}>
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
        <View style={[
          styles.accessBadge,
          {
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          }
        ]}>
          {room.access !== 'Publique' && (
            <Ionicons 
              name="lock-closed" 
              size={12} 
              color={isDarkMode ? '#CBD5E1' : '#1E293B'} 
            />
          )}
          <Text style={[
            styles.accessText, 
            { color: isDarkMode ? '#CBD5E1' : '#1E293B' }
          ]}>
            {room.access}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.roomContent}>
        <Text style={[styles.roomTitle, { color: colors.textPrimary }]}>{room.title}</Text>
        <Text style={[styles.roomDescription, { color: colors.textSecondary }]} numberOfLines={2}>{room.description}</Text>

        <View style={styles.roomTags}>
          {room.tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.background }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.roomFooter}>
          <View style={styles.roomMeta}>
            <Ionicons name="people" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{room.members} membres</Text>
          </View>
          <Text style={[styles.activityText, { color: colors.textSecondary }]}>{room.lastActivity}</Text>
        </View>

        <TouchableOpacity style={styles.joinButton}>
          <Text style={[styles.joinButtonText, { color: colors.background }]}>Rejoindre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RoomsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const activeRooms = MOCK_ROOMS.filter(room => room.isActive);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        onMenuPress={() => navigation.openDrawer()}
        title="Rooms" 
        onProfilePress={() => setShowProfileModal(true)}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.breadcrumb}>
            <Ionicons name="cube" size={20} color={colors.primary} />
            <Text style={[styles.breadcrumbText, { color: colors.primary }]}>{MOCK_ROOMS.length} espaces disponibles</Text>
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>Rooms partenaires pour collaborer et échanger</Text>
          
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Rejoins les espaces de collaboration de nos partenaires — écoles, entreprises, associations.
          </Text>

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

        {/* Active Rooms Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Les rooms les plus actives</Text>
            <View style={styles.carouselNav}>
              <TouchableOpacity style={styles.navButton}>
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton}>
                <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
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
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Toutes les rooms ({MOCK_ROOMS.length})</Text>
          
          <View style={styles.roomsGrid}>
            {MOCK_ROOMS.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={[styles.ctaSection, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.ctaTitle, { color: colors.textPrimary }]}>Tu représentes une organisation ?</Text>
          <Text style={[styles.ctaDescription, { color: colors.textSecondary }]}>
            Crée ta propre room et connecte ta communauté à Neoori. Bénéficie d'un espace dédié 
            pour échanger, collaborer et grandir ensemble.
          </Text>
          <TouchableOpacity style={[styles.ctaButton, { backgroundColor: colors.primary }]}>
            <Ionicons name="add-circle" size={24} color={colors.background} />
            <Text style={[styles.ctaButtonText, { color: colors.background }]}>Demander l'ouverture d'une room</Text>
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
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  subtitle: {
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
  },
  carouselNav: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  accessText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  roomContent: {
    padding: SPACING.lg,
  },
  roomTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  roomDescription: {
    fontSize: FONTS.sizes.sm,
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  tagText: {
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
    fontSize: FONTS.sizes.xs,
    fontWeight: '500',
  },
  activityText: {
    fontSize: FONTS.sizes.xs,
  },
  joinButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  ctaSection: {
    padding: SPACING.xl,
    margin: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.md,
  },
  ctaButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});

export default RoomsScreen;
