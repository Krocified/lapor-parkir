import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";
import { PLATE_TYPES } from "../../constants/plateTypes";
import { getPlateTypeLabel } from "../../i18n/translations";

const PlateTypeSelector = ({
  plateType,
  onPlateTypeChange,
  plateTypeExpanded,
  onToggleExpanded,
}) => {
  const { t } = useTranslation();

  const getCurrentPlateType = () => {
    return PLATE_TYPES.find((type) => type.id === plateType) || PLATE_TYPES[0];
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.plateTypeSectionHeader}
        onPress={onToggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.plateTypeHeaderContent}>
          <Text style={[styles.sectionTitle, styles.plateTypeSectionTitle]}>
            {t("report.plateType")}
          </Text>
          <View style={styles.plateTypeHeaderRight}>
            <View style={styles.currentPlateTypeIndicator}>
              <Ionicons
                name={getCurrentPlateType().icon}
                size={16}
                color={getCurrentPlateType().color}
              />
              <Text
                style={[
                  styles.currentPlateTypeText,
                  {
                    color: getCurrentPlateType().color,
                  },
                ]}
              >
                {getPlateTypeLabel(getCurrentPlateType().id, t)}
              </Text>
            </View>
            <Ionicons
              name={plateTypeExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.textSecondary}
            />
          </View>
        </View>
      </TouchableOpacity>

      {plateTypeExpanded && (
        <>
          <Text style={styles.sectionSubtitle}>
            {t("report.plateTypeSubtitle")}
          </Text>
          <View style={styles.plateTypesGrid}>
            {PLATE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.plateTypeItem,
                  plateType === type.id && styles.plateTypeItemSelected,
                ]}
                onPress={() => onPlateTypeChange(type.id)}
              >
                <Ionicons
                  name={type.icon}
                  size={16}
                  color={plateType === type.id ? colors.white : type.color}
                />
                <Text
                  style={[
                    styles.plateTypeText,
                    plateType === type.id && styles.plateTypeTextSelected,
                    {
                      color: plateType === type.id ? colors.white : type.color,
                    },
                  ]}
                >
                  {getPlateTypeLabel(type.id, t)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
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
  plateTypeSectionHeader: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: semanticColors.inputBorder,
    marginBottom: 8,
  },
  plateTypeHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  plateTypeHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  currentPlateTypeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.surfaceSecondary,
  },
  currentPlateTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  plateTypeSectionTitle: {
    marginBottom: 0,
  },
  plateTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  plateTypeItem: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    minWidth: "30%",
    flexBasis: "30%",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  plateTypeItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  plateTypeText: {
    marginTop: 4,
    fontSize: 10,
    textAlign: "center",
    fontWeight: "500",
  },
  plateTypeTextSelected: {
    color: colors.white,
  },
});

export default PlateTypeSelector;
