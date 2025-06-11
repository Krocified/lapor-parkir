import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ApiService from "../services/api";

export const useReports = (onError) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [listKey, setListKey] = useState(0);

  const loadReports = async () => {
    try {
      const fetchedReports = await ApiService.getReports();
      setReports(fetchedReports);
      return fetchedReports;
    } catch (error) {
      console.error("Error loading reports:", error);
      if (onError) {
        onError("Error loading reports", "error");
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const deleteReport = async (reportId) => {
    try {
      await ApiService.deleteReport(reportId);

      // Update local state
      const updatedReports = reports.filter((report) => report.id !== reportId);
      setReports(updatedReports);

      // Force list re-render
      setListKey((prev) => prev + 1);

      return updatedReports;
    } catch (error) {
      console.error("Error deleting report:", error);
      if (onError) {
        onError("Error deleting report", "error");
      }
      throw error;
    }
  };

  const forceRerender = () => {
    setListKey((prev) => prev + 1);
  };

  // Load reports when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  return {
    reports,
    isLoading,
    refreshing,
    listKey,
    loadReports,
    onRefresh,
    deleteReport,
    forceRerender,
  };
};
