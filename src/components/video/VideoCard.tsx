import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SPACING } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { VideoContent } from '../../types';
import CategoryBadge from '../common/CategoryBadge';
import MatchBadge from '../common/MatchBadge';
import DurationBadge from '../common/DurationBadge';
import InteractionBar from './InteractionBar';

const { width, height } = Dimensions.get('window');

interface VideoCardProps {
  video: VideoContent;
  onPress?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        {/* Background Image/Thumbnail */}
        <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />

        {/* Gradient Overlay - Brand Navy Blue */}
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.7)', 'rgba(15, 23, 42, 0.95)']}
          style={styles.gradient}
        />

        {/* Content Overlay */}
        <View style={styles.content}>
        {/* Top Section - Category and Duration */}
        <View style={styles.topRow}>
          <CategoryBadge
            icon={video.category.icon as any}
            label={video.category.name}
            color={video.category.color}
            fixedColors={true}
          />
          <DurationBadge 
            duration={video.duration} 
            fixedColors={true}
          />
        </View>

        {/* Bottom Section - Main Info */}
        <View style={styles.bottomSection}>
          {/* Creator Info */}
          <View style={styles.creatorRow}>
            <Image
              source={{ uri: video.creator.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.creatorName}>{video.creator.name}</Text>
            {video.creator.verified && (
              <Text style={styles.verified}>✓</Text>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{video.title}</Text>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {video.description}
          </Text>

        </View>
        </View>

        {/* Interaction Bar */}
        <InteractionBar video={video} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#0F172A', // Brand navy dark background
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingTop: 60, // Account for status bar
    paddingBottom: 100, // Account for navigation
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bottomSection: {
    maxWidth: width - 120, // Leave space for interaction bar
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF6B35', // Brand orange
  },
  creatorName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginLeft: SPACING.md,
    color: '#FFFFFF', // Texte blanc fixe
  },
  verified: {
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.xs,
    color: '#FF6B35', // Brand orange
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    lineHeight: 38,
    marginBottom: SPACING.md,
    color: '#FFFFFF', // Texte blanc fixe
  },
  description: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.regular,
    lineHeight: 22,
    marginBottom: SPACING.lg,
    color: '#CBD5E1', // Texte secondaire fixe
  },
  matchContainer: {
    alignSelf: 'flex-start',
  },
});

export default VideoCard;

