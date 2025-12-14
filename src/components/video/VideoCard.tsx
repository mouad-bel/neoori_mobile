import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SPACING, COLORS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { VideoContent } from '../../types';
import CategoryBadge from '../common/CategoryBadge';
import DurationBadge from '../common/DurationBadge';
import InteractionBar from './InteractionBar';

const { width } = Dimensions.get('window');
const { height: screenHeight } = Dimensions.get('window');
const BOTTOM_BAR_HEIGHT = 70; // Bottom bar height
const VIDEO_HEIGHT = screenHeight - BOTTOM_BAR_HEIGHT;

interface VideoCardProps {
  video: VideoContent;
  onPress?: () => void;
  isActive?: boolean; // Whether this video is currently visible/active
  onVideoRef?: (ref: any) => void; // Callback to pass video ref to parent
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPress, isActive = false, onVideoRef }) => {
  const { colors } = useTheme();
  const videoRef = useRef<Video>(null);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [wasActive, setWasActive] = useState(false);
  const [videoDuration, setVideoDuration] = useState<string>(video.duration);

  // Pass video ref to parent
  useEffect(() => {
    if (onVideoRef && videoRef.current) {
      onVideoRef(videoRef.current);
    }
    return () => {
      if (onVideoRef) {
        onVideoRef(null);
      }
    };
  }, [onVideoRef]);

  useEffect(() => {
    if (isActive && video.videoUrl) {
      // If video was paused manually, don't auto-play
      if (!isPaused) {
        // Play video when active
        videoRef.current?.playAsync().catch(console.error);
        // Hide thumbnail after a short delay to allow video to start
        setTimeout(() => setShowThumbnail(false), 500);
      }
    } else {
      // Pause video when not active
      videoRef.current?.pauseAsync().catch(console.error);
      // Show thumbnail again when paused
      if (!isActive) {
        setShowThumbnail(true);
        setIsPaused(false); // Reset pause state when leaving
      }
    }
  }, [isActive, video.videoUrl, isPaused]);

  // Reset and restart video when it becomes active again after being inactive
  useEffect(() => {
    if (isActive && !wasActive && video.videoUrl) {
      // Video became active again after being inactive - restart from beginning
      setIsPaused(false);
      videoRef.current?.setPositionAsync(0).catch(console.error);
      videoRef.current?.playAsync().catch(console.error);
      setTimeout(() => setShowThumbnail(false), 500);
    }
    setWasActive(isActive);
  }, [isActive, wasActive, video.videoUrl]);

  const handleLongPress = () => {
    if (video.videoUrl) {
      setIsPaused(true);
      videoRef.current?.pauseAsync().catch(console.error);
    }
  };

  const handlePress = () => {
    if (isPaused && video.videoUrl) {
      // Resume if paused
      setIsPaused(false);
      videoRef.current?.playAsync().catch(console.error);
    } else {
      // Normal press behavior
      onPress?.();
    }
  };

  const getVideoSource = () => {
    if (!video.videoUrl) return null;
    
    if (typeof video.videoUrl === 'string') {
      return { uri: video.videoUrl };
    } else {
      // It's a require() asset (number)
      return video.videoUrl;
    }
  };

  const videoSource = getVideoSource();

  return (
    <TouchableWithoutFeedback 
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={300}
    >
      <View style={styles.container}>
        {/* Video Player */}
        {videoSource ? (
          <Video
            ref={videoRef}
            source={videoSource}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted={false}
            shouldPlay={isActive}
            useNativeControls={false}
            onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
              if (status.isLoaded) {
                // Extract video duration
                if (status.durationMillis && !videoDuration) {
                  const totalSeconds = Math.floor(status.durationMillis / 1000);
                  const minutes = Math.floor(totalSeconds / 60);
                  const seconds = totalSeconds % 60;
                  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                  setVideoDuration(formattedDuration);
                }
                
                if (status.didJustFinish) {
                  // Video finished, restart
                  videoRef.current?.replayAsync();
                }
                // Hide thumbnail when video starts playing
                if (status.isPlaying && showThumbnail) {
                  setShowThumbnail(false);
                }
              }
            }}
            onLoad={() => {
              if (isActive) {
                // Start playing immediately when loaded and active
                videoRef.current?.playAsync().catch(console.error);
              }
            }}
          />
        ) : null}

        {/* Thumbnail (shown when video is loading, paused, or not available) */}
        {(showThumbnail || isPaused) && (
          <Image 
            source={
              typeof video.thumbnail === 'string' && video.thumbnail.startsWith('http')
                ? { uri: video.thumbnail }
                : video.thumbnail
            } 
            style={styles.thumbnail} 
          />
        )}

        {/* Pause indicator */}
        {isPaused && (
          <View style={styles.pauseOverlay}>
            <View style={styles.pauseIcon}>
              <Text style={styles.pauseIconText}>⏸</Text>
            </View>
            <Text style={styles.pauseText}>Appuyez pour reprendre</Text>
          </View>
        )}

        {/* Gradient Overlay - For text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.2)', 'rgba(15, 23, 42, 0.8)']}
          locations={[0, 0.7, 1]}
          style={styles.gradient}
          pointerEvents="none"
        />

        {/* Top Section - Category and Duration Badges */}
        <View style={styles.topSection}>
          <CategoryBadge
            icon={video.category.icon as any}
            label={video.category.name}
            color={video.category.color}
            fixedColors={true}
          />
          <DurationBadge 
            duration={videoDuration || video.duration} 
            fixedColors={true}
          />
        </View>

        {/* Right Side - Interaction Buttons (Instagram style) */}
        <View style={styles.rightInteractionBar}>
          <InteractionBar video={video} />
        </View>

        {/* Bottom Left - Creator Info and Description (Instagram style) */}
        <View style={[styles.bottomSection, { bottom: BOTTOM_BAR_HEIGHT }]}>
          {/* Creator Info */}
          <View style={styles.creatorRow}>
            <Image
              source={
                typeof video.creator.avatar === 'string' && video.creator.avatar.startsWith('http')
                  ? { uri: video.creator.avatar }
                  : video.creator.avatar
              }
              style={styles.avatar}
            />
            <Text style={styles.creatorName}>{video.creator.name}</Text>
            {video.creator.verified && (
              <Text style={styles.verified}>✓</Text>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description}>{video.description}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: VIDEO_HEIGHT,
    backgroundColor: '#0F172A',
    position: 'relative',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  pauseIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  pauseIconText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  pauseText: {
    fontSize: FONTS.sizes.md,
    color: '#FFFFFF',
    fontWeight: FONTS.weights.semiBold,
  },
  // Top Section - Badges
  topSection: {
    position: 'absolute',
    top: 60, // Account for status bar
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  // Right Side - Interaction Buttons (Instagram style)
  rightInteractionBar: {
    position: 'absolute',
    right: SPACING.md,
    bottom: BOTTOM_BAR_HEIGHT + SPACING.lg, // Position above bottom bar
    zIndex: 10,
    alignItems: 'center',
  },
  // Bottom Left - Creator and Description (Instagram style)
  bottomSection: {
    position: 'absolute',
    left: SPACING.lg,
    right: 80, // Leave space for right interaction buttons
    // bottom: BOTTOM_BAR_HEIGHT (set inline) - positions container just above bottom bar
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 0,
    marginTop: 0,
    zIndex: 10,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    marginRight: SPACING.sm,
  },
  creatorName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: '#FFFFFF',
    marginRight: SPACING.xs,
  },
  verified: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.regular,
    lineHeight: FONTS.sizes.sm * 1.4,
    color: '#FFFFFF',
    margin: 0,
    padding: 0,
  },
});

export default VideoCard;
