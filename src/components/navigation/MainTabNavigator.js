import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { semanticColors } from "../../styles/colors";

import ReportScreen from "../../screens/ReportScreen";
import SearchScreen from "../../screens/SearchScreen";

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const { t } = useTranslation();

  return (
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
        headerShown: false, // Hide tab headers since we'll use drawer headers
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
  );
}

export default MainTabNavigator;
