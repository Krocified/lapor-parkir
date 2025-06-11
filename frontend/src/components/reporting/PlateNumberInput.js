import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";
import Typography from "../common/Typography";

const PlateNumberInput = ({ plateNumber, onPlateNumberChange, plateError }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Typography
        variant="h4"
        style={[styles.sectionTitle, plateError && styles.sectionTitleError]}
      >
        {t("report.plateNumber")} {t("report.plateNumberRequired")}
      </Typography>
      <TextInput
        style={[styles.plateInput, plateError && styles.inputError]}
        value={plateNumber}
        onChangeText={onPlateNumberChange}
        placeholder={t("report.plateNumberPlaceholder")}
        placeholderTextColor={semanticColors.inputPlaceholder}
        autoCapitalize="characters"
        maxLength={25}
      />
      {plateError && (
        <Typography variant="caption" style={styles.errorText}>
          {t("report.plateNumberError")}
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
  plateInput: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: semanticColors.inputBorder,
    textAlign: "center",
    fontFamily: "Inter-Bold",
    letterSpacing: 2,
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

export default PlateNumberInput;
