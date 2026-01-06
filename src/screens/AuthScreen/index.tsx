import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register, isLoading } = useAuth();
  const { colors, theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de la connexion');
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await register({ email, password, name });
      Alert.alert('Succès', 'Inscription réussie ! Vous êtes maintenant connecté.');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de l\'inscription');
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo Icon */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={
                isDarkMode
                  ? require('../../../assets/images/png/icon bleu@2x-8.png')
                  : require('../../../assets/images/png/icon orange dégradé@2x-8.png')
              }
              style={styles.logoIcon}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Révélez votre potentiel. Construisez l'avenir.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {isRegisterMode && (
            <TextInput
              style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.textPrimary, borderColor: colors.surfaceBackground }]}
              placeholder="Nom complet"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.textPrimary, borderColor: colors.surfaceBackground }]}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.textPrimary, borderColor: colors.surfaceBackground }]}
            placeholder="Mot de passe"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={isRegisterMode ? handleRegister : handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {isRegisterMode ? "S'inscrire" : 'Se connecter'}
              </Text>
            )}
          </TouchableOpacity>

          {!isRegisterMode && (
            <TouchableOpacity style={styles.linkButton}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Mot de passe oublié?</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {isRegisterMode ? 'Déjà un compte?' : "Pas encore de compte?"}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>
              {isRegisterMode ? ' Se connecter' : " S'inscrire"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Hint */}
        {!isRegisterMode && (
          <View style={[styles.demoHint, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.demoText, { color: colors.textSecondary }]}>
              💡 Connectez-vous avec votre compte ou créez-en un nouveau
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl * 2,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  logoIcon: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  form: {
    width: '100%',
    marginBottom: SPACING.xxxl,
  },
  input: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    fontSize: FONTS.sizes.md,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  button: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.md,
  },
  buttonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  linkText: {
    fontSize: FONTS.sizes.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONTS.sizes.md,
  },
  footerLink: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  demoHint: {
    marginTop: SPACING.xxxl,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  demoText: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
});

export default AuthScreen;

