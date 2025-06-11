import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../styles/colors";
import { config } from "../config/env";
import Typography from "../components/common/Typography";

export default function AboutScreen() {
  const { t } = useTranslation();

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* App Info Section */}
        <View style={styles.section}>
          <View style={styles.appHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="car-outline" size={48} color={colors.primary} />
            </View>
            <Typography variant="h1" style={styles.appName}>
              Lapor Parkir
            </Typography>
            <Typography variant="subtitle1" style={styles.version}>
              Version 1.0.0
            </Typography>
          </View>

          <Typography variant="body1" style={styles.description}>
            {t(
              "about.description",
              "Lapor Parkir is a community-driven app that helps citizens report parking violations and contribute to better urban mobility. Together, we can create more organized and accessible public spaces."
            )}
          </Typography>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Typography variant="h2" style={styles.sectionTitle}>
            {t("about.features", "Features")}
          </Typography>

          <View style={styles.featureItem}>
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Typography variant="subtitle1" style={styles.featureTitle}>
                {t("about.reportViolations", "Report Violations")}
              </Typography>
              <Typography variant="body2" style={styles.featureDescription}>
                {t(
                  "about.reportViolationsDesc",
                  "Easily report parking violations with location and violation type details."
                )}
              </Typography>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="search-outline" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Typography variant="subtitle1" style={styles.featureTitle}>
                {t("about.searchReports", "Search Reports")}
              </Typography>
              <Typography variant="body2" style={styles.featureDescription}>
                {t(
                  "about.searchReportsDesc",
                  "Find and filter violation reports by location, date, and violation type."
                )}
              </Typography>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="shield-outline" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Typography variant="subtitle1" style={styles.featureTitle}>
                {t("about.plateTypes", "Special Plate Recognition")}
              </Typography>
              <Typography variant="body2" style={styles.featureDescription}>
                {t(
                  "about.plateTypesDesc",
                  "Identify and categorize different vehicle plate types including police, diplomatic, and more."
                )}
              </Typography>
            </View>
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.section}>
          <Typography variant="h2" style={styles.sectionTitle}>
            {t("about.developer", "Developer")}
          </Typography>
          <Typography variant="body1" style={styles.text}>
            {t(
              "about.developerInfo",
              "This app was developed as part of a community initiative to improve urban mobility and parking compliance."
            )}
          </Typography>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Typography variant="h2" style={styles.sectionTitle}>
            {t("about.contact", "Contact & Support")}
          </Typography>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => openLink(`mailto:${config.supportEmail}`)}
          >
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Typography variant="body1" style={styles.contactText}>
              {config.supportEmail}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => openLink(config.githubUrl)}
          >
            <Ionicons name="logo-github" size={20} color={colors.primary} />
            <Typography variant="body1" style={styles.contactText}>
              GitHub Repository
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Typography variant="h2" style={styles.sectionTitle}>
            {t("about.legal", "Legal")}
          </Typography>
          <Typography variant="body1" style={styles.text}>
            {t(
              "about.disclaimer",
              "This app is for community use only. Please verify all reports with local authorities before taking any action."
            )}
          </Typography>
        </View>

        {/* Attribution */}
        <View style={styles.footer}>
          <Typography variant="subtitle1" style={styles.footerText}>
            {t("about.madeWith", "Made with ❤️ for better cities")}
          </Typography>
          <Typography variant="caption" style={styles.copyright}>
            © 2025 Lapor Parkir.{" "}
            {t("about.allRightsReserved", "All rights reserved.")}
          </Typography>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  appHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: semanticColors.iconBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  appName: {
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 15,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureText: {
    flex: 1,
    marginLeft: 15,
  },
  featureTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: semanticColors.cardBackground,
  },
  contactText: {
    fontSize: 15,
    color: colors.primary,
    marginLeft: 12,
  },
  footer: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: semanticColors.cardBorder,
  },
  footerText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: "center",
  },
  copyright: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
