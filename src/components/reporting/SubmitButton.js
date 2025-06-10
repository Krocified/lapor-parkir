import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";

const SubmitButton = ({ onSubmit, isSubmitting }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
      onPress={onSubmit}
      disabled={isSubmitting}
    >
      <Ionicons
        name={isSubmitting ? "hourglass-outline" : "checkmark-circle-outline"}
        size={20}
        color={colors.white}
      />
      <Text style={styles.submitButtonText}>
        {isSubmitting ? t("report.submittingButton") : t("report.submitButton")}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default SubmitButton;
