import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SPACING } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import IconButton from '../common/IconButton';
import { VideoContent } from '../../types';
import { useVideo } from '../../store/VideoContext';

interface InteractionBarProps {
  video: VideoContent;
}

const InteractionBar: React.FC<InteractionBarProps> = ({ video }) => {
  const { colors } = useTheme();
  const {
    toggleLike,
    toggleBookmark,
    incrementShares,
    isLiked,
    isBookmarked,
  } = useVideo();

  const handleLike = async () => {
    await toggleLike(video.id);
  };

  const handleComment = () => {
    // TODO: Implement comment functionality
    Alert.alert('Commentaires', 'Fonctionnalité à venir');
  };

  const handleShare = () => {
    incrementShares(video.id);
    Alert.alert('Partager', 'Vidéo partagée avec succès!');
  };

  const handleBookmark = async () => {
    await toggleBookmark(video.id);
  };

  const handleAI = () => {
    // TODO: Implement AI functionality
    Alert.alert(
      'AI Assistant',
      'Demandez à l\'IA de vous aider à comprendre ce contenu'
    );
  };

  const liked = isLiked(video.id);
  const bookmarked = isBookmarked(video.id);

  return (
    <View style={styles.container}>
      <IconButton
        icon={liked ? 'heart' : 'heart-outline'}
        onPress={handleLike}
        count={video.engagement.likes}
        active={liked}
        size="lg"
        fixedColors={true}
      />
      <View style={{ marginTop: SPACING.sm }} />
      <IconButton
        icon="chatbubble-outline"
        onPress={handleComment}
        count={video.engagement.comments}
        size="lg"
        fixedColors={true}
      />
      <View style={{ marginTop: SPACING.sm }} />
      <IconButton
        icon="share-social-outline"
        onPress={handleShare}
        count={video.engagement.shares}
        size="lg"
        fixedColors={true}
      />
      <View style={{ marginTop: SPACING.sm }} />
      <IconButton
        icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
        onPress={handleBookmark}
        active={bookmarked}
        size="lg"
        fixedColors={true}
      />
      <View style={styles.spacer} />
      <IconButton
        icon="sparkles"
        onPress={handleAI}
        active={true}
        size="lg"
        style={styles.aiButton}
        fixedColors={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: 100,
    alignItems: 'center',
  },
  spacer: {
    height: SPACING.lg,
  },
  aiButton: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)', // Brand orange semi-transparent
    borderRadius: 24,
  },
});

export default InteractionBar;

