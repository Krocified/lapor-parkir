import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors from "../../../styles/colors";
import Typography from "../../common/Typography";

const EmptyState = ({
  hasActiveFilters,
  onClearAllFilters,
  icon = "document-outline",
  title,
  subtitle,
  clearButtonText = "Clear All Filters",
}) => {
  const { t } = useTranslation();

  const defaultTitle = hasActiveFilters
    ? t("search.noMatchingReports")
    : t("search.noReports");

  const defaultSubtitle = hasActiveFilters
    ? t("search.noMatchingReportsSubtitle")
    : t("search.noReportsSubtitle");

  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={64} color={colors.disabled} />
      <Typography variant="h3" style={styles.emptyTitle}>
        {title || defaultTitle}
      </Typography>
      <Typography variant="body1" style={styles.emptySubtitle}>
        {subtitle || defaultSubtitle}
      </Typography>
      {hasActiveFilters && onClearAllFilters && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={onClearAllFilters}
        >
          <Typography variant="button" style={styles.clearFiltersButtonText}>
            {clearButtonText}
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  clearFiltersButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: colors.white,
    fontSize: 14,
  },
});

export default EmptyState;
