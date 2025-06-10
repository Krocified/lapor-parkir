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
import colors, { semanticColors } from "../styles/colors";

const FILTER_TYPES = {
  ALL: "all",
  PLATES: "plates",
  LOCATION: "location",
  NOTES: "notes",
};

const DATE_FILTERS = {
  ALL: "all",
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_WEEK: "last_week",
  LAST_MONTH: "last_month",
  CUSTOM: "custom",
};

const VIOLATION_LABELS = {
  double_parking: "Double Parking",
  no_parking_zone: "No Parking Zone",
  handicap_spot: "Illegal Handicap Parking",
  fire_hydrant: "Blocking Fire Hydrant",
  crosswalk: "Blocking Crosswalk",
  expired_meter: "Expired Meter",
  blocking_driveway: "Blocking Driveway",
  no_stopping: "No Stopping Zone",
};

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  activeFilterType,
  onFilterTypeChange,
  activeDateFilter,
  onDateFilterChange,
  selectedViolations,
  onViolationToggle,
  onClearAllFilters,
  hasActiveFilters,
  reportsCount,
  filteredCount,
}) => {
  const [showFilterModal, setShowFilterModal] = React.useState(false);

  const renderSearchBar = () => (
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
        placeholder={`Search in ${
          activeFilterType === FILTER_TYPES.ALL
            ? "all fields"
            : activeFilterType
        }...`}
        placeholderTextColor={colors.textMuted}
      />
      {searchQuery ? (
        <TouchableOpacity
          onPress={() => onSearchChange("")}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderFilterChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterChipsContainer}
      contentContainerStyle={styles.filterChipsContent}
    >
      {/* Search Type Filters */}
      {Object.entries(FILTER_TYPES).map(([key, value]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.filterChip,
            activeFilterType === value && styles.activeFilterChip,
          ]}
          onPress={() => onFilterTypeChange(value)}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilterType === value && styles.activeFilterChipText,
            ]}
          >
            {key === "ALL"
              ? "All Fields"
              : key.charAt(0) + key.slice(1).toLowerCase()}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Violation Type Filters */}
      <TouchableOpacity
        style={[
          styles.filterChip,
          styles.advancedFilterChip,
          selectedViolations.length > 0 && styles.activeFilterChip,
        ]}
        onPress={() => setShowFilterModal(true)}
      >
        <Ionicons
          name="options-outline"
          size={14}
          color={
            selectedViolations.length > 0 ? colors.white : colors.textSecondary
          }
        />
        <Text
          style={[
            styles.filterChipText,
            selectedViolations.length > 0 && styles.activeFilterChipText,
          ]}
        >
          Violations{" "}
          {selectedViolations.length > 0 && `(${selectedViolations.length})`}
        </Text>
      </TouchableOpacity>

      {/* Date Filters */}
      <View style={styles.filterSeparator} />
      {Object.entries(DATE_FILTERS)
        .slice(0, -1)
        .map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterChip,
              activeDateFilter === value && styles.activeFilterChip,
            ]}
            onPress={() => onDateFilterChange(value)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeDateFilter === value && styles.activeFilterChipText,
              ]}
            >
              {key === "ALL"
                ? "Any Date"
                : key === "LAST_WEEK"
                ? "Last Week"
                : key === "LAST_MONTH"
                ? "Last Month"
                : key.charAt(0) + key.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <>
          <View style={styles.filterSeparator} />
          <TouchableOpacity
            style={[styles.filterChip, styles.clearFilterChip]}
            onPress={onClearAllFilters}
          >
            <Ionicons
              name="close-circle-outline"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.filterChipText, { color: colors.primary }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Violations</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {Object.entries(VIOLATION_LABELS).map(([id, label]) => (
              <TouchableOpacity
                key={id}
                style={[
                  styles.violationOption,
                  selectedViolations.includes(id) &&
                    styles.selectedViolationOption,
                ]}
                onPress={() => onViolationToggle(id)}
              >
                <Text
                  style={[
                    styles.violationOptionText,
                    selectedViolations.includes(id) &&
                      styles.selectedViolationOptionText,
                  ]}
                >
                  {label}
                </Text>
                {selectedViolations.includes(id) && (
                  <Ionicons name="checkmark" size={20} color={colors.white} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearViolationsButton}
              onPress={() => {
                selectedViolations.forEach((id) => onViolationToggle(id));
              }}
            >
              <Text style={styles.clearViolationsButtonText}>
                Clear Violations
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsText}>
        {filteredCount} of {reportsCount} reports
        {hasActiveFilters && " (filtered)"}
      </Text>
    </View>
  );

  return (
    <>
      {renderSearchBar()}
      {renderFilterChips()}
      {renderStats()}
      {renderFilterModal()}
    </>
  );
};

const styles = StyleSheet.create({
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
  clearButton: {
    padding: 5,
  },
  filterChipsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexShrink: 0,
    height: 44,
    flexGrow: 0,
  },
  filterChipsContent: {
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
  activeFilterChip: {
    backgroundColor: semanticColors.chipActiveBackground,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: semanticColors.chipText,
    fontWeight: "500",
    lineHeight: 16,
  },
  activeFilterChipText: {
    color: semanticColors.chipActiveText,
    fontWeight: "600",
  },
  filterSeparator: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
    marginHorizontal: 6,
    alignSelf: "center",
  },
  advancedFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clearFilterChip: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  statsContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
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
  violationOption: {
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
  selectedViolationOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  violationOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  selectedViolationOptionText: {
    color: colors.white,
    fontWeight: "600",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: semanticColors.modalBorder,
    gap: 10,
  },
  clearViolationsButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
  },
  clearViolationsButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  applyButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
});

export { FILTER_TYPES, DATE_FILTERS };
export default SearchFilters;
