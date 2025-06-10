import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationPicker from "../components/LocationPicker";
import InAppNotification from "../components/InAppNotification";
import colors, { semanticColors } from "../styles/colors";
import { PLATE_TYPES } from "../constants/plateTypes";

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
  const [plateType, setPlateType] = useState("regular");
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);
  const [notificationAnim] = useState(new Animated.Value(0));

  // Validation states
  const [plateError, setPlateError] = useState(false);
  const [violationsError, setViolationsError] = useState(false);
  const [locationError, setLocationError] = useState(false);

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

  const clearErrors = () => {
    setPlateError(false);
    setViolationsError(false);
    setLocationError(false);
  };

  const toggleViolation = (violationId) => {
    setSelectedViolations((prev) =>
      prev.includes(violationId)
        ? prev.filter((id) => id !== violationId)
        : [...prev, violationId]
    );
    // Clear violations error when user selects a violation
    if (violationsError) {
      setViolationsError(false);
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    // Clear location error when user selects a location
    if (locationError) {
      setLocationError(false);
    }
  };

  const handlePlateChange = (text) => {
    setPlateNumber(text);
    // Clear plate error when user starts typing
    if (plateError) {
      setPlateError(false);
    }
  };

  const openLocationPicker = () => {
    setShowLocationPicker(true);
  };

  const closeLocationPicker = () => {
    setShowLocationPicker(false);
  };

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!plateNumber.trim()) {
      setPlateError(true);
      isValid = false;
    }
    if (selectedViolations.length === 0) {
      setViolationsError(true);
      isValid = false;
    }
    if (!location) {
      setLocationError(true);
      isValid = false;
    }

    if (!isValid) {
      showNotification("Please fill in all required fields", "error");
    }

    return isValid;
  };

  const submitReport = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const report = {
        id: Date.now().toString(),
        plateNumber: plateNumber.toUpperCase().trim(),
        plateType: plateType,
        violations: selectedViolations,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
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

      // Reset form first
      resetForm();

      // Show success notification
      showNotification("Report submitted successfully!", "success");
    } catch (error) {
      console.error("Error saving report:", error);
      showNotification("Failed to save report. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPlateNumber("");
    setPlateType("regular");
    setSelectedViolations([]);
    setNotes("");
    setLocation(null);
    clearErrors();
  };

  const renderNotification = () => {
    return (
      <InAppNotification
        notification={notification}
        animationValue={notificationAnim}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {renderNotification()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Plate Number Input */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                plateError && styles.sectionTitleError,
              ]}
            >
              License Plate Number *
            </Text>
            <TextInput
              style={[styles.plateInput, plateError && styles.inputError]}
              value={plateNumber}
              onChangeText={handlePlateChange}
              placeholder="Enter plate number (e.g., ABC1234)"
              placeholderTextColor={semanticColors.inputPlaceholder}
              autoCapitalize="characters"
              maxLength={10}
            />
            {plateError && (
              <Text style={styles.errorText}>Plate number is required</Text>
            )}
          </View>

          {/* Plate Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plate Type</Text>
            <Text style={styles.sectionSubtitle}>
              Select the type of license plate
            </Text>
            <View style={styles.plateTypesGrid}>
              {PLATE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.plateTypeItem,
                    plateType === type.id && styles.plateTypeItemSelected,
                  ]}
                  onPress={() => setPlateType(type.id)}
                >
                  <Ionicons
                    name={type.icon}
                    size={20}
                    color={plateType === type.id ? colors.white : type.color}
                  />
                  <Text
                    style={[
                      styles.plateTypeText,
                      plateType === type.id && styles.plateTypeTextSelected,
                      {
                        color:
                          plateType === type.id ? colors.white : type.color,
                      },
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Violation Types */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                violationsError && styles.sectionTitleError,
              ]}
            >
              Violation Type(s) *
            </Text>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            <View
              style={[
                styles.violationsGrid,
                violationsError && styles.violationsGridError,
              ]}
            >
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
                        ? colors.white
                        : colors.primary
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
            {violationsError && (
              <Text style={styles.errorText}>
                Please select at least one violation type
              </Text>
            )}
          </View>

          {/* Location Picker */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                locationError && styles.sectionTitleError,
              ]}
            >
              Location *
            </Text>
            <TouchableOpacity
              style={[
                styles.locationPickerButton,
                locationError && styles.inputError,
              ]}
              onPress={openLocationPicker}
            >
              <View style={styles.locationPickerContent}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.primary}
                />
                <View style={styles.locationTextContainer}>
                  {location ? (
                    <>
                      <Text style={styles.locationSelectedText}>
                        Location Selected
                      </Text>
                      <Text
                        style={styles.locationAddressText}
                        numberOfLines={2}
                      >
                        {location.address}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.locationPlaceholderText}>
                      Tap to select violation location
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
            {locationError && (
              <Text style={styles.errorText}>Location is required</Text>
            )}
          </View>

          {/* Additional Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional details about the violation..."
              placeholderTextColor={semanticColors.inputPlaceholder}
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
              color={colors.white}
            />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPicker
        visible={showLocationPicker}
        onLocationSelect={handleLocationSelect}
        onClose={closeLocationPicker}
        initialLocation={location}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  plateInput: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: semanticColors.inputBorder,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  plateTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  plateTypeItem: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    minWidth: "45%",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  plateTypeItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  plateTypeText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: "center",
    fontWeight: "500",
  },
  plateTypeTextSelected: {
    color: colors.white,
  },
  violationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  violationItem: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    minWidth: "45%",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  violationItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  violationText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: "center",
    fontWeight: "500",
  },
  violationTextSelected: {
    color: colors.white,
  },
  locationPickerButton: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: semanticColors.inputBorder,
  },
  locationPickerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  locationSelectedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: semanticColors.successText,
    marginBottom: 2,
  },
  locationAddressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  locationPlaceholderText: {
    fontSize: 14,
    color: semanticColors.inputPlaceholder,
  },
  notesInput: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: semanticColors.inputBorder,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: colors.success,
    borderRadius: 10,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: semanticColors.buttonDisabled,
  },
  submitButtonText: {
    color: semanticColors.buttonPrimaryText,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionTitleError: {
    color: colors.error,
  },
  inputError: {
    borderColor: semanticColors.inputBorderError,
    borderWidth: 2,
  },
  violationsGridError: {
    borderWidth: 2,
    borderColor: colors.error,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.errorLight,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
    fontWeight: "500",
  },
});
