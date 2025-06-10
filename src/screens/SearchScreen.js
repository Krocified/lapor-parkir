import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import InAppNotification from "../components/InAppNotification";
import ConfirmDialog from "../components/ConfirmDialog";
import colors, { semanticColors } from "../styles/colors";

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

export default function SearchScreen() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listKey, setListKey] = useState(0);

  // Advanced filter states
  const [activeFilterType, setActiveFilterType] = useState(FILTER_TYPES.ALL);
  const [activeDateFilter, setActiveDateFilter] = useState(DATE_FILTERS.ALL);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Notification and dialog states
  const [notification, setNotification] = useState(null);
  const [notificationAnim] = useState(new Animated.Value(0));
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    reportId: null,
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    Animated.sequence([
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotification(null);
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const loadReports = async () => {
    try {
      const storedReports = await AsyncStorage.getItem("parking_reports");
      const parsedReports = storedReports ? JSON.parse(storedReports) : [];
      setReports(parsedReports);
      // Apply current filters to new data
      applyAllFilters(
        parsedReports,
        searchQuery,
        activeFilterType,
        activeDateFilter,
        selectedViolations
      );
    } catch (error) {
      console.error("Error loading reports:", error);
      showNotification("Failed to load reports", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const isDateInRange = (reportDate, dateFilter) => {
    if (dateFilter === DATE_FILTERS.ALL) return true;

    const today = new Date();
    const reportDateObj = new Date(reportDate);

    switch (dateFilter) {
      case DATE_FILTERS.TODAY:
        return reportDateObj.toDateString() === today.toDateString();

      case DATE_FILTERS.YESTERDAY:
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return reportDateObj.toDateString() === yesterday.toDateString();

      case DATE_FILTERS.LAST_WEEK:
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return reportDateObj >= weekAgo;

      case DATE_FILTERS.LAST_MONTH:
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return reportDateObj >= monthAgo;

      default:
        return true;
    }
  };

  const applyAllFilters = (
    reportsData,
    query,
    filterType,
    dateFilter,
    violationFilters
  ) => {
    let filtered = [...reportsData];

    // Apply date filter first
    if (dateFilter !== DATE_FILTERS.ALL) {
      filtered = filtered.filter((report) =>
        isDateInRange(report.date, dateFilter)
      );
    }

    // Apply violation filter
    if (violationFilters.length > 0) {
      filtered = filtered.filter((report) =>
        report.violations.some((violation) =>
          violationFilters.includes(violation)
        )
      );
    }

    // Apply text search with filter type
    if (query.trim()) {
      const searchTerm = query.toLowerCase();

      filtered = filtered.filter((report) => {
        switch (filterType) {
          case FILTER_TYPES.PLATES:
            return report.plateNumber.toLowerCase().includes(searchTerm);

          case FILTER_TYPES.LOCATION:
            return report.location.address.toLowerCase().includes(searchTerm);

          case FILTER_TYPES.NOTES:
            return report.notes.toLowerCase().includes(searchTerm);

          case FILTER_TYPES.ALL:
          default:
            return (
              report.plateNumber.toLowerCase().includes(searchTerm) ||
              report.location.address.toLowerCase().includes(searchTerm) ||
              report.violations.some((violationId) =>
                VIOLATION_LABELS[violationId]
                  ?.toLowerCase()
                  .includes(searchTerm)
              ) ||
              report.notes.toLowerCase().includes(searchTerm)
            );
        }
      });
    }

    setFilteredReports(filtered);
  };

  const filterReports = (query) => {
    setSearchQuery(query);
    applyAllFilters(
      reports,
      query,
      activeFilterType,
      activeDateFilter,
      selectedViolations
    );
  };

  const setFilterType = (filterType) => {
    setActiveFilterType(filterType);
    applyAllFilters(
      reports,
      searchQuery,
      filterType,
      activeDateFilter,
      selectedViolations
    );
  };

  const setDateFilter = (dateFilter) => {
    setActiveDateFilter(dateFilter);
    applyAllFilters(
      reports,
      searchQuery,
      activeFilterType,
      dateFilter,
      selectedViolations
    );
  };

  const toggleViolationFilter = (violationId) => {
    const newViolations = selectedViolations.includes(violationId)
      ? selectedViolations.filter((id) => id !== violationId)
      : [...selectedViolations, violationId];

    setSelectedViolations(newViolations);
    applyAllFilters(
      reports,
      searchQuery,
      activeFilterType,
      activeDateFilter,
      newViolations
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveFilterType(FILTER_TYPES.ALL);
    setActiveDateFilter(DATE_FILTERS.ALL);
    setSelectedViolations([]);
    setFilteredReports(reports);
  };

  const hasActiveFilters = () => {
    return (
      searchQuery ||
      activeFilterType !== FILTER_TYPES.ALL ||
      activeDateFilter !== DATE_FILTERS.ALL ||
      selectedViolations.length > 0
    );
  };

  const deleteReport = async (reportId) => {
    setConfirmDialog({
      visible: true,
      reportId: reportId,
    });
  };

  const handleConfirmDelete = async () => {
    const { reportId } = confirmDialog;
    setConfirmDialog({ visible: false, reportId: null });

    try {
      const updatedReports = reports.filter((report) => report.id !== reportId);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "parking_reports",
        JSON.stringify(updatedReports)
      );

      // Update local state
      setReports(updatedReports);

      // Re-apply current filter to updated data
      applyAllFilters(
        updatedReports,
        searchQuery,
        activeFilterType,
        activeDateFilter,
        selectedViolations
      );

      // Force list re-render
      setListKey((prev) => prev + 1);

      // Show success notification
      showNotification("Report deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting report:", error);
      showNotification("Failed to delete report. Please try again.", "error");
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ visible: false, reportId: null });
  };

  const formatViolations = (violations) => {
    return violations.map((id) => VIOLATION_LABELS[id]).join(", ");
  };

  const renderReportCard = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.plateContainer}>
          <Text style={styles.plateNumber}>{item.plateNumber}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteReport(item.id)}
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
          onPress={() => setFilterType(value)}
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
            onPress={() => setDateFilter(value)}
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
      {hasActiveFilters() && (
        <>
          <View style={styles.filterSeparator} />
          <TouchableOpacity
            style={[styles.filterChip, styles.clearFilterChip]}
            onPress={clearAllFilters}
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
                onPress={() => toggleViolationFilter(id)}
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
                setSelectedViolations([]);
                applyAllFilters(
                  reports,
                  searchQuery,
                  activeFilterType,
                  activeDateFilter,
                  []
                );
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color={colors.disabled} />
      <Text style={styles.emptyTitle}>
        {hasActiveFilters() ? "No matching reports found" : "No reports yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {hasActiveFilters()
          ? "Try adjusting your search terms or filters"
          : "Start by reporting a parking violation in the Report tab"}
      </Text>
      {hasActiveFilters() && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={clearAllFilters}
        >
          <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="hourglass-outline" size={32} color={colors.primary} />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Notification */}
      <InAppNotification
        notification={notification}
        animationValue={notificationAnim}
      />

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
          onChangeText={filterReports}
          placeholder={`Search in ${
            activeFilterType === FILTER_TYPES.ALL
              ? "all fields"
              : activeFilterType
          }...`}
          placeholderTextColor={colors.textMuted}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => filterReports("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Chips */}
      {renderFilterChips()}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredReports.length} of {reports.length} reports
          {hasActiveFilters() && " (filtered)"}
        </Text>
      </View>

      {/* Reports List */}
      <FlatList
        key={listKey}
        data={filteredReports}
        renderItem={renderReportCard}
        keyExtractor={(item) => item.id}
        style={styles.reportsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          filteredReports.length === 0 ? styles.emptyContainer : null
        }
        extraData={filteredReports}
      />

      {/* Filter Modal */}
      {renderFilterModal()}

      {/* Confirm Dialog */}
      <ConfirmDialog
        visible={confirmDialog.visible}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  statsContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 15,
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
    alignItems: "center",
    marginBottom: 15,
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
  emptyContainer: {
    flex: 1,
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
