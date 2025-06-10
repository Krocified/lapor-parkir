import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";

const LocationSelector = ({ location, onLocationPress, locationError }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text
        style={[styles.sectionTitle, locationError && styles.sectionTitleError]}
      >
        {t("report.location")} {t("report.locationRequired")}
      </Text>
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
                <Text style={styles.locationSelectedText}>
                  {t("report.locationSelected")}
                </Text>
                <Text style={styles.locationAddressText} numberOfLines={2}>
                  {location.address}
                </Text>
              </>
            ) : (
              <Text style={styles.locationPlaceholderText}>
                {t("report.locationPlaceholder")}
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
        <Text style={styles.errorText}>{t("report.locationError")}</Text>
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
  inputError: {
    borderColor: semanticColors.inputBorderError,
    borderWidth: 2,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
    fontWeight: "500",
  },
});

export default LocationSelector;
