import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import colors from "../../../styles/colors";

const StatsDisplay = ({
  count,
  hasActiveFilters = false,
  customMessage,
  style,
}) => {
  const { t } = useTranslation();

  const getMessage = () => {
    if (customMessage) return customMessage;

    let message = t("search.reportStats", { count });
    if (hasActiveFilters) {
      message += t("search.statsFiltered");
    }
    return message;
  };

  return (
    <View style={[styles.statsContainer, style]}>
      <Text style={styles.statsText}>{getMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexShrink: 0,
    height: 44,
    flexGrow: 0,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
});

export default StatsDisplay;
