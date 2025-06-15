import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import StatsDisplay from "./StatsDisplay";
import SearchBarSection from "./SearchBarSection";
import MainFiltersSection from "./MainFiltersSection";
import DateFiltersSection from "./DateFiltersSection";

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
  onRefresh,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <SearchBarSection
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchType={searchType}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
      />

      <MainFiltersSection
        searchType={searchType}
        onSearchTypeChange={onSearchTypeChange}
        plateTypeFilters={plateTypeFilters}
        onPlateTypeFiltersChange={onPlateTypeFiltersChange}
        violationFilters={violationFilters}
        onViolationFiltersChange={onViolationFiltersChange}
      />

      <DateFiltersSection
        dateFilter={dateFilter}
        onDateFilterChange={onDateFilterChange}
      />

      <StatsDisplay
        count={reportsCount}
        hasActiveFilters={hasActiveFilters}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
});

export default SearchFilters;
