import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS, COLORS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import profileService from '../../services/api/profileService';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';

const ParametresScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const { profile, updateProfile, updatePreferences, loading: profileLoading } = useProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  // Security State
  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notifications State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
  });

  // Privacy State
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showEmail: false,
  });

  // Load profile data
  useEffect(() => {
    if (profile) {
      setPersonalInfo(prev => ({
        ...prev,
        phone: profile.phone || '',
      }));
      if (profile.preferences) {
        setNotificationSettings({
          emailNotifications: profile.preferences.notifications?.email ?? true,
          pushNotifications: profile.preferences.notifications?.push ?? true,
        });
        setPrivacySettings({
          publicProfile: profile.preferences.privacy?.publicProfile ?? true,
          showEmail: profile.preferences.privacy?.showEmail ?? false,
        });
      }
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update profile (phone, name)
      const updateData: any = {};
      if (personalInfo.phone !== (profile?.phone || '')) {
        updateData.phone = personalInfo.phone;
      }

      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData);
      }

      // Update preferences
      await updatePreferences({
        notifications: {
          email: notificationSettings.emailNotifications,
          push: notificationSettings.pushNotifications,
        },
        privacy: {
          publicProfile: privacySettings.publicProfile,
          showEmail: privacySettings.showEmail,
        },
      });

      // Change password if provided
      if (securityInfo.newPassword) {
        if (securityInfo.newPassword !== securityInfo.confirmPassword) {
          Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
          setSaving(false);
          return;
        }

        if (securityInfo.newPassword.length < 6) {
          Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
          setSaving(false);
          return;
        }

        if (!securityInfo.currentPassword) {
          Alert.alert('Erreur', 'Veuillez entrer votre mot de passe actuel');
          setSaving(false);
          return;
        }

        const passwordResponse = await profileService.changePassword(securityInfo.currentPassword, securityInfo.newPassword);
        if (!passwordResponse.success) {
          Alert.alert('Erreur', passwordResponse.error || 'Erreur lors du changement de mot de passe');
          setSaving(false);
          return;
        }
        // Clear password fields on success
        setSecurityInfo({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }

      Alert.alert('Succès', 'Les modifications ont été enregistrées');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        onProfilePress={() => setShowProfileModal(true)}
        title="Paramètres" 
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Paramètres</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Gérez vos préférences et paramètres de compte
          </Text>
        </View>

        {/* Personal Information Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Informations personnelles
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Nom complet</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary, opacity: 0.6 }]}
              value={personalInfo.fullName}
              editable={false}
              placeholder="Votre nom complet"
              placeholderTextColor={colors.textTertiary}
            />
            <Text style={[styles.helpText, { color: colors.textTertiary }]}>
              Le nom complet ne peut pas être modifié ici
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary, opacity: 0.6 }]}
              value={personalInfo.email}
              editable={false}
              placeholder="votre.email@exemple.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={[styles.helpText, { color: colors.textTertiary }]}>
              L'email ne peut pas être modifié ici
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Téléphone</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
              value={personalInfo.phone}
              onChangeText={(text) => setPersonalInfo({ ...personalInfo, phone: text })}
              placeholder="+33 6 12 34 56 78"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Sécurité
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Mot de passe actuel
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  { backgroundColor: colors.surfaceBackground, color: colors.textPrimary, borderColor: colors.primary },
                ]}
                value={securityInfo.currentPassword}
                onChangeText={(text) =>
                  setSecurityInfo({ ...securityInfo, currentPassword: text })
                }
                placeholder="••••••••"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Nouveau mot de passe
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  { backgroundColor: colors.surfaceBackground, color: colors.textPrimary },
                ]}
                value={securityInfo.newPassword}
                onChangeText={(text) =>
                  setSecurityInfo({ ...securityInfo, newPassword: text })
                }
                placeholder="••••••••"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Confirmer le mot de passe
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  { backgroundColor: colors.surfaceBackground, color: colors.textPrimary },
                ]}
                value={securityInfo.confirmPassword}
                onChangeText={(text) =>
                  setSecurityInfo({ ...securityInfo, confirmPassword: text })
                }
                placeholder="••••••••"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Notifications
            </Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  Notifications par email
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Recevoir des mises à jour par email
                </Text>
              </View>
            </View>
            <Switch
              value={notificationSettings.emailNotifications}
              onValueChange={(value) =>
                setNotificationSettings({ ...notificationSettings, emailNotifications: value })
              }
              trackColor={{ false: colors.border, true: COLORS.primary }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  Notifications push
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Recevoir des notifications sur le navigateur
                </Text>
              </View>
            </View>
            <Switch
              value={notificationSettings.pushNotifications}
              onValueChange={(value) =>
                setNotificationSettings({ ...notificationSettings, pushNotifications: value })
              }
              trackColor={{ false: colors.border, true: COLORS.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primaryLight} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Confidentialité
            </Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  Profil public
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Rendre mon profil visible par les autres utilisateurs
                </Text>
              </View>
            </View>
            <Switch
              value={privacySettings.publicProfile}
              onValueChange={(value) =>
                setPrivacySettings({ ...privacySettings, publicProfile: value })
              }
              trackColor={{ false: colors.border, true: COLORS.primary }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  Afficher mon email
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Permettre aux autres de voir mon adresse email
                </Text>
              </View>
            </View>
            <Switch
              value={privacySettings.showEmail}
              onValueChange={(value) =>
                setPrivacySettings({ ...privacySettings, showEmail: value })
              }
              trackColor={{ false: colors.border, true: COLORS.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.surfaceBackground }]}
            onPress={handleCancel}
          >
            <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>
              Annuler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: COLORS.primary, opacity: saving ? 0.7 : 1 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <ProfileModal 
        visible={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    marginTop: 100,
  },
  header: {
    padding: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
  },
  section: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
  helpText: {
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  input: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONTS.sizes.md,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingRight: 50,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONTS.sizes.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  eyeButton: {
    position: 'absolute',
    right: SPACING.lg,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: FONTS.sizes.xs,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  saveButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
});

export default ParametresScreen;

