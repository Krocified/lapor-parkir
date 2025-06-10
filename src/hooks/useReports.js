import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export const useReports = (onError) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [listKey, setListKey] = useState(0);

  const loadReports = async () => {
    try {
      const storedReports = await AsyncStorage.getItem("parking_reports");
      const parsedReports = storedReports ? JSON.parse(storedReports) : [];
      setReports(parsedReports);
      return parsedReports;
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
      const updatedReports = reports.filter((report) => report.id !== reportId);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "parking_reports",
        JSON.stringify(updatedReports)
      );

      // Update local state
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
