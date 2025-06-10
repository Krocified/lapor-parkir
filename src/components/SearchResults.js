import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../styles/colors";
import { PLATE_TYPES, getPlateTypeInfo } from "../constants/plateTypes";
import { getViolationLabel, getPlateTypeLabel } from "../i18n/translations";

const SearchResults = ({
  reports,
  isLoading,
  refreshing,
  onRefresh,
  onDeleteReport,
  hasActiveFilters,
  onClearAllFilters,
  listKey,
}) => {
  const { t } = useTranslation();

  const formatViolations = (violations) => {
    return violations.map((id) => getViolationLabel(id, t)).join(", ");
  };

  const renderPlateTypeBadge = (plateType) => {
    if (!plateType || plateType === "regular") return null;

    const typeInfo = getPlateTypeInfo(plateType);
    return (
      <View
        style={[styles.plateTypeBadge, { backgroundColor: typeInfo.color }]}
      >
        <Ionicons name={typeInfo.icon} size={12} color={colors.white} />
        <Text style={styles.plateTypeBadgeText}>
          {getPlateTypeLabel(plateType, t)}
        </Text>
      </View>
    );
  };

  const renderReportCard = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.plateSection}>
          <View style={styles.plateContainer}>
            <Text style={styles.plateNumber}>{item.plateNumber}</Text>
          </View>
          {renderPlateTypeBadge(item.plateType)}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteReport(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.reportContent}>
        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText}>
            {item.date} at {item.time}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText} numberOfLines={2}>
            {item.location.address}
          </Text>
        </View>

        <View style={styles.violationsContainer}>
          <Text style={styles.violationsLabel}>Violations:</Text>
          <Text style={styles.violationsText}>
            {formatViolations(item.violations)}
          </Text>
        </View>

        {item.notes ? (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color={colors.disabled} />
      <Text style={styles.emptyTitle}>
        {hasActiveFilters
          ? t("search.noMatchingReports")
          : t("search.noReports")}
      </Text>
      <Text style={styles.emptySubtitle}>
        {hasActiveFilters
          ? t("search.noMatchingReportsSubtitle")
          : t("search.noReportsSubtitle")}
      </Text>
      {hasActiveFilters && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={onClearAllFilters}
        >
          <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Ionicons name="hourglass-outline" size={32} color={colors.primary} />
      <Text style={styles.loadingText}>{t("search.loadingReports")}</Text>
    </View>
  );

  if (isLoading) {
    return renderLoadingState();
  }

  return (
    <FlatList
      key={listKey}
      data={reports}
      renderItem={renderReportCard}
      keyExtractor={(item) => item.id}
      style={styles.reportsList}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={
        reports.length === 0 ? styles.emptyContainer : styles.listContainer
      }
      extraData={reports}
    />
  );
};

const styles = StyleSheet.create({
  reportsList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 0,
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  reportCard: {
    backgroundColor: semanticColors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: semanticColors.cardBorder,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  plateSection: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  plateContainer: {
    backgroundColor: semanticColors.plateNumberBackground,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  plateNumber: {
    color: semanticColors.plateNumberText,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  plateTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    gap: 4,
  },
  plateTypeBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  reportContent: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  violationsContainer: {
    marginTop: 5,
  },
  violationsLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  violationsText: {
    fontSize: 14,
    color: semanticColors.violationText,
    fontWeight: "500",
  },
  notesContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
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

export default SearchResults;
