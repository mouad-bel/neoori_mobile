# Comment ajouter vos vidéos locales au Flow

## Étapes à suivre :

### 1. Placer vos fichiers vidéo
- Placez vos fichiers vidéo dans le dossier `assets/videos/`
- Placez les images de prévisualisation (thumbnails) dans `assets/videos/thumbnails/`

**Formats supportés :**
- Vidéos : `.mp4`, `.mov`, `.m4v`
- Images : `.jpg`, `.png`, `.webp`

### 2. Nommer vos fichiers
Exemple :
- `assets/videos/video1.mp4`
- `assets/videos/thumbnails/video1-thumbnail.jpg`

### 3. Ajouter les entrées dans mockData.ts
Ouvrez `src/constants/mockData.ts` et ajoutez vos vidéos au début du tableau `MOCK_VIDEOS` :

```typescript
{
  id: 'my-video-1',
  title: 'Titre de votre vidéo',
  description: 'Description de votre vidéo',
  thumbnail: require('../../assets/videos/thumbnails/video1-thumbnail.jpg'),
  videoUrl: require('../../assets/videos/video1.mp4'), // Optionnel
  creator: {
    id: 'creator-1',
    name: 'Nom du créateur',
    avatar: require('../../assets/videos/thumbnails/avatar1.jpg'), // Ou URL
    verified: true,
  },
  category: MOCK_CATEGORIES[0], // 0-6
  duration: '5:30',
  matchPercentage: 95,
  engagement: {
    likes: 0,
    comments: 0,
    shares: 0,
    bookmarks: 0,
  },
  tags: ['tag1', 'tag2'],
  createdAt: new Date().toISOString(),
},
```

### 4. Redémarrer l'application
Après avoir ajouté les fichiers, redémarrez l'application Expo pour que les nouveaux assets soient détectés.

## Notes importantes :
- Les chemins dans `require()` sont relatifs au fichier `mockData.ts`
- Utilisez `require()` pour les fichiers locaux
- Utilisez des URLs (strings) pour les fichiers en ligne
- Les thumbnails doivent être en format vertical (ratio ~9:16) pour un meilleur rendu

