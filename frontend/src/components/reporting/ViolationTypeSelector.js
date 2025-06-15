import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";
import { getViolationLabel } from "../../i18n/translations";
import Typography from "../common/Typography";

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
      <Typography
        variant="h4"
        style={[
          styles.sectionTitle,
          violationsError && styles.sectionTitleError,
        ]}
      >
        {t("report.violationType")} {t("report.violationTypeRequired")}
      </Typography>
      <Typography variant="body2" style={styles.sectionSubtitle}>
        {t("report.violationTypeSubtitle")}
      </Typography>
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
            <Typography
              variant="caption"
              style={[
                styles.violationText,
                selectedViolations.includes(violation.id) &&
                  styles.violationTextSelected,
              ]}
            >
              {getViolationLabel(violation.id, t)}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
      {violationsError && (
        <Typography variant="caption" style={styles.errorText}>
          {t("report.violationTypeError")}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionTitleError: {
    color: colors.error,
  },
  violationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  violationItem: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  violationItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  violationText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
  },
  violationTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  violationsGridError: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(255, 59, 48, 0.05)",
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
});

export default ViolationTypeSelector;
