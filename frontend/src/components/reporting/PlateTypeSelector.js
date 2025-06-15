import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../styles/colors";
import { PLATE_TYPES } from "../../constants/plateTypes";
import { getPlateTypeLabel } from "../../i18n/translations";
import Typography from "../common/Typography";

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

  const handlePlateTypeChange = (type) => {
    onPlateTypeChange(type);
    onToggleExpanded(); // Auto close after selection
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.plateTypeSectionHeader}
        onPress={onToggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.plateTypeHeaderContent}>
          <Typography
            variant="h4"
            style={[styles.sectionTitle, styles.plateTypeSectionTitle]}
          >
            {t("report.plateType")}
          </Typography>
          <View style={styles.plateTypeHeaderRight}>
            <View style={styles.currentPlateTypeIndicator}>
              <Ionicons
                name={getCurrentPlateType().icon}
                size={16}
                color={getCurrentPlateType().color}
              />
              <Typography
                variant="caption"
                style={[
                  styles.currentPlateTypeText,
                  {
                    color: getCurrentPlateType().color,
                  },
                ]}
              >
                {getPlateTypeLabel(getCurrentPlateType().id, t)}
              </Typography>
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
          <Typography variant="body2" style={styles.sectionSubtitle}>
            {t("report.plateTypeSubtitle")}
          </Typography>
          <View style={styles.plateTypesGrid}>
            {PLATE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.plateTypeItem,
                  plateType === type.id && styles.plateTypeItemSelected,
                ]}
                onPress={() => handlePlateTypeChange(type.id)}
              >
                <Ionicons
                  name={type.icon}
                  size={16}
                  color={plateType === type.id ? colors.white : type.color}
                />
                <Typography
                  variant="overline"
                  style={[
                    styles.plateTypeText,
                    plateType === type.id && styles.plateTypeTextSelected,
                    {
                      color: plateType === type.id ? colors.white : type.color,
                    },
                  ]}
                >
                  {getPlateTypeLabel(type.id, t)}
                </Typography>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  plateTypeSectionHeader: {
    marginBottom: 8,
  },
  plateTypeHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
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
  },
  currentPlateTypeText: {
    fontSize: 14,
    color: colors.text,
  },
  plateTypeSectionTitle: {
    marginBottom: 0,
  },
  plateTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
    justifyContent: "center",
  },
  plateTypeItem: {
    backgroundColor: semanticColors.inputBackground,
    borderRadius: 8,
    padding: 12,
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
    fontSize: 14,
    textAlign: "center",
  },
  plateTypeTextSelected: {
    color: colors.white,
  },
});

export default PlateTypeSelector;
