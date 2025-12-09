import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewToken,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useVideo } from '../../store/VideoContext';
import VideoCard from '../../components/video/VideoCard';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { VideoContent, MainDrawerParamList } from '../../types';

const { height, width } = Dimensions.get('window');
const BOTTOM_BAR_HEIGHT = 70; // Bottom bar height from tab navigator
const VIDEO_HEIGHT = height - BOTTOM_BAR_HEIGHT;

const FlowScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { videos } = useVideo();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<Map<string, any>>(new Map());

  // Pause all videos when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        // Screen is losing focus - pause all videos
        setIsScreenFocused(false);
        videoRefs.current.forEach((videoRef) => {
          if (videoRef && videoRef.pauseAsync) {
            videoRef.pauseAsync().catch(console.error);
          }
        });
      };
    }, [])
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80, // Higher threshold to ensure only one video is considered visible
    minimumViewTime: 100,
  }).current;

  const renderItem = ({ item, index }: { item: VideoContent; index: number }) => (
    <VideoCard 
      video={item} 
      onPress={() => setShowHeader(!showHeader)}
      isActive={index === currentIndex && isScreenFocused}
      onVideoRef={(ref) => {
        if (ref) {
          videoRefs.current.set(item.id, ref);
        } else {
          videoRefs.current.delete(item.id);
        }
      }}
    />
  );

  const getItemLayout = (_: any, index: number) => ({
    length: VIDEO_HEIGHT,
    offset: VIDEO_HEIGHT * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        snapToInterval={VIDEO_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews={true}
        disableIntervalMomentum={true}
      />
      {showHeader && (
        <AppHeader 
          onProfilePress={() => setShowProfileModal(true)}
        />
      )}
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
});

export default FlowScreen;
