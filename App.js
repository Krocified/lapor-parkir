import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { semanticColors } from "./src/styles/colors";
import "./src/i18n/i18n"; // Initialize i18n
import i18n from "./src/i18n/i18n";

import ReportScreen from "./src/screens/ReportScreen";
import SearchScreen from "./src/screens/SearchScreen";

const Tab = createBottomTabNavigator();

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

export default function App() {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Report") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: semanticColors.tabBarActive,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: semanticColors.tabBarBackground,
            borderTopColor: semanticColors.tabBarBorder,
          },
          headerStyle: {
            backgroundColor: semanticColors.headerBackground,
          },
          headerTintColor: semanticColors.headerText,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => <LanguageSwitcher />,
        })}
      >
        <Tab.Screen
          name="Report"
          component={ReportScreen}
          options={{ title: t("navigation.reportViolation") }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: t("navigation.searchReports") }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    gap: 6,
    minWidth: 70,
  },
  flagText: {
    fontSize: 14,
  },
  languageCode: {
    fontSize: 12,
    fontWeight: "600",
    color: semanticColors.headerText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 80,
    paddingRight: 15,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 180,
    shadowColor: "#000",
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownItemActive: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  languageNameActive: {
    color: semanticColors.tabBarActive,
    fontWeight: "600",
  },
  languageCodeSmall: {
    fontSize: 11,
    color: "#666",
    marginTop: 1,
  },
  languageCodeActiveSmall: {
    color: semanticColors.tabBarActive,
  },
});
