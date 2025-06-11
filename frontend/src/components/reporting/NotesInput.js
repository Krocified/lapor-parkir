import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";
import Typography from "../common/Typography";

const NotesInput = ({ notes, onNotesChange }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Typography variant="h4" style={styles.sectionTitle}>
        {t("report.notes")}
      </Typography>
      <TextInput
        style={styles.notesInput}
        value={notes}
        onChangeText={onNotesChange}
        placeholder={t("report.notesPlaceholder")}
        placeholderTextColor={semanticColors.inputPlaceholder}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
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
  notesInput: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: semanticColors.inputBorder,
    minHeight: 100,
    fontFamily: "Inter-Regular",
  },
});

export default NotesInput;
