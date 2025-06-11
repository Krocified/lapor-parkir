import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import colors from "../../../styles/colors";
import Typography from "../../common/Typography";

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
      <Typography variant="subtitle2" style={styles.statsText}>
        {getMessage()}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default StatsDisplay;
