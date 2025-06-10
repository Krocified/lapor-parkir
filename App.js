import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import colors, { semanticColors } from "./src/styles/colors";

import ReportScreen from "./src/screens/ReportScreen";
import SearchScreen from "./src/screens/SearchScreen";

const Tab = createBottomTabNavigator();

export default function App() {
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
          options={{ title: "Report Violation" }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: "Search Reports" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
