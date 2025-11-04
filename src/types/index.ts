// Core Type Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
}

export interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string; // For future video integration
  creator: Creator;
  category: Category;
  duration: string; // Format: "MM:SS"
  matchPercentage: number;
  engagement: Engagement;
  tags: string[];
  createdAt: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Engagement {
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
}

export interface UserInteraction {
  videoId: string;
  liked: boolean;
  bookmarked: boolean;
  commented: boolean;
  shared: boolean;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: string;
}

export interface StorageKeys {
  AUTH_TOKEN: string;
  USER_DATA: string;
  INTERACTIONS: string;
  BOOKMARKS: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainDrawerParamList = {
  Flow: undefined;
  Jeux: undefined;
  Rooms: undefined;
  Capsules: undefined;
  Formations: undefined;
  Offres: undefined;
  About: undefined;
  AccessibilityDemo: undefined;
};

export type RouteConfig = {
  name: keyof MainDrawerParamList;
  icon: string;
  label: string;
  section?: string;
};

