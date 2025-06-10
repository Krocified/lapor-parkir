import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationPicker from "../components/LocationPicker";
import InAppNotification from "../components/InAppNotification";
import PlateNumberInput from "../components/reporting/PlateNumberInput";
import PlateTypeSelector from "../components/reporting/PlateTypeSelector";
import ViolationTypeSelector from "../components/reporting/ViolationTypeSelector";
import LocationSelector from "../components/reporting/LocationSelector";
import NotesInput from "../components/reporting/NotesInput";
import SubmitButton from "../components/reporting/SubmitButton";
import colors from "../styles/colors";

export default function ReportScreen() {
  const [plateNumber, setPlateNumber] = useState("");
  const [plateType, setPlateType] = useState("regular");
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [plateTypeExpanded, setPlateTypeExpanded] = useState(false);

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
    setPlateTypeExpanded(false);
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
          <PlateNumberInput
            plateNumber={plateNumber}
            onPlateNumberChange={handlePlateChange}
            plateError={plateError}
          />

          <PlateTypeSelector
            plateType={plateType}
            onPlateTypeChange={setPlateType}
            plateTypeExpanded={plateTypeExpanded}
            onToggleExpanded={() => setPlateTypeExpanded(!plateTypeExpanded)}
          />

          <ViolationTypeSelector
            selectedViolations={selectedViolations}
            onToggleViolation={toggleViolation}
            violationsError={violationsError}
          />

          <LocationSelector
            location={location}
            onLocationPress={openLocationPicker}
            locationError={locationError}
          />

          <NotesInput notes={notes} onNotesChange={setNotes} />

          <SubmitButton onSubmit={submitReport} isSubmitting={isSubmitting} />
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
});
