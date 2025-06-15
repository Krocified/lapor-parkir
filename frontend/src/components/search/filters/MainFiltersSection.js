import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import FilterChip from "./FilterChip";
import { SEARCH_TYPES } from "../../../utils/filterUtils";

const MainFiltersSection = ({
  searchType,
  onSearchTypeChange,
  plateTypeFilters,
  onPlateTypeFiltersChange,
  violationFilters,
  onViolationFiltersChange,
}) => {
  const { t } = useTranslation();

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
    <View style={styles.mainFiltersSection}>
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
          onPress={() => onPlateTypeFiltersChange([])}
        />

        {/* Violation Filter */}
        <FilterChip
          label={t("search.violationsFilter")}
          icon="options-outline"
          count={violationFilters.length}
          isActive={violationFilters.length > 0}
          onPress={() => onViolationFiltersChange([])}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainFiltersSection: {
    marginBottom: 8,
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

export default MainFiltersSection;
