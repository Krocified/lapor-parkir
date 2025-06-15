import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import InAppNotification from "../components/InAppNotification";
import ConfirmDialog from "../components/ConfirmDialog";
import SearchFilters from "../components/search/filters/SearchFilters";
import SearchResults from "../components/search/results/SearchResults";
import { useNotification } from "../hooks/useNotification";
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import { useReports } from "../hooks/useReports";
import { useSearchFilters } from "../hooks/useSearchFilters";
import colors from "../styles/colors";

export default function SearchScreen() {
  const { t } = useTranslation();

  // Custom hooks
  const { notification, notificationAnim, showNotification } =
    useNotification();
  const { confirmDialog, showConfirmDialog, handleConfirm, handleCancel } =
    useConfirmDialog();
  const { reports, isLoading, refreshing, listKey, onRefresh, deleteReport } =
    useReports(showNotification);

  const {
    searchQuery,
    activeFilterType,
    activeDateFilter,
    selectedViolations,
    selectedPlateTypes,
    filteredReports,
    setSearchQuery,
    setActiveFilterType,
    setActiveDateFilter,
    setSelectedViolations,
    setSelectedPlateTypes,
    clearAllFilters,
    hasActiveFilters,
  } = useSearchFilters(reports);

  const handleDeleteReport = (reportId) => {
    showConfirmDialog(reportId);
  };

  const confirmDeleteReport = async (reportId) => {
    try {
      await deleteReport(reportId);
      showNotification(t("search.deleteSuccess"), "success");
    } catch (error) {
      showNotification(t("search.deleteError"), "error");
    }
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
        hasActiveFilters={hasActiveFilters}
        onRefresh={onRefresh}
      />

      {/* Search Results */}
      <SearchResults
        reports={filteredReports}
        isLoading={isLoading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onDeleteReport={handleDeleteReport}
        hasActiveFilters={hasActiveFilters}
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
        onConfirm={() => handleConfirm(confirmDeleteReport)}
        onCancel={() => handleCancel()}
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
