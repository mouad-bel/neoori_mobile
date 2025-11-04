import { VideoContent, Category } from '../types';

// Mock Categories
export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Témoignage',
    icon: 'person',
    color: '#22D3EE',
  },
  {
    id: '2',
    name: 'Carrière',
    icon: 'briefcase',
    color: '#8B5CF6',
  },
  {
    id: '3',
    name: 'Tech',
    icon: 'hardware-chip',
    color: '#06B6D4',
  },
  {
    id: '4',
    name: 'Leadership',
    icon: 'star',
    color: '#F59E0B',
  },
  {
    id: '5',
    name: 'Marketing',
    icon: 'megaphone',
    color: '#EC4899',
  },
  {
    id: '6',
    name: 'Design',
    icon: 'color-palette',
    color: '#10B981',
  },
  {
    id: '7',
    name: 'Business',
    icon: 'trending-up',
    color: '#3B82F6',
  },
];

// Mock Video Content
export const MOCK_VIDEOS: VideoContent[] = [
  {
    id: '1',
    title: "Comment j'ai développé ma carrière en tech en 6 mois",
    description:
      'Julie partage son parcours et ses conseils pour une reconversion réussie',
    thumbnail: 'https://picsum.photos/400/700?random=1',
    creator: {
      id: 'c1',
      name: 'Julie Chen',
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: true,
    },
    category: MOCK_CATEGORIES[0],
    duration: '4:30',
    matchPercentage: 98,
    engagement: {
      likes: 342,
      comments: 30,
      shares: 15,
      bookmarks: 45,
    },
    tags: ['reconversion', 'tech', 'carrière'],
    createdAt: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    title: '5 erreurs à éviter lors de votre première startup',
    description:
      "Marc, entrepreneur serial, révèle les pièges communs et comment les éviter",
    thumbnail: 'https://picsum.photos/400/700?random=2',
    creator: {
      id: 'c2',
      name: 'Marc Dubois',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true,
    },
    category: MOCK_CATEGORIES[6],
    duration: '6:15',
    matchPercentage: 92,
    engagement: {
      likes: 521,
      comments: 67,
      shares: 28,
      bookmarks: 89,
    },
    tags: ['startup', 'entrepreneuriat', 'business'],
    createdAt: '2024-11-02T14:30:00Z',
  },
  {
    id: '3',
    title: 'Les secrets du design thinking en 2024',
    description:
      "Sarah explique comment le design thinking transforme les organisations",
    thumbnail: 'https://picsum.photos/400/700?random=3',
    creator: {
      id: 'c3',
      name: 'Sarah Martin',
      avatar: 'https://i.pravatar.cc/150?img=9',
      verified: false,
    },
    category: MOCK_CATEGORIES[5],
    duration: '5:45',
    matchPercentage: 87,
    engagement: {
      likes: 289,
      comments: 42,
      shares: 19,
      bookmarks: 56,
    },
    tags: ['design', 'innovation', 'méthode'],
    createdAt: '2024-11-03T09:15:00Z',
  },
  {
    id: '4',
    title: "De développeur junior à lead en 2 ans : mon parcours",
    description:
      'Ahmed partage les compétences techniques et soft skills qui ont fait la différence',
    thumbnail: 'https://picsum.photos/400/700?random=4',
    creator: {
      id: 'c4',
      name: 'Ahmed Benali',
      avatar: 'https://i.pravatar.cc/150?img=15',
      verified: true,
    },
    category: MOCK_CATEGORIES[2],
    duration: '7:20',
    matchPercentage: 95,
    engagement: {
      likes: 678,
      comments: 94,
      shares: 45,
      bookmarks: 112,
    },
    tags: ['développement', 'carrière', 'leadership'],
    createdAt: '2024-11-04T11:00:00Z',
  },
  {
    id: '5',
    title: 'Marketing digital : les tendances 2024 à ne pas manquer',
    description:
      'Sophie décrypte les nouvelles stratégies qui fonctionnent vraiment',
    thumbnail: 'https://picsum.photos/400/700?random=5',
    creator: {
      id: 'c5',
      name: 'Sophie Laurent',
      avatar: 'https://i.pravatar.cc/150?img=20',
      verified: true,
    },
    category: MOCK_CATEGORIES[4],
    duration: '8:10',
    matchPercentage: 89,
    engagement: {
      likes: 445,
      comments: 58,
      shares: 32,
      bookmarks: 73,
    },
    tags: ['marketing', 'digital', 'stratégie'],
    createdAt: '2024-11-05T15:45:00Z',
  },
  {
    id: '6',
    title: 'Comment négocier son salaire : guide complet',
    description:
      'Emma, coach carrière, partage ses techniques éprouvées',
    thumbnail: 'https://picsum.photos/400/700?random=6',
    creator: {
      id: 'c6',
      name: 'Emma Rousseau',
      avatar: 'https://i.pravatar.cc/150?img=24',
      verified: false,
    },
    category: MOCK_CATEGORIES[1],
    duration: '6:50',
    matchPercentage: 93,
    engagement: {
      likes: 789,
      comments: 103,
      shares: 67,
      bookmarks: 145,
    },
    tags: ['carrière', 'négociation', 'salaire'],
    createdAt: '2024-11-06T08:30:00Z',
  },
  {
    id: '7',
    title: "L'intelligence artificielle va-t-elle remplacer votre job ?",
    description:
      'Thomas analyse l\'impact de l\'IA sur le marché du travail',
    thumbnail: 'https://picsum.photos/400/700?random=7',
    creator: {
      id: 'c7',
      name: 'Thomas Petit',
      avatar: 'https://i.pravatar.cc/150?img=33',
      verified: true,
    },
    category: MOCK_CATEGORIES[2],
    duration: '9:05',
    matchPercentage: 85,
    engagement: {
      likes: 567,
      comments: 156,
      shares: 89,
      bookmarks: 98,
    },
    tags: ['IA', 'futur', 'emploi'],
    createdAt: '2024-11-07T13:20:00Z',
  },
  {
    id: '8',
    title: 'Créer un side project rentable en 90 jours',
    description:
      'Lucas raconte comment il a lancé son SaaS en parallèle de son job',
    thumbnail: 'https://picsum.photos/400/700?random=8',
    creator: {
      id: 'c8',
      name: 'Lucas Bernard',
      avatar: 'https://i.pravatar.cc/150?img=41',
      verified: false,
    },
    category: MOCK_CATEGORIES[6],
    duration: '10:30',
    matchPercentage: 91,
    engagement: {
      likes: 892,
      comments: 127,
      shares: 78,
      bookmarks: 167,
    },
    tags: ['side-project', 'entrepreneuriat', 'SaaS'],
    createdAt: '2024-11-08T16:00:00Z',
  },
  {
    id: '9',
    title: 'Manager une équipe remote : les clés du succès',
    description:
      'Marie partage ses meilleures pratiques de management à distance',
    thumbnail: 'https://picsum.photos/400/700?random=9',
    creator: {
      id: 'c9',
      name: 'Marie Durand',
      avatar: 'https://i.pravatar.cc/150?img=47',
      verified: true,
    },
    category: MOCK_CATEGORIES[3],
    duration: '7:40',
    matchPercentage: 88,
    engagement: {
      likes: 412,
      comments: 71,
      shares: 44,
      bookmarks: 82,
    },
    tags: ['management', 'remote', 'leadership'],
    createdAt: '2024-11-09T10:45:00Z',
  },
  {
    id: '10',
    title: 'De 0 à 100k abonnés sur LinkedIn : ma stratégie',
    description:
      'Paul révèle sa méthode pour créer du contenu qui performe',
    thumbnail: 'https://picsum.photos/400/700?random=10',
    creator: {
      id: 'c10',
      name: 'Paul Moreau',
      avatar: 'https://i.pravatar.cc/150?img=52',
      verified: true,
    },
    category: MOCK_CATEGORIES[4],
    duration: '8:55',
    matchPercentage: 90,
    engagement: {
      likes: 723,
      comments: 98,
      shares: 134,
      bookmarks: 201,
    },
    tags: ['LinkedIn', 'personal-branding', 'content'],
    createdAt: '2024-11-10T12:15:00Z',
  },
];

// Mock User
export const MOCK_USER = {
  id: 'user1',
  name: 'Hajar Fahmani',
  email: 'Hajar@neoori.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'Passionate about learning and professional development',
};

