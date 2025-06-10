import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors from "../../../styles/colors";

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
      <Text style={styles.emptyTitle}>{title || defaultTitle}</Text>
      <Text style={styles.emptySubtitle}>{subtitle || defaultSubtitle}</Text>
      {hasActiveFilters && onClearAllFilters && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={onClearAllFilters}
        >
          <Text style={styles.clearFiltersButtonText}>{clearButtonText}</Text>
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
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginTop: 15,
    alignItems: "center",
  },
  clearFiltersButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});

export default EmptyState;
