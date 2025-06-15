import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../styles/colors";
import Typography from "../../common/Typography";

const StatsDisplay = ({
  count,
  hasActiveFilters = false,
  customMessage,
  style,
  onRefresh,
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
      <View style={styles.statsContent}>
        <Typography variant="subtitle2" style={styles.statsText}>
          {getMessage()}
        </Typography>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  statsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  refreshButton: {
    padding: 4,
  },
});

export default StatsDisplay;
