import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors, { semanticColors } from "../../styles/colors";

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

const ViolationTypeSelector = ({
  selectedViolations,
  onToggleViolation,
  violationsError,
}) => {
  return (
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
            onPress={() => onToggleViolation(violation.id)}
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
  );
};

const styles = StyleSheet.create({
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
  sectionTitleError: {
    color: colors.error,
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

export default ViolationTypeSelector;
