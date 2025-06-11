import React, { useState } from "react";
import { View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { semanticColors } from "../../styles/colors";
import Typography from "../common/Typography";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const languages = [
    { code: "en", label: "EN", flag: "🇺🇸", name: "English" },
    { code: "id", label: "ID", flag: "🇮🇩", name: "Bahasa Indonesia" },
  ];

  const currentLangData =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.languageContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Typography variant="caption" style={styles.flagText}>
          {currentLangData.flag}
        </Typography>
        <Typography variant="caption" style={styles.languageCode}>
          {currentLangData.label}
        </Typography>
        <Ionicons
          name="chevron-down"
          size={14}
          color={semanticColors.headerText}
        />
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  i18n.language === lang.code && styles.languageOptionActive,
                ]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Typography variant="caption" style={styles.languageFlag}>
                  {lang.flag}
                </Typography>
                <View style={styles.languageInfo}>
                  <Typography variant="body2" style={styles.languageName}>
                    {lang.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={styles.languageCodeInOption}
                  >
                    {lang.label}
                  </Typography>
                </View>
                {i18n.language === lang.code && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={semanticColors.headerText}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    marginRight: 15,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: semanticColors.languageSwitcherButton,
    gap: 6,
    minWidth: 70,
  },
  flagText: {
    fontSize: 14,
  },
  languageCode: {
    fontSize: 12,
    fontWeight: "600",
    color: semanticColors.languageSwitcherText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: semanticColors.languageSwitcherOverlay,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 80,
    paddingRight: 15,
  },
  dropdownMenu: {
    backgroundColor: semanticColors.languageSwitcherDropdownBackground,
    borderRadius: 8,
    minWidth: 180,
    shadowColor: semanticColors.languageSwitcherShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  languageOptionActive: {
    backgroundColor: semanticColors.languageSwitcherActiveItem,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 14,
    fontWeight: "500",
    color: semanticColors.languageSwitcherDropdownText,
  },
  languageFlag: {
    fontSize: 14,
  },
  languageCodeInOption: {
    fontSize: 12,
    color: semanticColors.languageSwitcherDropdownTextSecondary,
  },
});

export default LanguageSwitcher;
