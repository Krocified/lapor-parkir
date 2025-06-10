import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { semanticColors } from "../../styles/colors";
import LanguageSwitcher from "./LanguageSwitcher";

function CustomHeader({ navigation, title }) {
  return (
    <View style={styles.customHeader}>
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu" size={24} color={semanticColors.headerText} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <LanguageSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: semanticColors.headerBackground,
  },
  hamburgerButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: semanticColors.headerText,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 16,
  },
});

export default CustomHeader;
