import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";

const PlateNumberInput = ({ plateNumber, onPlateNumberChange, plateError }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text
        style={[styles.sectionTitle, plateError && styles.sectionTitleError]}
      >
        {t("report.plateNumber")} {t("report.plateNumberRequired")}
      </Text>
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
        <Text style={styles.errorText}>{t("report.plateNumberError")}</Text>
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

export default PlateNumberInput;
