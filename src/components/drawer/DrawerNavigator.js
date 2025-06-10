import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { semanticColors } from "../../styles/colors";

import CustomHeader from "./CustomHeader";
import MainTabNavigator from "../navigation/MainTabNavigator";
import AboutScreen from "../../screens/AboutScreen";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: {
          backgroundColor: semanticColors.headerBackground,
          height: 56,
        },
        headerTintColor: semanticColors.headerText,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: "",
        header: () => {
          let title = t("navigation.laporParkir", "Lapor Parkir");
          if (route.name === "Main") {
            title = t("navigation.laporParkir", "Lapor Parkir");
          } else if (route.name === "About") {
            title = t("navigation.about", "About");
          }

          return <CustomHeader navigation={navigation} title={title} />;
        },
        drawerStyle: {
          backgroundColor: "#F8FAFC",
          width: 280,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 8,
          paddingLeft: 0,
        },
        drawerLabelStyle: {
          color: "#334155",
          fontSize: 16,
          marginLeft: 0,
        },
        drawerActiveTintColor: semanticColors.tabBarActive,
        drawerActiveBackgroundColor: `${semanticColors.tabBarActive}15`,
        drawerInactiveTintColor: "#64748B",
        drawerContentStyle: {
          paddingVertical: 8,
          paddingLeft: 8,
        },
        drawerItemPressedStyle: {
          backgroundColor: `${semanticColors.tabBarActive}15`,
        },
        drawerItemPressOpacity: 1,
      })}
    >
      <Drawer.Screen
        name="Main"
        component={MainTabNavigator}
        options={{
          title: t("navigation.home", "Home"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: t("navigation.about", "About"),
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
          sectionStyle: {
            marginTop: 8,
            borderTopWidth: 1,
            borderTopColor: "#E2E8F0",
            paddingTop: 8,
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
