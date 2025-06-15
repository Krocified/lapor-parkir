import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import LocationPicker from "../components/LocationPicker";
import InAppNotification from "../components/InAppNotification";
import PlateNumberInput from "../components/reporting/PlateNumberInput";
import PlateTypeSelector from "../components/reporting/PlateTypeSelector";
import VehicleTypeSelector from "../components/reporting/VehicleTypeSelector";
import ViolationTypeSelector from "../components/reporting/ViolationTypeSelector";
import LocationSelector from "../components/reporting/LocationSelector";
import NotesInput from "../components/reporting/NotesInput";
import SubmitButton from "../components/reporting/SubmitButton";
import ApiService from "../services/api";
import colors from "../styles/colors";

export default function ReportScreen() {
  const { t } = useTranslation();

  const [plateNumber, setPlateNumber] = useState("");
  const [plateType, setPlateType] = useState("regular");
  const [vehicleType, setVehicleType] = useState("car");
  const [vehicleTypeExpanded, setVehicleTypeExpanded] = useState(false);
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
      showNotification(t("report.validationError"), "error");
    }

    return isValid;
  };

  const submitReport = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const reportData = {
        licensePlate: plateNumber.toUpperCase().trim(),
        vehicleType: vehicleType,
        violations: selectedViolations,
        location: location.address,
        notes: notes.trim(),
      };

      await ApiService.createReport(reportData);

      // Reset form first
      resetForm();

      // Show success notification
      showNotification(t("report.submitSuccess"), "success");
    } catch (error) {
      console.error("Error saving report:", error);
      showNotification(t("report.submitError"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPlateNumber("");
    setPlateType("regular");
    setVehicleType("car");
    setVehicleTypeExpanded(false);
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

          <VehicleTypeSelector
            vehicleType={vehicleType}
            onVehicleTypeChange={setVehicleType}
            isExpanded={vehicleTypeExpanded}
            onToggleExpanded={() =>
              setVehicleTypeExpanded(!vehicleTypeExpanded)
            }
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
