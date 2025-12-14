import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS, COLORS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

const ProfileScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const skills = [
    { name: 'Communication', level: 85 },
    { name: 'Rédaction', level: 90 },
    { name: 'Marketing digital', level: 75 },
    { name: 'Gestion de projet', level: 65 },
    { name: 'Design graphique', level: 50 },
  ];

  const experiences = [
    {
      id: '1',
      title: 'Assistante Marketing',
      company: 'Entreprise ABC',
      period: '2020 - 2023',
      description: 'Gestion des campagnes marketing et analyse des résultats.',
    },
    {
      id: '2',
      title: 'Chargée de communication',
      company: 'Startup XYZ',
      period: '2018 - 2020',
      description: 'Création de contenu et gestion des réseaux sociaux.',
    },
  ];

  const education = [
    {
      id: '1',
      degree: 'Master en Communication',
      school: 'Université de Lyon',
      year: '2018',
    },
    {
      id: '2',
      degree: 'Licence en Lettres Modernes',
      school: 'Université de Paris',
      year: '2016',
    },
  ];

  const documents = [
    {
      id: '1',
      name: 'CV_Hajar_Fahmani.pdf',
      size: '1.2 MB',
      uploadedAt: 'Il y a 2 semaines',
      type: 'pdf',
    },
    {
      id: '2',
      name: 'Lettre_motivation.docx',
      size: '450 KB',
      uploadedAt: 'Il y a 2 semaines',
      type: 'doc',
    },
    {
      id: '3',
      name: 'Portfolio_2023.pdf',
      size: '3.5 MB',
      uploadedAt: 'Il y a 1 mois',
      type: 'pdf',
    },
    {
      id: '4',
      name: 'Diplome_Master.pdf',
      size: '800 KB',
      uploadedAt: 'Il y a 3 mois',
      type: 'pdf',
    },
    {
      id: '5',
      name: 'Certificat_Marketing.pdf',
      size: '1.1 MB',
      uploadedAt: 'Il y a 6 mois',
      type: 'pdf',
    },
  ];

  const recentActivities = [
    { id: '1', text: "Test d'intérêts complété", time: 'Il y a 2 jours' },
    { id: '2', text: "Compétence 'Communication' ajoutée", time: 'Il y a 3 jours' },
    { id: '3', text: 'Test de soft skills complété', time: 'Il y a 1 semaine' },
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'doc':
        return 'document';
      default:
        return 'document-outline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        onProfilePress={() => setShowProfileModal(true)}
        title="Mon Profil"
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.profileTop}>
                <View style={styles.avatarContainer}>
                  {user?.avatar && (
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  )}
                  <TouchableOpacity style={styles.editAvatarButton}>
                    <Ionicons name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.profileInfoContainer}>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {user?.name || 'Hajar Fahmani'}
                    </Text>
                    <View style={styles.profileDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="location" size={14} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                          Lyon, France
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="briefcase" size={14} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                          Reconversion professionnelle
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: COLORS.primary }]}>
                    <Text style={styles.editProfileButtonText}>Modifier le profil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Synthèse IA Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles" size={20} color={COLORS.primaryLight} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Synthèse IA
                </Text>
              </View>

              <View style={styles.synthesisItem}>
                <View style={styles.synthesisHeader}>
                  <View style={styles.greenDot} />
                  <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>Forces</Text>
                </View>
                <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                  Excellente communicante avec de solides compétences rédactionnelles. Vous avez une
                  bonne expérience en marketing et communication qui vous donne une base solide pour
                  votre projet de reconversion.
                </Text>
              </View>

              <View style={styles.synthesisItem}>
                <View style={styles.synthesisHeader}>
                  <View style={styles.greenDot} />
                  <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>
                    Axes de progression
                  </Text>
                </View>
                <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                  Développer davantage vos compétences techniques, notamment en design graphique qui
                  pourrait compléter votre profil.
                </Text>
              </View>

              <View style={styles.synthesisItem}>
                <View style={styles.synthesisHeader}>
                  <View style={styles.greenDot} />
                  <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>
                    Intérêts clés
                  </Text>
                </View>
                <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                  D'après vos tests, vous montrez un fort intérêt pour la créativité, l'innovation et
                  le travail en équipe. Ces éléments sont de bons indicateurs pour orienter votre
                  reconversion.
                </Text>
              </View>
            </View>

            {/* Expériences professionnelles Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Expériences professionnelles
                </Text>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {experiences.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <View style={styles.greenDot} />
                    <View style={styles.experienceInfo}>
                      <Text style={[styles.experienceTitle, { color: colors.textPrimary }]}>
                        {exp.title}
                      </Text>
                      <Text style={[styles.experienceCompany, { color: colors.textSecondary }]}>
                        {exp.company} • {exp.period}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.experienceDescription, { color: colors.textSecondary }]}>
                    {exp.description}
                  </Text>
                </View>
              ))}
            </View>

            {/* Formation Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school-outline" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Formation
                </Text>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {education.map((edu) => (
                <View key={edu.id} style={styles.educationItem}>
                  <View style={styles.educationInfo}>
                    <Text style={[styles.educationDegree, { color: colors.textPrimary }]}>
                      {edu.degree}
                    </Text>
                    <Text style={[styles.educationSchool, { color: colors.textSecondary }]}>
                      {edu.school}
                    </Text>
                  </View>
                  <Text style={[styles.educationYear, { color: colors.textSecondary }]}>
                    {edu.year}
                  </Text>
                </View>
              ))}
            </View>

            {/* Compétences Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Compétences
                </Text>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={[styles.skillName, { color: colors.textPrimary }]}>
                    {skill.name}
                  </Text>
                  <View style={styles.skillProgress}>
                    <View style={[styles.skillProgressBar, { backgroundColor: colors.surfaceBackground }]}>
                      <View style={[styles.skillProgressFill, { width: `${skill.level}%` }]} />
                    </View>
                    <Text style={[styles.skillPercentage, { color: COLORS.primary }]}>
                      {skill.level}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Importer des documents Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Importer des documents
              </Text>
              <TouchableOpacity
                style={[styles.uploadArea, { borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <Ionicons name="cloud-upload-outline" size={40} color={colors.textTertiary} />
                <Text style={[styles.uploadTitle, { color: colors.textPrimary }]}>
                  Déposer un document
                </Text>
                <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                  Glissez-déposez ou cliquez pour sélectionner
                </Text>
              </TouchableOpacity>
            </View>

            {/* Mes Documents Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="folder-outline" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Mes Documents
                </Text>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {documents.map((doc) => (
                <View key={doc.id} style={styles.documentItem}>
                  <View style={[styles.documentIcon, { backgroundColor: '#EF444420' }]}>
                    <Ionicons name={getDocumentIcon(doc.type) as any} size={20} color="#EF4444" />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={[styles.documentName, { color: colors.textPrimary }]}>
                      {doc.name}
                    </Text>
                    <Text style={[styles.documentMeta, { color: colors.textSecondary }]}>
                      {doc.size} • {doc.uploadedAt}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Derniers ajouts Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Derniers ajouts issus des jeux/tests
                </Text>
              </View>

              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.greenDot} />
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityText, { color: colors.textPrimary }]}>
                      {activity.text}
                    </Text>
                    <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                      {activity.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <ProfileModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} />
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
  contentWrapper: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: SPACING.lg,
    padding: SPACING.xl,
  },
  leftColumn: {
    flex: isLargeScreen ? 1.5 : 1,
    gap: SPACING.lg,
  },
  rightColumn: {
    flex: 1,
    gap: SPACING.lg,
  },
  profileHeader: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  profileTop: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoContainer: {
    flex: 1,
  },
  profileInfo: {
    marginBottom: SPACING.md,
  },
  profileName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  profileDetails: {
    gap: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: FONTS.sizes.sm,
  },
  editProfileButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  section: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  synthesisItem: {
    marginBottom: SPACING.lg,
  },
  synthesisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  synthesisTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  synthesisText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginLeft: SPACING.lg,
  },
  experienceItem: {
    marginBottom: SPACING.lg,
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: FONTS.sizes.sm,
  },
  experienceDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginLeft: SPACING.lg,
  },
  educationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  educationInfo: {
    flex: 1,
  },
  educationDegree: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 2,
  },
  educationSchool: {
    fontSize: FONTS.sizes.sm,
  },
  educationYear: {
    fontSize: FONTS.sizes.sm,
  },
  skillItem: {
    marginBottom: SPACING.lg,
  },
  skillName: {
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.xs,
  },
  skillProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  skillProgressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  skillPercentage: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    minWidth: 40,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  uploadTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginTop: SPACING.md,
  },
  uploadSubtitle: {
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    marginBottom: 2,
  },
  documentMeta: {
    fontSize: FONTS.sizes.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: FONTS.sizes.xs,
  },
});

export default ProfileScreen;

