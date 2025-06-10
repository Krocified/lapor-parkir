import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";
import { getViolationLabel } from "../../i18n/translations";

const VIOLATION_TYPES = [
  { id: "double_parking", icon: "car-outline" },
  { id: "no_parking_zone", icon: "ban-outline" },
  { id: "handicap_spot", icon: "accessibility-outline" },
  { id: "fire_hydrant", icon: "flame-outline" },
  { id: "crosswalk", icon: "walk-outline" },
  { id: "expired_meter", icon: "time-outline" },
  { id: "blocking_driveway", icon: "home-outline" },
  { id: "no_stopping", icon: "stop-circle-outline" },
];

const ViolationTypeSelector = ({
  selectedViolations,
  onToggleViolation,
  violationsError,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          violationsError && styles.sectionTitleError,
        ]}
      >
        {t("report.violationType")} {t("report.violationTypeRequired")}
      </Text>
      <Text style={styles.sectionSubtitle}>
        {t("report.violationTypeSubtitle")}
      </Text>
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
              {getViolationLabel(violation.id, t)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {violationsError && (
        <Text style={styles.errorText}>{t("report.violationTypeError")}</Text>
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
