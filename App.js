import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "./src/i18n/i18n"; // Initialize i18n

import DrawerNavigator from "./src/components/drawer/DrawerNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <DrawerNavigator />
    </NavigationContainer>
  );
}
