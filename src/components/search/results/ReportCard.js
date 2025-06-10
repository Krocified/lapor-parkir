import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../../styles/colors";
import { getPlateTypeInfo } from "../../../constants/plateTypes";
import {
  getViolationLabel,
  getPlateTypeLabel,
} from "../../../i18n/translations";

const ReportCard = React.memo(({ item, onDeleteReport }) => {
  const { t } = useTranslation();

  const formatViolations = (violations) => {
    return violations.map((id) => getViolationLabel(id, t)).join(", ");
  };

  const renderPlateTypeBadge = (plateType) => {
    if (!plateType || plateType === "regular") return null;

    const typeInfo = getPlateTypeInfo(plateType);
    return (
      <View
        style={[styles.plateTypeBadge, { backgroundColor: typeInfo.color }]}
      >
        <Ionicons name={typeInfo.icon} size={12} color={colors.white} />
        <Text style={styles.plateTypeBadgeText}>
          {getPlateTypeLabel(plateType, t)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.plateSection}>
          <View style={styles.plateContainer}>
            <Text style={styles.plateNumber}>{item.plateNumber}</Text>
          </View>
          {renderPlateTypeBadge(item.plateType)}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteReport(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.reportContent}>
        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText}>
            {item.date} at {item.time}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText} numberOfLines={2}>
            {item.location.address}
          </Text>
        </View>

        <View style={styles.violationsContainer}>
          <Text style={styles.violationsLabel}>
            {t("search.violationsLabel")}
          </Text>
          <Text style={styles.violationsText}>
            {formatViolations(item.violations)}
          </Text>
        </View>

        {item.notes ? (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: semanticColors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: semanticColors.cardBorder,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  plateSection: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  plateContainer: {
    backgroundColor: semanticColors.plateNumberBackground,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  plateNumber: {
    color: semanticColors.plateNumberText,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  plateTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    gap: 4,
  },
  plateTypeBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  reportContent: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  violationsContainer: {
    marginTop: 5,
  },
  violationsLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  violationsText: {
    fontSize: 14,
    color: semanticColors.violationText,
    fontWeight: "500",
  },
  notesContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default ReportCard;
