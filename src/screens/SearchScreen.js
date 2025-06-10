import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import InAppNotification from "../components/InAppNotification";
import ConfirmDialog from "../components/ConfirmDialog";
import SearchFilters, {
  FILTER_TYPES,
  DATE_FILTERS,
} from "../components/SearchFilters";
import SearchResults from "../components/SearchResults";
import colors from "../styles/colors";

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

  return (
    <View style={styles.container}>
      {/* Notification */}
      <InAppNotification
        notification={notification}
        animationValue={notificationAnim}
      />

      {/* Search Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={filterReports}
        activeFilterType={activeFilterType}
        onFilterTypeChange={setFilterType}
        activeDateFilter={activeDateFilter}
        onDateFilterChange={setDateFilter}
        selectedViolations={selectedViolations}
        onViolationToggle={toggleViolationFilter}
        onClearAllFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters()}
        reportsCount={reports.length}
        filteredCount={filteredReports.length}
      />

      {/* Search Results */}
      <SearchResults
        reports={filteredReports}
        isLoading={isLoading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onDeleteReport={deleteReport}
        hasActiveFilters={hasActiveFilters()}
        onClearAllFilters={clearAllFilters}
        listKey={listKey}
      />

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
});
