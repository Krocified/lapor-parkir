import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import SearchBar from "./SearchBar";
import FilterChip from "./FilterChip";
import { SEARCH_TYPES } from "../../../utils/filterUtils";

const SearchBarSection = ({
  searchQuery,
  onSearchChange,
  searchType,
  hasActiveFilters,
  onClearFilters,
}) => {
  const { t } = useTranslation();

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

  return (
    <View style={styles.searchSection}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder={getSearchPlaceholder()}
        />
      </View>
      {hasActiveFilters && (
        <FilterChip
          label={t("search.clearFilters")}
          icon="close-circle-outline"
          isSpecial={true}
          onPress={onClearFilters}
          style={styles.clearButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 8,
  },
  searchBarContainer: {
    flex: 1,
  },
  clearButton: {
    marginLeft: 0,
  },
});

export default SearchBarSection;
