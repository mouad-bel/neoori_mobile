import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';

const ParametresScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '+33 6 12 34 56 78',
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

  const handleSave = () => {
    console.log('Saving settings...');
    // TODO: Implement save functionality
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        onMenuPress={() => navigation.openDrawer()} 
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
              style={[styles.input, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
              value={personalInfo.fullName}
              onChangeText={(text) => setPersonalInfo({ ...personalInfo, fullName: text })}
              placeholder="Votre nom complet"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
              value={personalInfo.email}
              onChangeText={(text) => setPersonalInfo({ ...personalInfo, email: text })}
              placeholder="votre.email@exemple.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
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
            <Ionicons name="notifications-outline" size={20} color="#FF6B35" />
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
              trackColor={{ false: colors.border, true: '#FF6B35' }}
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
              trackColor={{ false: colors.border, true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#FF8C42" />
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
              trackColor={{ false: colors.border, true: '#FF6B35' }}
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
              trackColor={{ false: colors.border, true: '#FF6B35' }}
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
            style={[styles.saveButton, { backgroundColor: '#FF6B35' }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
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

