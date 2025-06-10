import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../styles/colors";

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
            <Text style={styles.appName}>Lapor Parkir</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>

          <Text style={styles.description}>
            {t(
              "about.description",
              "Lapor Parkir is a community-driven app that helps citizens report parking violations and contribute to better urban mobility. Together, we can create more organized and accessible public spaces."
            )}
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("about.features", "Features")}
          </Text>

          <View style={styles.featureItem}>
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>
                {t("about.reportViolations", "Report Violations")}
              </Text>
              <Text style={styles.featureDescription}>
                {t(
                  "about.reportViolationsDesc",
                  "Easily report parking violations with location and violation type details."
                )}
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="search-outline" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>
                {t("about.searchReports", "Search Reports")}
              </Text>
              <Text style={styles.featureDescription}>
                {t(
                  "about.searchReportsDesc",
                  "Find and filter violation reports by location, date, and violation type."
                )}
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="shield-outline" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>
                {t("about.plateTypes", "Special Plate Recognition")}
              </Text>
              <Text style={styles.featureDescription}>
                {t(
                  "about.plateTypesDesc",
                  "Identify and categorize different vehicle plate types including police, diplomatic, and more."
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("about.developer", "Developer")}
          </Text>
          <Text style={styles.text}>
            {t(
              "about.developerInfo",
              "This app was developed as part of a community initiative to improve urban mobility and parking compliance."
            )}
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("about.contact", "Contact & Support")}
          </Text>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => openLink("mailto:support@laporparkir.com")}
          >
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={styles.contactText}>support@laporparkir.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => openLink("https://github.com/laporparkir")}
          >
            <Ionicons name="logo-github" size={20} color={colors.primary} />
            <Text style={styles.contactText}>GitHub Repository</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("about.legal", "Legal")}</Text>
          <Text style={styles.text}>
            {t(
              "about.disclaimer",
              "This app is for community use only. Please verify all reports with local authorities before taking any action."
            )}
          </Text>

          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>
              {t("about.privacyPolicy", "Privacy Policy")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>
              {t("about.termsOfService", "Terms of Service")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Attribution */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t("about.madeWith", "Made with ❤️ for better cities")}
          </Text>
          <Text style={styles.copyright}>
            © 2024 Lapor Parkir.{" "}
            {t("about.allRightsReserved", "All rights reserved.")}
          </Text>
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
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    padding: 15,
    backgroundColor: semanticColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: semanticColors.cardBorder,
  },
  featureText: {
    flex: 1,
    marginLeft: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: semanticColors.cardBackground,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: semanticColors.cardBorder,
  },
  contactText: {
    fontSize: 15,
    color: colors.primary,
    marginLeft: 10,
    fontWeight: "500",
  },
  linkItem: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "500",
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
