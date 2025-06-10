import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { semanticColors } from "./src/styles/colors";
import "./src/i18n/i18n"; // Initialize i18n

import ReportScreen from "./src/screens/ReportScreen";
import SearchScreen from "./src/screens/SearchScreen";

const Tab = createBottomTabNavigator();

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
