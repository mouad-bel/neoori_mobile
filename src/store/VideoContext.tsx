import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoContent, UserInteraction } from '../types';
import StorageService from '../services/storage/StorageService';
import { MOCK_VIDEOS } from '../constants/mockData';

interface VideoContextType {
  videos: VideoContent[];
  interactions: Map<string, UserInteraction>;
  toggleLike: (videoId: string) => Promise<void>;
  toggleBookmark: (videoId: string) => Promise<void>;
  incrementComments: (videoId: string) => void;
  incrementShares: (videoId: string) => void;
  isLiked: (videoId: string) => boolean;
  isBookmarked: (videoId: string) => boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [videos, setVideos] = useState<VideoContent[]>(MOCK_VIDEOS);
  const [interactions, setInteractions] = useState<
    Map<string, UserInteraction>
  >(new Map());

  // Load interactions on mount
  useEffect(() => {
    loadInteractions();
  }, []);

  const loadInteractions = async () => {
    try {
      const storedInteractions = await StorageService.getInteractions();
      const interactionMap = new Map<string, UserInteraction>();
      storedInteractions.forEach((interaction) => {
        interactionMap.set(interaction.videoId, interaction);
      });
      setInteractions(interactionMap);
    } catch (error) {
      console.error('Error loading interactions:', error);
    }
  };

  const toggleLike = async (videoId: string) => {
    try {
      const currentInteraction = interactions.get(videoId) || {
        videoId,
        liked: false,
        bookmarked: false,
        commented: false,
        shared: false,
      };

      const newLikedState = !currentInteraction.liked;
      const updatedInteraction = {
        ...currentInteraction,
        liked: newLikedState,
      };

      // Update local state
      const newInteractions = new Map(interactions);
      newInteractions.set(videoId, updatedInteraction);
      setInteractions(newInteractions);

      // Update video engagement count
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId
            ? {
                ...video,
                engagement: {
                  ...video.engagement,
                  likes: newLikedState
                    ? video.engagement.likes + 1
                    : video.engagement.likes - 1,
                },
              }
            : video
        )
      );

      // Persist to storage
      await StorageService.saveInteraction(updatedInteraction);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleBookmark = async (videoId: string) => {
    try {
      const currentInteraction = interactions.get(videoId) || {
        videoId,
        liked: false,
        bookmarked: false,
        commented: false,
        shared: false,
      };

      const newBookmarkedState = !currentInteraction.bookmarked;
      const updatedInteraction = {
        ...currentInteraction,
        bookmarked: newBookmarkedState,
      };

      // Update local state
      const newInteractions = new Map(interactions);
      newInteractions.set(videoId, updatedInteraction);
      setInteractions(newInteractions);

      // Update video engagement count
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId
            ? {
                ...video,
                engagement: {
                  ...video.engagement,
                  bookmarks: newBookmarkedState
                    ? video.engagement.bookmarks + 1
                    : video.engagement.bookmarks - 1,
                },
              }
            : video
        )
      );

      // Persist to storage
      await StorageService.saveInteraction(updatedInteraction);
      if (newBookmarkedState) {
        await StorageService.saveBookmark(videoId);
      } else {
        await StorageService.removeBookmark(videoId);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const incrementComments = (videoId: string) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              engagement: {
                ...video.engagement,
                comments: video.engagement.comments + 1,
              },
            }
          : video
      )
    );
  };

  const incrementShares = (videoId: string) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              engagement: {
                ...video.engagement,
                shares: video.engagement.shares + 1,
              },
            }
          : video
      )
    );
  };

  const isLiked = (videoId: string): boolean => {
    return interactions.get(videoId)?.liked || false;
  };

  const isBookmarked = (videoId: string): boolean => {
    return interactions.get(videoId)?.bookmarked || false;
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        interactions,
        toggleLike,
        toggleBookmark,
        incrementComments,
        incrementShares,
        isLiked,
        isBookmarked,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within VideoProvider');
  }
  return context;
};

