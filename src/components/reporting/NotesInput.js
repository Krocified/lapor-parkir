import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";

const NotesInput = ({ notes, onNotesChange }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("report.notes")}</Text>
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
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: semanticColors.inputBorder,
    minHeight: 100,
  },
});

export default NotesInput;
