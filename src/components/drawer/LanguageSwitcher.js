import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { semanticColors } from "../../styles/colors";
import i18n from "../../i18n/i18n";

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const languages = [
    { code: "en", flag: "🇺🇸", label: "EN", name: "English" },
    { code: "id", flag: "🇮🇩", label: "ID", name: "Bahasa Indonesia" },
  ];

  const currentLanguage = i18n.language;
  const currentLangData =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const switchLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.languageContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Text style={styles.flagText}>{currentLangData.flag}</Text>
        <Text style={styles.languageCode}>{currentLangData.label}</Text>
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
                  styles.dropdownItem,
                  currentLanguage === lang.code && styles.dropdownItemActive,
                ]}
                onPress={() => switchLanguage(lang.code)}
              >
                <Text style={styles.flagText}>{lang.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text
                    style={[
                      styles.languageName,
                      currentLanguage === lang.code &&
                        styles.languageNameActive,
                    ]}
                  >
                    {lang.name}
                  </Text>
                  <Text
                    style={[
                      styles.languageCodeSmall,
                      currentLanguage === lang.code &&
                        styles.languageCodeActiveSmall,
                    ]}
                  >
                    {lang.label}
                  </Text>
                </View>
                {currentLanguage === lang.code && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={semanticColors.tabBarActive}
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
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  dropdownItemActive: {
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
  languageNameActive: {
    color: semanticColors.languageSwitcherActiveText,
  },
  languageCodeSmall: {
    fontSize: 12,
    color: semanticColors.languageSwitcherDropdownTextSecondary,
  },
  languageCodeActiveSmall: {
    color: semanticColors.languageSwitcherActiveText,
  },
});

export default LanguageSwitcher;
