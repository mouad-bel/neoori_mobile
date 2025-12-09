import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';

const AboutScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors, theme } = useTheme();
  const [activeSection, setActiveSection] = useState('mission');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const faqs = [
    {
      question: "Qu'est-ce que Neoori ?",
      answer:
        "Neoori est une plateforme d'accompagnement professionnel qui aide chaque personne à découvrir son potentiel, développer ses compétences et trouver sa voie. Grâce à des jeux, tests, et un coach IA personnalisé, nous vous guidons vers les formations et opportunités qui vous correspondent vraiment.",
    },
    {
      question: 'Comment fonctionne le système de crédits ?',
      answer:
        "Les crédits sont gagnés en complétant des actions sur la plateforme : terminer des tests, compléter votre profil, interagir avec le coach IA, etc. Ces crédits peuvent ensuite être échangés contre des services premium comme des sessions de mentorat ou des ateliers spécialisés.",
    },
    {
      question: 'La plateforme est-elle accessible aux personnes en situation de handicap ?',
      answer:
        "Oui, l'accessibilité est au cœur de notre mission. Nous suivons les normes RGAA et ARIA pour garantir que la plateforme soit utilisable par tous, quel que soit le handicap. Nous proposons des alternatives textuelles, une navigation au clavier complète, et des contrastes optimisés.",
    },
  ];

  const accessibilityFeatures = [
    {
      icon: 'text',
      title: 'Tailles de police ajustables',
      description: 'Modifiez la taille du texte selon vos besoins pour une lecture confortable',
    },
    {
      icon: 'sunny',
      title: 'Contrastes élevés',
      description: 'Des contrastes optimisés pour une meilleure lisibilité',
    },
    {
      icon: 'hand-left',
      title: 'Navigation clavier',
      description: 'Utilisez la plateforme entièrement au clavier sans souris',
    },
    {
      icon: 'moon',
      title: 'Mode sombre',
      description: 'Réduisez la fatigue visuelle avec notre mode sombre',
    },
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        onProfilePress={() => setShowProfileModal(true)}
        title="À propos" 
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadges}>
            <View style={[styles.heroBadge, { backgroundColor: '#FF6B3530' }]}>
              <Text style={[styles.heroBadgeText, { color: '#FF6B35' }]}>Notre histoire</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: colors.surfaceBackground }]}>
              <Text style={[styles.heroBadgeText, { color: colors.textPrimary }]}>
                Accessibilité & Inclusion
              </Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: '#FF6B35' }]}>
            À propos de Neoori et notre mission
          </Text>
          <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
            Découvrez notre engagement pour une plateforme inclusive et accessible à tous, conçue
            pour accompagner chaque personne dans son parcours professionnel.
          </Text>

          {/* Navigation Buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: colors.surfaceBackground },
                activeSection === 'mission' && { backgroundColor: '#FF6B35' },
              ]}
              onPress={() => setActiveSection('mission')}
            >
              <Text
                style={[
                  styles.navButtonText,
                  { color: colors.textPrimary },
                  activeSection === 'mission' && { color: 'white' },
                ]}
              >
                Notre mission
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: colors.surfaceBackground },
                activeSection === 'accessibility' && { backgroundColor: '#FF6B35' },
              ]}
              onPress={() => setActiveSection('accessibility')}
            >
              <Text
                style={[
                  styles.navButtonText,
                  { color: colors.textPrimary },
                  activeSection === 'accessibility' && { color: 'white' },
                ]}
              >
                Accessibilité
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: colors.surfaceBackground },
                activeSection === 'contact' && { backgroundColor: '#FF6B35' },
              ]}
              onPress={() => setActiveSection('contact')}
            >
              <Text
                style={[
                  styles.navButtonText,
                  { color: colors.textPrimary },
                  activeSection === 'contact' && { color: 'white' },
                ]}
              >
                Contact
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notre Mission Section */}
        <View style={styles.missionSection}>
          <View style={styles.missionContent}>
            <View style={styles.missionIcon}>
              <Ionicons name="heart-outline" size={64} color="#FF6B35" />
            </View>
            <View style={styles.missionTitleRow}>
              <Text style={[styles.missionTitle, { color: '#FF6B35' }]}>Notre mission</Text>
              <View style={styles.greenDot} />
            </View>
            <Text style={[styles.missionParagraph, { color: colors.textPrimary }]}>
              Accompagner chaque potentiel. Chez Neoori, nous croyons que chaque personne a des
              talents uniques qui méritent d'être découverts et valorisés.
            </Text>
            <Text style={[styles.missionParagraph, { color: colors.textPrimary }]}>
              Notre mission est de créer un environnement bienveillant où chacun peut explorer ses
              intérêts, développer ses compétences et trouver sa voie professionnelle, sans
              barrières ni préjugés. Nous utilisons la technologie pour personnaliser
              l'accompagnement et rendre le développement professionnel accessible à tous.
            </Text>
            <View style={styles.principlesTags}>
              <View style={[styles.principleTag, { borderColor: '#FF6B35', backgroundColor: colors.surfaceBackground }]}>
                <View style={styles.greenDot} />
                <Text style={[styles.principleText, { color: '#FF6B35' }]}>
                  Accompagnement personnalisé
                </Text>
              </View>
              <View style={[styles.principleTag, { borderColor: '#FF6B35', backgroundColor: colors.surfaceBackground }]}>
                <View style={styles.greenDot} />
                <Text style={[styles.principleText, { color: '#FF6B35' }]}>Inclusion</Text>
              </View>
              <View style={[styles.principleTag, { borderColor: '#FF8C42', backgroundColor: colors.surfaceBackground }]}>
                <View style={[styles.greenDot, { backgroundColor: '#FF8C42' }]} />
                <Text style={[styles.principleText, { color: '#FF8C42' }]}>Innovation</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Engagement pour l'inclusion Section */}
        <View style={[
          styles.inclusionSection, 
          { 
            backgroundColor: theme === 'dark' ? '#1E3A5F' : '#F1F5F9',
          }
        ]}>
          <View style={styles.inclusionHeader}>
            <View style={styles.inclusionIconCircle}>
              <Ionicons name="eye" size={24} color="#FF6B35" />
            </View>
            <Text style={[styles.inclusionTitle, { color: colors.textPrimary }]}>
              Engagement pour l'inclusion
            </Text>
          </View>
          <Text style={[styles.inclusionDescription, { color: colors.textSecondary }]}>
            L'accessibilité n'est pas une option, c'est notre priorité. Nous concevons Neoori pour
            qu'il soit utilisable par tous, quelles que soient les capacités ou les situations de
            handicap.
          </Text>

          {/* Standards Section */}
          <View style={[styles.standardsBox, { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)' }]}>
            <View style={styles.standardsHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#FF6B35" />
              <Text style={[styles.standardsTitle, { color: colors.textPrimary }]}>
                Normes respectées
              </Text>
            </View>
            <Text style={[styles.standardsText, { color: colors.textSecondary }]}>
              Notre plateforme respecte les normes RGAA (Référentiel Général d'Amélioration de
              l'Accessibilité) et suit les bonnes pratiques ARIA pour garantir une expérience
              inclusive.
            </Text>
          </View>

          <Text style={[styles.improvementText, { color: colors.textSecondary }]}>
            Nous travaillons continuellement à améliorer notre accessibilité et sommes ouverts à vos
            retours pour rendre Neoori toujours plus inclusif.
          </Text>

          {/* Accessibility Features Grid */}
          <View style={styles.featuresGrid}>
            {accessibilityFeatures.map((feature, index) => (
              <View
                key={index}
                style={[styles.featureCard, { backgroundColor: colors.cardBackground }]}
              >
                <Ionicons name={feature.icon as any} size={28} color="#FF6B35" />
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Assistance Section */}
          <View style={[styles.assistanceBox, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.assistanceHeader}>
              <Ionicons name="help-circle" size={20} color="#FF6B35" />
              <Text style={[styles.assistanceTitle, { color: colors.textPrimary }]}>
                Besoin d'assistance ?
              </Text>
            </View>
            <Text style={[styles.assistanceText, { color: colors.textSecondary }]}>
              Notre équipe est disponible pour vous aider à naviguer sur la plateforme et répondre à
              vos questions d'accessibilité.
            </Text>
            <TouchableOpacity style={[styles.assistanceButton, { backgroundColor: '#FF8C42' }]}>
              <Text style={styles.assistanceButtonText}>Nous contacter →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <View style={styles.faqHeader}>
            <Ionicons name="chatbubbles" size={28} color="#FF6B35" />
            <Text style={[styles.faqTitle, { color: colors.textPrimary }]}>
              Questions fréquentes
            </Text>
          </View>
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.faqCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
              activeOpacity={0.9}
            >
              <View style={styles.faqQuestionRow}>
                <Text style={[styles.faqNumber, { color: '#FF6B35' }]}>{index + 1}.</Text>
                <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>
                  {faq.question}
                </Text>
                <Ionicons
                  name={expandedFaq === index ? 'remove' : 'add'}
                  size={24}
                  color="#FF6B35"
                />
              </View>
              {expandedFaq === index && (
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                  {faq.answer}
                </Text>
              )}
            </TouchableOpacity>
          ))}
          <View style={styles.faqCta}>
            <Text style={[styles.faqCtaText, { color: colors.textSecondary }]}>
              Vous ne trouvez pas la réponse à votre question ?
            </Text>
            <TouchableOpacity style={[styles.faqCtaButton, { backgroundColor: '#FF6B35' }]}>
              <Text style={styles.faqCtaButtonText}>Contactez-nous →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          {/* Left Side - Contact Info */}
          <View style={styles.contactInfo}>
            <View style={styles.contactHeader}>
              <Ionicons name="mail" size={24} color="#FF6B35" />
              <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>
                Contactez-nous
              </Text>
            </View>
            <Text style={[styles.contactIntro, { color: colors.textSecondary }]}>
              Vous avez des questions, des suggestions ou besoin d'assistance ? Notre équipe est là
              pour vous aider et vous accompagner dans votre parcours.
            </Text>

            <View style={styles.contactItem}>
              <View style={styles.contactItemHeader}>
                <Ionicons name="mail" size={20} color="#FF6B35" />
                <Text style={[styles.contactItemTitle, { color: colors.textPrimary }]}>Email</Text>
              </View>
              <Text style={[styles.contactItemText, { color: colors.primary }]}>
                contact@neoori.com
          </Text>
        </View>

            <View style={styles.contactItem}>
              <View style={styles.contactItemHeader}>
                <Ionicons name="chatbubbles" size={20} color="#FF6B35" />
                <Text style={[styles.contactItemTitle, { color: colors.textPrimary }]}>
                  Chat en direct
                </Text>
              </View>
              <Text style={[styles.contactItemText, { color: colors.textSecondary }]}>
                Disponible du lundi au vendredi, 9h-18h
          </Text>
        </View>

            <View style={[styles.commitmentBox, { backgroundColor: '#FF6B3510' }]}>
              <View style={styles.contactItemHeader}>
                <Ionicons name="heart" size={20} color="#FF6B35" />
                <Text style={[styles.contactItemTitle, { color: colors.textPrimary }]}>
                  Notre engagement
                </Text>
              </View>
              <Text style={[styles.commitmentText, { color: colors.textSecondary }]}>
                Nous nous engageons à répondre à toutes vos demandes dans un délai de 24 heures
                ouvrées. Votre satisfaction est notre priorité.
              </Text>
            </View>
          </View>

          {/* Right Side - Contact Form */}
          <View style={[styles.contactForm, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.formHeader}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#FF6B35" />
              <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
                Envoyez-nous un message
          </Text>
        </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Nom complet</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Votre nom"
                placeholderTextColor={colors.textTertiary}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="votre.email@exemple.com"
                placeholderTextColor={colors.textTertiary}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Sujet</Text>
              <TouchableOpacity
                style={[styles.formInput, { backgroundColor: colors.surfaceBackground }]}
              >
                <Text style={[styles.formPlaceholder, { color: colors.textTertiary }]}>
                  {formData.subject || 'Sélectionnez un sujet'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Message</Text>
              <TextInput
                style={[
                  styles.formInput,
                  styles.formTextarea,
                  { backgroundColor: colors.surfaceBackground, color: colors.textPrimary },
                ]}
                placeholder="Comment pouvons-nous vous aider ?"
                placeholderTextColor={colors.textTertiary}
                value={formData.message}
                onChangeText={(text) => setFormData({ ...formData, message: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#FF6B35' }]}>
              <Text style={styles.submitButtonText}>Envoyer le message →</Text>
            </TouchableOpacity>
        </View>
      </View>

        {/* Legal Section */}
        <View style={styles.legalSection}>
          <Text style={[styles.legalTitle, { color: colors.textPrimary }]}>
            Documents légaux et informations complémentaires
          </Text>
          <Text style={[styles.legalDescription, { color: colors.textSecondary }]}>
            Consultez nos documents légaux pour en savoir plus sur nos conditions d'utilisation,
            notre politique de confidentialité et nos mentions légales.
          </Text>
          <View style={styles.legalButtons}>
            <TouchableOpacity
              style={[styles.legalButton, { backgroundColor: colors.surfaceBackground }]}
            >
              <Text style={[styles.legalButtonText, { color: colors.textPrimary }]}>
                Mentions légales
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.legalButton, { backgroundColor: colors.surfaceBackground }]}
            >
              <Text style={[styles.legalButtonText, { color: colors.textPrimary }]}>
                Politique de confidentialité
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.legalButton, { backgroundColor: colors.surfaceBackground }]}
            >
              <Text style={[styles.legalButtonText, { color: colors.textPrimary }]}>
                Conditions d'utilisation
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.copyright, { color: colors.textTertiary }]}>
            © 2025 Neoori. Tous droits réservés.
          </Text>
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
  heroSection: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  heroBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  heroBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
    lineHeight: 40,
  },
  heroDescription: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  navButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  navButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  navButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  missionSection: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
  missionContent: {
    alignItems: 'center',
  },
  missionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  missionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  missionTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  missionParagraph: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  principlesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  principleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  principleText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  inclusionSection: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
  },
  inclusionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  inclusionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B3520',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inclusionTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  inclusionDescription: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  standardsBox: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  standardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  standardsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  standardsText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  improvementText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  featureCard: {
    width: '48%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  featureTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  featureDescription: {
    fontSize: FONTS.sizes.xs,
    lineHeight: 16,
  },
  assistanceBox: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  assistanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  assistanceTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  assistanceText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  assistanceButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  assistanceButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  faqSection: {
    padding: SPACING.xl,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  faqTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  faqCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  faqNumber: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  faqAnswer: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 22,
    marginTop: SPACING.md,
    marginLeft: SPACING.xl,
  },
  faqCta: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  faqCtaText: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
  },
  faqCtaButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  faqCtaButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  contactSection: {
    padding: SPACING.xl,
    gap: SPACING.xl,
  },
  contactInfo: {
    gap: SPACING.lg,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  contactTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  contactIntro: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  contactItem: {
    gap: SPACING.xs,
  },
  contactItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  contactItemTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  contactItemText: {
    fontSize: FONTS.sizes.sm,
  },
  commitmentBox: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  commitmentText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  contactForm: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  formTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  formLabel: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  formInput: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONTS.sizes.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formPlaceholder: {
    flex: 1,
  },
  formTextarea: {
    height: 120,
    paddingTop: SPACING.md,
  },
  submitButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  legalSection: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
  legalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
  },
  legalDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  legalButtons: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  legalButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  legalButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
  },
  copyright: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
});

export default AboutScreen;

