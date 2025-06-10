import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../styles/colors";
import { PLATE_TYPES } from "../constants/plateTypes";
import { getViolationLabel, getPlateTypeLabel } from "../i18n/translations";

export const SEARCH_TYPES = {
  ALL: "all",
  PLATES: "plates",
  LOCATION: "location",
  NOTES: "notes",
};

export const DATE_FILTERS = {
  ALL: "all",
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_WEEK: "last_week",
  LAST_MONTH: "last_month",
  CUSTOM: "custom",
};

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  searchType,
  onSearchTypeChange,
  dateFilter,
  onDateFilterChange,
  plateTypeFilters,
  onPlateTypeFiltersChange,
  violationFilters,
  onViolationFiltersChange,
  onClearFilters,
  reportsCount,
  hasActiveFilters,
}) => {
  const { t } = useTranslation();

  const [showPlateTypeModal, setShowPlateTypeModal] = React.useState(false);
  const [showViolationModal, setShowViolationModal] = React.useState(false);

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case SEARCH_TYPES.ALL:
        return t("search.searchPlaceholderAllFields");
      case SEARCH_TYPES.PLATES:
        return t("search.searchPlaceholderPlates");
      case SEARCH_TYPES.LOCATION:
        return t("search.searchPlaceholderLocation");
      case SEARCH_TYPES.NOTES:
        return t("search.searchPlaceholderNotes");
      default:
        return t("search.searchPlaceholder");
    }
  };

  const getDateFilterLabel = (filter) => {
    switch (filter) {
      case DATE_FILTERS.ALL:
        return t("search.dateFilterAny");
      case DATE_FILTERS.TODAY:
        return t("search.dateFilterToday");
      case DATE_FILTERS.YESTERDAY:
        return t("search.dateFilterYesterday");
      case DATE_FILTERS.LAST_WEEK:
        return t("search.dateFilterLastWeek");
      case DATE_FILTERS.LAST_MONTH:
        return t("search.dateFilterLastMonth");
      default:
        return filter.charAt(0).toUpperCase() + filter.slice(1);
    }
  };

  const getSearchTypeLabel = (type) => {
    switch (type) {
      case SEARCH_TYPES.ALL:
        return t("search.filterAllFields");
      case SEARCH_TYPES.PLATES:
        return t("search.filterPlates");
      case SEARCH_TYPES.LOCATION:
        return t("search.filterLocation");
      case SEARCH_TYPES.NOTES:
        return t("search.filterNotes");
      default:
        return type;
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder={getSearchPlaceholder()}
          placeholderTextColor={colors.textMuted}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange("")}
            style={styles.clearSearchButton}
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersContainer}
      >
        {/* Search Type Filters */}
        {Object.entries(SEARCH_TYPES).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterChip,
              searchType === value && styles.filterChipActive,
            ]}
            onPress={() => onSearchTypeChange(value)}
          >
            <Text
              style={[
                styles.filterChipText,
                searchType === value && styles.filterChipTextActive,
              ]}
            >
              {getSearchTypeLabel(value)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Plate Type Filter */}
        <TouchableOpacity
          style={[
            styles.filterChip,
            plateTypeFilters.length > 0 && styles.filterChipActive,
          ]}
          onPress={() => setShowPlateTypeModal(true)}
        >
          <Ionicons
            name="shield-outline"
            size={14}
            color={
              plateTypeFilters.length > 0 ? colors.white : colors.textSecondary
            }
            style={styles.filterChipIcon}
          />
          <Text
            style={[
              styles.filterChipText,
              plateTypeFilters.length > 0 && styles.filterChipTextActive,
            ]}
          >
            {t("search.plateTypesFilter")}{" "}
            {plateTypeFilters.length > 0 && `(${plateTypeFilters.length})`}
          </Text>
        </TouchableOpacity>

        {/* Violation Filter */}
        <TouchableOpacity
          style={[
            styles.filterChip,
            violationFilters.length > 0 && styles.filterChipActive,
          ]}
          onPress={() => setShowViolationModal(true)}
        >
          <Ionicons
            name="options-outline"
            size={14}
            color={
              violationFilters.length > 0 ? colors.white : colors.textSecondary
            }
            style={styles.filterChipIcon}
          />
          <Text
            style={[
              styles.filterChipText,
              violationFilters.length > 0 && styles.filterChipTextActive,
            ]}
          >
            {t("search.violationsFilter")}{" "}
            {violationFilters.length > 0 && `(${violationFilters.length})`}
          </Text>
        </TouchableOpacity>

        {/* Date Filters */}
        {Object.entries(DATE_FILTERS)
          .filter(([key]) => key !== "CUSTOM")
          .map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterChip,
                dateFilter === value && styles.filterChipActive,
              ]}
              onPress={() => onDateFilterChange(value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  dateFilter === value && styles.filterChipTextActive,
                ]}
              >
                {getDateFilterLabel(value)}
              </Text>
            </TouchableOpacity>
          ))}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <TouchableOpacity
            style={[styles.filterChip, styles.clearFiltersChip]}
            onPress={onClearFilters}
          >
            <Ionicons
              name="close-circle-outline"
              size={14}
              color={colors.primary}
              style={styles.filterChipIcon}
            />
            <Text style={[styles.filterChipText, styles.clearFiltersText]}>
              {t("search.clearFilters")}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {t("search.reportStats", { count: reportsCount })}
          {hasActiveFilters && t("search.statsFiltered")}
        </Text>
      </View>

      {/* Plate Type Modal */}
      <Modal
        visible={showPlateTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlateTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("search.modalPlateTypesTitle")}
              </Text>
              <TouchableOpacity onPress={() => setShowPlateTypeModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {PLATE_TYPES.map((plateType) => (
                <TouchableOpacity
                  key={plateType.id}
                  style={styles.modalItem}
                  onPress={() => {
                    const isSelected = plateTypeFilters.includes(plateType.id);
                    if (isSelected) {
                      onPlateTypeFiltersChange(
                        plateTypeFilters.filter((id) => id !== plateType.id)
                      );
                    } else {
                      onPlateTypeFiltersChange([
                        ...plateTypeFilters,
                        plateType.id,
                      ]);
                    }
                  }}
                >
                  <View style={styles.modalItemContent}>
                    <Ionicons
                      name={plateType.icon}
                      size={20}
                      color={plateType.color}
                      style={styles.modalItemIcon}
                    />
                    <Text style={styles.modalItemText}>
                      {getPlateTypeLabel(plateType.id, t)}
                    </Text>
                  </View>
                  {plateTypeFilters.includes(plateType.id) && (
                    <Ionicons name="checkmark" size={20} color={colors.white} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalClearButton}
              onPress={() => {
                onPlateTypeFiltersChange([]);
                setShowPlateTypeModal(false);
              }}
            >
              <Text style={styles.modalClearButtonText}>
                {t("search.modalClearPlateTypes")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Violation Modal */}
      <Modal
        visible={showViolationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowViolationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("search.modalViolationsTitle")}
              </Text>
              <TouchableOpacity onPress={() => setShowViolationModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {[
                "double_parking",
                "no_parking_zone",
                "handicap_spot",
                "fire_hydrant",
                "crosswalk",
                "expired_meter",
                "blocking_driveway",
                "no_stopping",
              ].map((violationId) => (
                <TouchableOpacity
                  key={violationId}
                  style={styles.modalItem}
                  onPress={() => {
                    const isSelected = violationFilters.includes(violationId);
                    if (isSelected) {
                      onViolationFiltersChange(
                        violationFilters.filter((id) => id !== violationId)
                      );
                    } else {
                      onViolationFiltersChange([
                        ...violationFilters,
                        violationId,
                      ]);
                    }
                  }}
                >
                  <Text style={styles.modalItemText}>
                    {getViolationLabel(violationId, t)}
                  </Text>
                  {violationFilters.includes(violationId) && (
                    <Ionicons name="checkmark" size={20} color={colors.white} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalClearButton}
              onPress={() => {
                onViolationFiltersChange([]);
                setShowViolationModal(false);
              }}
            >
              <Text style={styles.modalClearButtonText}>
                {t("search.modalClearViolations")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Remove flex: 1 to prevent unnecessary expansion
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: semanticColors.inputBackground,
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: semanticColors.inputBorder,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearSearchButton: {
    padding: 5,
  },
  filtersScrollView: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexShrink: 0,
    height: 44,
    flexGrow: 0,
  },
  filtersContainer: {
    gap: 6,
    paddingRight: 15,
    alignItems: "center",
    height: 28,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: semanticColors.chipBorder,
    borderRadius: 12,
    backgroundColor: semanticColors.chipBackground,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    height: 28,
    flexShrink: 0,
  },
  filterChipActive: {
    backgroundColor: semanticColors.chipActiveBackground,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: semanticColors.chipText,
    fontWeight: "500",
    lineHeight: 16,
  },
  filterChipTextActive: {
    color: semanticColors.chipActiveText,
    fontWeight: "600",
  },
  filterChipIcon: {
    marginRight: 10,
  },
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
  filteredText: {
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: semanticColors.modalOverlay,
    padding: 20,
  },
  modalContent: {
    backgroundColor: semanticColors.modalBackground,
    borderRadius: 15,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.modalBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  modalBody: {
    padding: 20,
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  modalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalItemIcon: {
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  modalClearButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  modalClearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  clearFiltersChip: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  clearFiltersText: {
    color: colors.primary,
  },
});

export default SearchFilters;
