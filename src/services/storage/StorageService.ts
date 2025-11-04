import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserInteraction } from '../../types';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@neoori_auth_token',
  USER_DATA: '@neoori_user_data',
  INTERACTIONS: '@neoori_interactions',
  BOOKMARKS: '@neoori_bookmarks',
} as const;

class StorageService {
  // Auth Methods
  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
      throw error;
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing auth token:', error);
      throw error;
    }
  }

  // User Data Methods
  async saveUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user data:', error);
      throw error;
    }
  }

  // Interaction Methods
  async saveInteraction(interaction: UserInteraction): Promise<void> {
    try {
      const interactions = await this.getInteractions();
      const existingIndex = interactions.findIndex(
        (i) => i.videoId === interaction.videoId
      );

      if (existingIndex >= 0) {
        interactions[existingIndex] = interaction;
      } else {
        interactions.push(interaction);
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.INTERACTIONS,
        JSON.stringify(interactions)
      );
    } catch (error) {
      console.error('Error saving interaction:', error);
      throw error;
    }
  }

  async getInteractions(): Promise<UserInteraction[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INTERACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting interactions:', error);
      return [];
    }
  }

  async getInteractionByVideoId(
    videoId: string
  ): Promise<UserInteraction | null> {
    try {
      const interactions = await this.getInteractions();
      return interactions.find((i) => i.videoId === videoId) || null;
    } catch (error) {
      console.error('Error getting interaction:', error);
      return null;
    }
  }

  // Bookmarks Methods
  async saveBookmark(videoId: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      if (!bookmarks.includes(videoId)) {
        bookmarks.push(videoId);
        await AsyncStorage.setItem(
          STORAGE_KEYS.BOOKMARKS,
          JSON.stringify(bookmarks)
        );
      }
    } catch (error) {
      console.error('Error saving bookmark:', error);
      throw error;
    }
  }

  async removeBookmark(videoId: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const filtered = bookmarks.filter((id) => id !== videoId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  async getBookmarks(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  async isBookmarked(videoId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.includes(videoId);
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.INTERACTIONS,
        STORAGE_KEYS.BOOKMARKS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export default new StorageService();

