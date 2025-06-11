import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";
import Typography from "../common/Typography";

const LocationSelector = ({ location, onLocationPress, locationError }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Typography
        variant="h4"
        style={[styles.sectionTitle, locationError && styles.sectionTitleError]}
      >
        {t("report.location")} {t("report.locationRequired")}
      </Typography>
      <TouchableOpacity
        style={[
          styles.locationPickerButton,
          locationError && styles.inputError,
        ]}
        onPress={onLocationPress}
      >
        <View style={styles.locationPickerContent}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <View style={styles.locationTextContainer}>
            {location ? (
              <>
                <Typography
                  variant="subtitle2"
                  style={styles.locationSelectedText}
                >
                  {t("report.locationSelected")}
                </Typography>
                <Typography
                  variant="body2"
                  style={styles.locationAddressText}
                  numberOfLines={2}
                >
                  {location.address}
                </Typography>
              </>
            ) : (
              <Typography
                variant="body1"
                style={styles.locationPlaceholderText}
              >
                {t("report.locationPlaceholder")}
              </Typography>
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
        <Typography variant="caption" style={styles.errorText}>
          {t("report.locationError")}
        </Typography>
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionTitleError: {
    color: colors.error,
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
    color: colors.primary,
    marginBottom: 2,
  },
  locationAddressText: {
    color: colors.textPrimary,
    lineHeight: 18,
  },
  locationPlaceholderText: {
    color: semanticColors.inputPlaceholder,
  },
  inputError: {
    borderColor: semanticColors.inputBorderError,
    borderWidth: 2,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
  },
});

export default LocationSelector;
