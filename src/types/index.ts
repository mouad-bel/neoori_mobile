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

export interface ArticleContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: Creator;
  category: string;
  contentType: 'Lecture courte' | 'Témoignage' | 'Étude approfondie';
  readingTime: string; // Format: "5 min"
  publishedAt: string;
  tags: string[];
}

export interface CapsuleVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: Creator;
  duration: string; // Format: "MM:SS"
  category: string;
  engagement: {
    likes: number;
    bookmarks: number;
  };
}

export interface Game {
  id: string;
  title: string;
  duration: string;
  questions: number;
  description: string;
  credits: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  icon: string;
  image: string;
  progress?: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface Room {
  id: string;
  title: string;
  type: 'École' | 'Entreprise' | 'Association' | 'Communauté';
  access: 'Publique' | 'Privée' | 'Sur invitation';
  description: string;
  tags: string[];
  members: number;
  lastActivity: string;
  image: string;
  isActive?: boolean;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  provider: {
    id: string;
    name: string;
    logo: string;
  };
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string; // e.g., "8 semaines"
  rating: number;
  reviewCount?: number;
  matchPercentage?: number;
  isFree: boolean;
  isFeatured?: boolean;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  category: string;
  location: string;
  workType: 'Hybride' | 'Télétravail' | 'Sur site';
  contractType: 'CDI' | 'CDD' | 'Freelance' | 'Stage';
  experienceLevel: 'Débutant' | 'Intermédiaire' | 'Expérimenté' | 'Expert';
  salary: string; // e.g., "45,000 - 55,000 €/an"
  skills: string[];
  postedDate: string;
  matchPercentage?: number;
  isRecommended?: boolean;
  isFavorite?: boolean;
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

