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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
      setFilteredReports(parsedReports);
    } catch (error) {
      console.error("Error loading reports:", error);
      Alert.alert("Error", "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const filterReports = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter((report) => {
      const searchTerm = query.toLowerCase();
      return (
        report.plateNumber.toLowerCase().includes(searchTerm) ||
        report.location.address.toLowerCase().includes(searchTerm) ||
        report.violations.some((violationId) =>
          VIOLATION_LABELS[violationId]?.toLowerCase().includes(searchTerm)
        ) ||
        report.notes.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredReports(filtered);
  };

  const deleteReport = async (reportId) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedReports = reports.filter(
                (report) => report.id !== reportId
              );
              await AsyncStorage.setItem(
                "parking_reports",
                JSON.stringify(updatedReports)
              );
              setReports(updatedReports);
              filterReports(searchQuery); // Re-apply current filter
            } catch (error) {
              console.error("Error deleting report:", error);
              Alert.alert("Error", "Failed to delete report");
            }
          },
        },
      ]
    );
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
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <View style={styles.reportContent}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.date} at {item.time}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color="#bdc3c7" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No matching reports found" : "No reports yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "Try adjusting your search terms"
          : "Start by reporting a parking violation in the Report tab"}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="hourglass-outline" size={32} color="#e74c3c" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={filterReports}
          placeholder="Search by plate, location, violation, or notes..."
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => filterReports("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredReports.length} of {reports.length} reports
        </Text>
      </View>

      {/* Reports List */}
      <FlatList
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
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
    color: "#666",
    fontWeight: "500",
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
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
    backgroundColor: "#e74c3c",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  plateNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  deleteButton: {
    padding: 5,
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
    color: "#333",
    flex: 1,
  },
  violationsContainer: {
    marginTop: 5,
  },
  violationsLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  violationsText: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "500",
  },
  notesContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
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
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
