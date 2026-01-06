# Backend Integration Guide

Ce document explique comment le frontend est préparé pour l'intégration avec le backend.

## 📁 Structure des Services

```
src/
├── services/
│   ├── api/
│   │   ├── apiClient.ts      # Client HTTP avec intercepteurs pour auth
│   │   ├── authService.ts     # Service d'authentification
│   │   └── profileService.ts  # Service de profil utilisateur
│   └── storage/
│       └── StorageService.ts  # Gestion du stockage local (tokens, user data)
├── hooks/
│   └── useProfile.ts          # Hook personnalisé pour gérer le profil
├── config/
│   └── api.ts                 # Configuration de l'API
└── types/
    └── index.ts               # Types TypeScript mis à jour
```

## 🔧 Configuration

### 1. URL de l'API

L'URL de l'API est configurée dans `src/config/api.ts` et peut être définie via:

**Option 1: Variable d'environnement (recommandé)**

Créez un fichier `.env` à la racine du projet:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

**Option 2: Pour développement sur appareil physique**

- **iOS**: Utilisez l'adresse IP de votre Mac (ex: `http://192.168.1.100:3000/api`)
- **Android**: Utilisez l'adresse IP de votre ordinateur (ex: `http://192.168.1.100:3000/api`)

**Option 3: Production**

```env
EXPO_PUBLIC_API_URL=https://api.neoori.com/api
```

### 2. Structure des Endpoints Attendus

Le frontend s'attend à ce que le backend expose les endpoints suivants:

#### Authentification (`/auth`)

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Rafraîchir le token
- `POST /auth/logout` - Déconnexion
- `POST /auth/password-reset/request` - Demander une réinitialisation
- `POST /auth/password-reset/reset` - Réinitialiser le mot de passe
- `POST /auth/verify-email` - Vérifier l'email
- `POST /auth/verify-email/resend` - Renvoyer l'email de vérification
- `GET /auth/me` - Obtenir l'utilisateur actuel
- `POST /auth/oauth/google` - Connexion OAuth Google
- `POST /auth/oauth/apple` - Connexion OAuth Apple

#### Utilisateur (`/users`)

- `GET /users/profile` - Obtenir le profil complet
- `PATCH /users/profile` - Mettre à jour le profil de base
- `PATCH /users/profile/preferences` - Mettre à jour les préférences

#### Éducation (`/users/profile/education`)

- `POST /users/profile/education` - Ajouter une éducation
- `PATCH /users/profile/education/:id` - Mettre à jour une éducation
- `DELETE /users/profile/education/:id` - Supprimer une éducation

#### Expériences (`/users/profile/experiences`)

- `POST /users/profile/experiences` - Ajouter une expérience
- `PATCH /users/profile/experiences/:id` - Mettre à jour une expérience
- `DELETE /users/profile/experiences/:id` - Supprimer une expérience

#### Compétences (`/users/profile/skills`)

- `POST /users/profile/skills` - Ajouter une compétence
- `PATCH /users/profile/skills/:id` - Mettre à jour une compétence
- `DELETE /users/profile/skills/:id` - Supprimer une compétence

#### Documents (`/users/profile/documents`)

- `POST /users/profile/documents` - Upload un document (multipart/form-data)
- `DELETE /users/profile/documents/:id` - Supprimer un document
- `GET /api/files/documents/:userId/:category/:filename` - Télécharger un document

## 📝 Format des Réponses API

Toutes les réponses doivent suivre ce format:

```typescript
{
  success: boolean;
  data?: T;           // Données de la réponse
  error?: string;     // Message d'erreur
  message?: string;    // Message informatif
}
```

### Exemples

**Succès:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreur:**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "The email or password is incorrect"
}
```

## 🔐 Authentification

### Tokens

Le frontend utilise un système de tokens JWT avec refresh:

- **Access Token**: Stocké dans AsyncStorage, expiré après 15-30 minutes
- **Refresh Token**: Stocké dans AsyncStorage, expiré après 7-30 jours

### Headers

Toutes les requêtes authentifiées incluent:

```
Authorization: Bearer <access_token>
```

### Refresh Automatique

Le client API intercepte automatiquement les erreurs 401 et tente de rafraîchir le token. Si le refresh échoue, l'utilisateur est déconnecté.

## 📦 Types TypeScript

Les types sont définis dans `src/types/index.ts`:

- `User` - Données utilisateur de base (MySQL)
- `UserProfile` - Profil étendu (MongoDB)
- `UserEducation`, `UserExperience`, `UserSkill`, `UserDocument` - Données du profil
- `ApiResponse<T>` - Format de réponse API
- `LoginRequest`, `RegisterRequest` - Requêtes d'authentification

## 🎣 Hooks Disponibles

### `useAuth()`

Hook pour l'authentification (déjà existant, mis à jour):

```typescript
const { user, isAuthenticated, login, register, logout, isLoading } = useAuth();
```

### `useProfile()`

Nouveau hook pour gérer le profil:

```typescript
const {
  profile,
  loading,
  error,
  refreshProfile,
  updateProfile,
  updatePreferences,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addSkill,
  updateSkill,
  deleteSkill,
  uploadDocument,
  deleteDocument,
} = useProfile();
```

## 📤 Upload de Documents

Pour uploader un document, utilisez `expo-document-picker`:

```typescript
import * as DocumentPicker from 'expo-document-picker';
import { useProfile } from '../hooks/useProfile';

const { uploadDocument } = useProfile();

const handleUpload = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadDocument(result.assets[0], 'CV', (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
    }
  } catch (error) {
    console.error('Error picking document:', error);
  }
};
```

## 🚀 Utilisation dans les Composants

### Exemple: Écran de Connexion

```typescript
import { useAuth } from '../store/AuthContext';

const LoginScreen = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigation automatique gérée par RootNavigator
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  // ...
};
```

### Exemple: Écran de Profil

```typescript
import { useProfile } from '../hooks/useProfile';

const ProfileScreen = () => {
  const { profile, loading, updateProfile, addEducation } = useProfile();

  if (loading) return <ActivityIndicator />;
  if (!profile) return <Text>No profile</Text>;

  const handleUpdateBio = async () => {
    try {
      await updateProfile({ bio: 'New bio text' });
    } catch (error) {
      Alert.alert('Erreur', 'Failed to update profile');
    }
  };

  // ...
};
```

## 🔄 Migration depuis Mock

Le code a été mis à jour pour utiliser l'API réelle au lieu des données mock. Les changements principaux:

1. ✅ `AuthContext` utilise maintenant `authService` au lieu de `MOCK_USER`
2. ✅ Les tokens sont gérés avec refresh automatique
3. ✅ Le profil est chargé depuis l'API via `useProfile` hook
4. ✅ Les services API sont prêts pour l'intégration

## ⚠️ Notes Importantes

1. **Mode Développement**: Assurez-vous que l'URL de l'API est accessible depuis votre appareil/émulateur
2. **CORS**: Le backend doit autoriser les requêtes depuis votre app mobile
3. **HTTPS en Production**: Utilisez HTTPS pour la production
4. **Gestion d'Erreurs**: Tous les services retournent des erreurs formatées, gérez-les dans vos composants

## 📚 Prochaines Étapes

Une fois le backend prêt:

1. Configurez `EXPO_PUBLIC_API_URL` dans `.env`
2. Testez la connexion avec l'endpoint `/auth/me`
3. Testez le login/register
4. Testez le chargement du profil
5. Testez l'upload de documents

