import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";
import Typography from "../common/Typography";

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
      <Typography variant="button" style={styles.submitButtonText}>
        {isSubmitting ? t("report.submittingButton") : t("report.submitButton")}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: semanticColors.buttonDisabled,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default SubmitButton;
