import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import SearchBar from "./SearchBar";
import FilterChip from "./FilterChip";
import FilterModal from "./FilterModal";
import StatsDisplay from "./StatsDisplay";
import { PLATE_TYPES } from "../../../constants/plateTypes";
import {
  getViolationLabel,
  getPlateTypeLabel,
} from "../../../i18n/translations";
import { SEARCH_TYPES, DATE_FILTERS } from "../../../utils/filterUtils";

const VIOLATION_TYPES = [
  "double_parking",
  "no_parking_zone",
  "handicap_spot",
  "fire_hydrant",
  "crosswalk",
  "expired_meter",
  "blocking_driveway",
  "no_stopping",
];

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
  const [showPlateTypeModal, setShowPlateTypeModal] = useState(false);
  const [showViolationModal, setShowViolationModal] = useState(false);

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

  const togglePlateType = (plateTypeId) => {
    const isSelected = plateTypeFilters.includes(plateTypeId);
    if (isSelected) {
      onPlateTypeFiltersChange(
        plateTypeFilters.filter((id) => id !== plateTypeId)
      );
    } else {
      onPlateTypeFiltersChange([...plateTypeFilters, plateTypeId]);
    }
  };

  const toggleViolation = (violationId) => {
    const isSelected = violationFilters.includes(violationId);
    if (isSelected) {
      onViolationFiltersChange(
        violationFilters.filter((id) => id !== violationId)
      );
    } else {
      onViolationFiltersChange([...violationFilters, violationId]);
    }
  };

  const plateTypeItems = PLATE_TYPES.map((plateType) => ({
    id: plateType.id,
    label: getPlateTypeLabel(plateType.id, t),
    icon: plateType.icon,
    color: plateType.color,
  }));

  const violationItems = VIOLATION_TYPES.map((violationId) => ({
    id: violationId,
    label: getViolationLabel(violationId, t),
  }));

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder={getSearchPlaceholder()}
      />

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersContainer}
      >
        {/* Search Type Filters */}
        {Object.entries(SEARCH_TYPES).map(([key, value]) => (
          <FilterChip
            key={key}
            label={getSearchTypeLabel(value)}
            isActive={searchType === value}
            onPress={() => onSearchTypeChange(value)}
          />
        ))}

        {/* Plate Type Filter */}
        <FilterChip
          label={t("search.plateTypesFilter")}
          icon="shield-outline"
          count={plateTypeFilters.length}
          isActive={plateTypeFilters.length > 0}
          onPress={() => setShowPlateTypeModal(true)}
        />

        {/* Violation Filter */}
        <FilterChip
          label={t("search.violationsFilter")}
          icon="options-outline"
          count={violationFilters.length}
          isActive={violationFilters.length > 0}
          onPress={() => setShowViolationModal(true)}
        />

        {/* Date Filters */}
        {Object.entries(DATE_FILTERS)
          .filter(([key]) => key !== "CUSTOM")
          .map(([key, value]) => (
            <FilterChip
              key={key}
              label={getDateFilterLabel(value)}
              isActive={dateFilter === value}
              onPress={() => onDateFilterChange(value)}
            />
          ))}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <FilterChip
            label={t("search.clearFilters")}
            icon="close-circle-outline"
            isSpecial={true}
            onPress={onClearFilters}
          />
        )}
      </ScrollView>

      {/* Stats */}
      <StatsDisplay count={reportsCount} hasActiveFilters={hasActiveFilters} />

      {/* Plate Type Modal */}
      <FilterModal
        visible={showPlateTypeModal}
        onClose={() => setShowPlateTypeModal(false)}
        title={t("search.modalPlateTypesTitle")}
        items={plateTypeItems}
        selectedItems={plateTypeFilters}
        onToggleItem={togglePlateType}
        onClearAll={() => onPlateTypeFiltersChange([])}
        clearButtonText={t("search.modalClearPlateTypes")}
      />

      {/* Violation Modal */}
      <FilterModal
        visible={showViolationModal}
        onClose={() => setShowViolationModal(false)}
        title={t("search.modalViolationsTitle")}
        items={violationItems}
        selectedItems={violationFilters}
        onToggleItem={toggleViolation}
        onClearAll={() => onViolationFiltersChange([])}
        clearButtonText={t("search.modalClearViolations")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Remove flex: 1 to prevent unnecessary expansion
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
});

export default SearchFilters;
