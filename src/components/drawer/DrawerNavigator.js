import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { semanticColors } from "../../styles/colors";
import Typography from "../common/Typography";

import CustomHeader from "./CustomHeader";
import MainTabNavigator from "../navigation/MainTabNavigator";
import AboutScreen from "../../screens/AboutScreen";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { t } = useTranslation();

  const screenOptions = {
    header: ({ navigation, route }) => (
      <CustomHeader
        navigation={navigation}
        title={
          route.params?.title || t(`navigation.${route.name.toLowerCase()}`)
        }
      />
    ),
    drawerStyle: {
      backgroundColor: semanticColors.drawerBackground,
      width: 280,
    },
    drawerItemStyle: {
      borderRadius: 8,
      marginVertical: 2,
    },
    drawerLabelStyle: {
      fontSize: 16,
      marginLeft: -20,
    },
    drawerActiveBackgroundColor: semanticColors.drawerActiveBackground,
    drawerActiveTintColor: semanticColors.tabBarActive,
    drawerInactiveTintColor: semanticColors.drawerTextInactive,
  };

  return (
    <Drawer.Navigator initialRouteName="Main" screenOptions={screenOptions}>
      <Drawer.Screen
        name="Main"
        component={MainTabNavigator}
        options={{
          drawerLabel: ({ focused, color }) => (
            <Typography style={{ color, fontSize: 16, marginLeft: -20 }}>
              {t("navigation.home")}
            </Typography>
          ),
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerLabel: ({ focused, color }) => (
            <Typography style={{ color, fontSize: 16, marginLeft: -20 }}>
              {t("navigation.about")}
            </Typography>
          ),
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
          sectionStyle: {
            marginTop: 8,
            borderTopWidth: 1,
            borderTopColor: semanticColors.drawerSeparator,
            paddingTop: 8,
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
