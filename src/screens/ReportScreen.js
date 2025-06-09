import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VIOLATION_TYPES = [
  { id: "double_parking", label: "Double Parking", icon: "car-outline" },
  { id: "no_parking_zone", label: "No Parking Zone", icon: "ban-outline" },
  {
    id: "handicap_spot",
    label: "Illegal Handicap Parking",
    icon: "accessibility-outline",
  },
  { id: "fire_hydrant", label: "Blocking Fire Hydrant", icon: "flame-outline" },
  { id: "crosswalk", label: "Blocking Crosswalk", icon: "walk-outline" },
  { id: "expired_meter", label: "Expired Meter", icon: "time-outline" },
  { id: "blocking_driveway", label: "Blocking Driveway", icon: "home-outline" },
  { id: "no_stopping", label: "No Stopping Zone", icon: "stop-circle-outline" },
];

export default function ReportScreen() {
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is needed to report violations"
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Get address from coordinates
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addressResult) {
        const formattedAddress = `${addressResult.street || ""} ${
          addressResult.streetNumber || ""
        }, ${addressResult.city || ""}, ${addressResult.region || ""}`.trim();
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Could not get current location");
    }
  };

  const toggleViolation = (violationId) => {
    setSelectedViolations((prev) =>
      prev.includes(violationId)
        ? prev.filter((id) => id !== violationId)
        : [...prev, violationId]
    );
  };

  const validateForm = () => {
    if (!plateNumber.trim()) {
      Alert.alert("Error", "Please enter a plate number");
      return false;
    }
    if (selectedViolations.length === 0) {
      Alert.alert("Error", "Please select at least one violation type");
      return false;
    }
    if (!location) {
      Alert.alert(
        "Error",
        "Location is required. Please enable location services"
      );
      return false;
    }
    return true;
  };

  const submitReport = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const report = {
        id: Date.now().toString(),
        plateNumber: plateNumber.toUpperCase().trim(),
        violations: selectedViolations,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address,
        },
        notes: notes.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };

      // Get existing reports
      const existingReports = await AsyncStorage.getItem("parking_reports");
      const reports = existingReports ? JSON.parse(existingReports) : [];

      // Add new report
      reports.unshift(report);

      // Save back to storage
      await AsyncStorage.setItem("parking_reports", JSON.stringify(reports));

      Alert.alert(
        "Success",
        "Parking violation report submitted successfully!",
        [{ text: "OK", onPress: resetForm }]
      );
    } catch (error) {
      console.error("Error saving report:", error);
      Alert.alert("Error", "Failed to save report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPlateNumber("");
    setSelectedViolations([]);
    setNotes("");
    getCurrentLocation(); // Refresh location
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Plate Number Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>License Plate Number</Text>
            <TextInput
              style={styles.plateInput}
              value={plateNumber}
              onChangeText={setPlateNumber}
              placeholder="Enter plate number (e.g., ABC1234)"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              maxLength={10}
            />
          </View>

          {/* Violation Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Violation Type(s)</Text>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            <View style={styles.violationsGrid}>
              {VIOLATION_TYPES.map((violation) => (
                <TouchableOpacity
                  key={violation.id}
                  style={[
                    styles.violationItem,
                    selectedViolations.includes(violation.id) &&
                      styles.violationItemSelected,
                  ]}
                  onPress={() => toggleViolation(violation.id)}
                >
                  <Ionicons
                    name={violation.icon}
                    size={24}
                    color={
                      selectedViolations.includes(violation.id)
                        ? "#fff"
                        : "#e74c3c"
                    }
                  />
                  <Text
                    style={[
                      styles.violationText,
                      selectedViolations.includes(violation.id) &&
                        styles.violationTextSelected,
                    ]}
                  >
                    {violation.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#e74c3c" />
              <Text style={styles.locationText}>
                {address || "Getting location..."}
              </Text>
              <TouchableOpacity
                onPress={getCurrentLocation}
                style={styles.refreshLocation}
              >
                <Ionicons name="refresh" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional details about the violation..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={submitReport}
            disabled={isSubmitting}
          >
            <Ionicons
              name={
                isSubmitting ? "hourglass-outline" : "checkmark-circle-outline"
              }
              size={20}
              color="#fff"
            />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  plateInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  violationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  violationItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    minWidth: "45%",
    borderWidth: 2,
    borderColor: "#e74c3c",
  },
  violationItemSelected: {
    backgroundColor: "#e74c3c",
    borderColor: "#c0392b",
  },
  violationText: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  violationTextSelected: {
    color: "#fff",
  },
  locationContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  locationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  refreshLocation: {
    padding: 5,
  },
  notesInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: "#27ae60",
    borderRadius: 10,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
