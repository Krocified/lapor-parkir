import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import InAppNotification from "../components/InAppNotification";
import ConfirmDialog from "../components/ConfirmDialog";
import SearchFilters, {
  SEARCH_TYPES,
  DATE_FILTERS,
} from "../components/SearchFilters";
import SearchResults from "../components/SearchResults";
import { PLATE_TYPES } from "../constants/plateTypes";
import colors from "../styles/colors";

export default function SearchScreen() {
  const { t } = useTranslation();

  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listKey, setListKey] = useState(0);

  // Advanced filter states
  const [activeFilterType, setActiveFilterType] = useState(SEARCH_TYPES.ALL);
  const [activeDateFilter, setActiveDateFilter] = useState(DATE_FILTERS.ALL);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [selectedPlateTypes, setSelectedPlateTypes] = useState([]);

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
      applyAllFilters();
    } catch (error) {
      console.error("Error loading reports:", error);
      showNotification(t("search.loadError"), "error");
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

  // Apply all filters whenever any filter state changes
  useEffect(() => {
    applyAllFilters();
  }, [
    searchQuery,
    activeFilterType,
    activeDateFilter,
    selectedViolations,
    selectedPlateTypes,
    reports,
  ]);

  const applyAllFilters = () => {
    let filtered = [...reports];

    // Apply search filter
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter((report) => {
        switch (activeFilterType) {
          case SEARCH_TYPES.PLATES:
            return report.plateNumber.toLowerCase().includes(searchTerm);
          case SEARCH_TYPES.LOCATION:
            return report.location.address.toLowerCase().includes(searchTerm);
          case SEARCH_TYPES.NOTES:
            return report.notes.toLowerCase().includes(searchTerm);
          case SEARCH_TYPES.ALL:
          default:
            return (
              report.plateNumber.toLowerCase().includes(searchTerm) ||
              report.location.address.toLowerCase().includes(searchTerm) ||
              report.notes.toLowerCase().includes(searchTerm) ||
              report.violations.some((violation) =>
                violation.toLowerCase().includes(searchTerm)
              )
            );
        }
      });
    }

    // Apply date filter
    if (activeDateFilter !== DATE_FILTERS.ALL) {
      filtered = filtered.filter((report) =>
        isDateInRange(new Date(report.timestamp), activeDateFilter)
      );
    }

    // Apply violation filter
    if (selectedViolations.length > 0) {
      filtered = filtered.filter((report) =>
        selectedViolations.some((violation) =>
          report.violations.includes(violation)
        )
      );
    }

    // Apply plate type filter
    if (selectedPlateTypes.length > 0) {
      filtered = filtered.filter((report) =>
        selectedPlateTypes.includes(report.plateType || "regular")
      );
    }

    setFilteredReports(filtered);
  };

  const filterReports = (query) => {
    setSearchQuery(query);
    applyAllFilters();
  };

  const setFilterType = (filterType) => {
    setActiveFilterType(filterType);
    applyAllFilters();
  };

  const setDateFilter = (dateFilter) => {
    setActiveDateFilter(dateFilter);
    applyAllFilters();
  };

  const toggleViolationFilter = (violationId) => {
    const newViolations = selectedViolations.includes(violationId)
      ? selectedViolations.filter((id) => id !== violationId)
      : [...selectedViolations, violationId];

    setSelectedViolations(newViolations);
    applyAllFilters();
  };

  const togglePlateTypeFilter = (plateTypeId) => {
    const newPlateTypes = selectedPlateTypes.includes(plateTypeId)
      ? selectedPlateTypes.filter((id) => id !== plateTypeId)
      : [...selectedPlateTypes, plateTypeId];

    setSelectedPlateTypes(newPlateTypes);
    applyAllFilters();
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveFilterType(SEARCH_TYPES.ALL);
    setActiveDateFilter(DATE_FILTERS.ALL);
    setSelectedViolations([]);
    setSelectedPlateTypes([]);
  };

  const hasActiveFilters = () => {
    return (
      searchQuery ||
      activeFilterType !== SEARCH_TYPES.ALL ||
      activeDateFilter !== DATE_FILTERS.ALL ||
      selectedViolations.length > 0 ||
      selectedPlateTypes.length > 0
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
      applyAllFilters();

      // Force list re-render
      setListKey((prev) => prev + 1);

      // Show success notification
      showNotification(t("search.deleteSuccess"), "success");
    } catch (error) {
      console.error("Error deleting report:", error);
      showNotification(t("search.deleteError"), "error");
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
        onSearchChange={setSearchQuery}
        searchType={activeFilterType}
        onSearchTypeChange={setActiveFilterType}
        dateFilter={activeDateFilter}
        onDateFilterChange={setActiveDateFilter}
        plateTypeFilters={selectedPlateTypes}
        onPlateTypeFiltersChange={setSelectedPlateTypes}
        violationFilters={selectedViolations}
        onViolationFiltersChange={setSelectedViolations}
        onClearFilters={clearAllFilters}
        reportsCount={filteredReports.length}
        hasActiveFilters={hasActiveFilters()}
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
        title={t("search.deleteConfirmTitle")}
        message={t("search.deleteConfirmMessage")}
        confirmText={t("search.deleteConfirmButton")}
        cancelText={t("search.deleteCancelButton")}
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
