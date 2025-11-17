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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { colors, theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          {/* Brand Logo Icon */}
          <View style={[
            styles.logoWrapper,
            isDarkMode && styles.logoWrapperDark,
            !isDarkMode && styles.logoWrapperLight
          ]}>
            <View style={styles.logoIcon}>
              {/* Navy blue base shape */}
              <View style={[
                styles.logoBaseShape,
                isDarkMode && styles.logoBaseShapeDark,
                !isDarkMode && styles.logoBaseShapeLight
              ]} />
              {/* Orange gradient element */}
              <LinearGradient
                colors={['#FF6B35', '#FF8C42', '#FFB380']}
                start={{ x: 0.5, y: 0.8 }}
                end={{ x: 0.5, y: 0 }}
                style={styles.logoGradient}
              >
                <View style={styles.logoGradientShape} />
              </LinearGradient>
              {/* Small orange dot above */}
              <View style={styles.logoDot} />
            </View>
          </View>
          {/* Brand Wordmark: "neo" in navy, "ori" in orange */}
          <View style={styles.logoTextContainer}>
            <Text style={[
              styles.logoTextNavy,
              !isDarkMode && { color: '#1E293B' },
              isDarkMode && { color: '#F8FAFC' }
            ]}>neo</Text>
            <View style={styles.logoOriContainer}>
              <Text style={styles.logoTextOrange}>or</Text>
              <View style={styles.logoI}>
                <Text style={styles.logoTextOrange}>i</Text>
                <View style={styles.logoIDot} />
              </View>
            </View>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Unlock Your Potential. Shape Your Tomorrow.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.background }]}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Mot de passe oublié?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Pas encore de compte?</Text>
          <TouchableOpacity>
            <Text style={[styles.footerLink, { color: colors.primary }]}> S'inscrire</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Hint */}
        <View style={[styles.demoHint, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.demoText, { color: colors.textSecondary }]}>
            💡 Mode démo : utilisez n'importe quel email/mot de passe
          </Text>
        </View>
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
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  logoWrapperDark: {
    backgroundColor: '#1E293B', // Navy blue background for dark mode
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoWrapperLight: {
    backgroundColor: '#F8FAFC', // Light background for light mode
    borderWidth: 2,
    borderColor: 'rgba(30, 41, 59, 0.2)',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  logoIcon: {
    width: 74,
    height: 74,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  logoBaseShape: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E293B', // Navy blue - brand primary base
    bottom: 2,
    left: 2,
    transform: [{ rotate: '-15deg' }],
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoBaseShapeDark: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoBaseShapeLight: {
    borderColor: 'rgba(30, 41, 59, 0.2)',
  },
  logoGradient: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    bottom: 2,
    right: 2,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  logoGradientShape: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 18,
  },
  logoDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    top: 2,
    right: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 4,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoTextNavy: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1.5,
  },
  logoOriContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoTextOrange: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1.5,
    color: '#FF6B35', // Brand orange
    textShadowColor: 'rgba(255, 107, 53, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoI: {
    position: 'relative',
  },
  logoIDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B35', // Brand orange
    top: -2,
    right: -1,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
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

