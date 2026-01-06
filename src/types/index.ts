// Core Type Definitions

// User from MySQL (Core authentication data)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// User Profile from MongoDB (Extended profile data)
export interface UserLocation {
  city?: string;
  country?: string;
  address?: string;
}

export interface UserEducation {
  id: string;
  degree: string;
  school: string;
  year: string;
  field?: string;
  description?: string;
  createdAt: string;
}

export interface UserExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description?: string;
  location?: string;
  type?: string;
  createdAt: string;
}

export interface UserSkill {
  id: string;
  name: string;
  level: number; // 0-100
  category?: string;
  createdAt: string;
}

export interface UserDocument {
  id: string;
  name: string;
  type: string; // "pdf", "doc", "docx", etc.
  size: number; // bytes
  path: string;
  url: string;
  uploadedAt: string;
  category?: string; // "CV", "Certificate", "Portfolio", "Other"
  mimeType?: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showEmail: boolean;
  };
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
}

export interface UserGameProgress {
  gameId: string;
  gameType: string;
  currentQuestion?: number;
  totalQuestions?: number;
  answers?: Record<string, any>;
  gameData?: any;
  startedAt: string;
  lastUpdatedAt: string;
  completed: boolean;
  score?: number;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserRecentActivity {
  id: string;
  text: string;
  time: string;
  type: string;
  createdAt: string;
}

export interface UserProfile {
  _id: string;
  userId: string;
  bio?: string;
  location?: UserLocation;
  careerPath?: string;
  phone?: string;
  education?: UserEducation[];
  experiences?: UserExperience[];
  skills?: UserSkill[];
  documents?: UserDocument[];
  preferences?: UserPreferences;
  gameProgress?: UserGameProgress[];
  achievements?: UserAchievement[];
  recentActivities?: UserRecentActivity[];
  credits?: number;
  createdAt: string;
  updatedAt: string;
}

// Combined User with Profile
export interface UserWithProfile extends User {
  profile?: UserProfile;
}

export interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string | number; // Can be URL string or require() asset (number)
  videoUrl?: string | number; // Can be URL string or require() asset (number)
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
  avatar: string | number; // Can be URL string or require() asset (number)
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

export type GameType = 'quiz' | 'matching' | 'ranking' | 'simulation' | 'creation' | 'puzzle' | 'interactive';

export interface Game {
  id: string;
  title: string;
  duration: string;
  questions?: number; // Optional for non-quiz games
  description: string;
  credits: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  icon: string;
  image: string;
  progress?: number;
  status: 'not-started' | 'in-progress' | 'completed';
  gameType: GameType; // Type of game
}

export interface GameProgress {
  gameId: string;
  gameType: GameType;
  currentQuestion?: number; // Optional for non-quiz games
  totalQuestions?: number; // Optional for non-quiz games
  answers?: Record<number, any>; // For quiz games
  gameData?: any; // Generic data storage for non-quiz games
  startedAt: string;
  lastUpdatedAt: string;
  completed: boolean;
}

export interface GameQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text' | 'yes-no';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
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
  refreshToken?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
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
  MainTabs: { screen?: 'Flow' | 'Decouvrir' | 'Progresser' | 'Moi' } | undefined;
  Rooms: undefined;
  Capsules: undefined;
  Formations: undefined;
  Offres: undefined;
  About: undefined;
  Recompenses: undefined;
  Parametres: undefined;
  AccessibilityDemo: undefined;
  Game: { gameId: string };
};

export type RouteConfig = {
  name: keyof MainDrawerParamList | 'Flow' | 'Jeux' | 'Dashboard' | 'Profile';
  icon: string;
  label: string;
  section?: string;
};

